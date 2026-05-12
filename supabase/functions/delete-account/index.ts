// supabase/functions/delete-account/index.ts
//
// Account deletion edge function. Apple 5.1.1(v) requires in-app deletion.
// This function runs with the service role:
//   1. Cancels active Stripe subscription (if web-billed).
//   2. Deletes the RevenueCat customer (severs Apple/Google entitlements).
//   3. Deletes the Supabase auth user — cascades through profiles +
//      profile_standards + entitlements + push_tokens.
//   4. Writes a final audit_log row before the cascade nulls out the actor.
//
// Caller is the authenticated user (verified via the request JWT).

// deno-lint-ignore-file no-explicit-any
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  const authHeader = req.headers.get('authorization') ?? '';
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { global: { headers: { Authorization: authHeader } } },
  );

  // Identify the caller from the JWT.
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) {
    return new Response('Unauthorized', { status: 401 });
  }
  const userId = userData.user.id;

  // 1. Log first — once the auth user is gone, actor_id loses meaning.
  await supabase.from('audit_log').insert({
    actor_id: userId,
    action: 'account_delete_requested',
    target: userId,
  });

  // 2. Cancel Stripe subscription (if any). Look up the entitlement row.
  const { data: ent } = await supabase
    .from('entitlements')
    .select('source, product_id, rc_customer_id')
    .eq('profile_id', userId)
    .maybeSingle();

  if (ent?.source === 'stripe' && Deno.env.get('STRIPE_SECRET_KEY')) {
    try {
      // Lightweight Stripe REST call — full SDK isn't necessary.
      await fetch(`https://api.stripe.com/v1/subscriptions/${ent.product_id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${Deno.env.get('STRIPE_SECRET_KEY')}` },
      });
    } catch (e) {
      console.warn('Stripe cancellation failed (continuing):', e);
    }
  }

  // 3. Delete RevenueCat customer.
  if (ent?.rc_customer_id) {
    try {
      const rcKey = Deno.env.get('REVENUECAT_SECRET_KEY');
      if (rcKey) {
        await fetch(`https://api.revenuecat.com/v1/subscribers/${ent.rc_customer_id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${rcKey}` },
        });
      }
    } catch (e) {
      console.warn('RC delete failed (continuing):', e);
    }
  }

  // 4. Delete the auth user. ON DELETE CASCADE removes app rows.
  const { error: delErr } = await supabase.auth.admin.deleteUser(userId);
  if (delErr) {
    return new Response(JSON.stringify({ error: delErr.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'content-type': 'application/json' },
  });
});
