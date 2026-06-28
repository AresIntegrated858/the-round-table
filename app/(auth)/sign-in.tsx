import { useState } from 'react';
import { Pressable, Text, TextInput, View, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { track } from '@/lib/posthog';

/**
 * Sign-in surface. Three paths:
 *   1. Apple Sign-In  — required on iOS for App Store compliance (4.8)
 *   2. Google Sign-In — convenience for Android + web
 *   3. Email magic link — fallback / web primary
 *
 * Native Apple/Google buttons are wired in M0.1 once expo-apple-authentication
 * and @react-native-google-signin/google-signin are linked. For now the stubs
 * are visible but disabled so the design footprint is locked.
 */
export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sending, setSending] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [sent, setSent] = useState(false);

  async function signInWithPassword() {
    if (!email.trim() || !password) return;
    setSigningIn(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (error) throw error;
      track('signup_started', { method: 'password' });
      router.replace('/(app)');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Could not sign in.';
      if (Platform.OS === 'web') {
        window.alert(msg);
      } else {
        Alert.alert('Could not sign in', msg);
      }
    } finally {
      setSigningIn(false);
    }
  }

  async function sendMagicLink() {
    if (!email.trim()) return;
    setSending(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: Platform.OS === 'web'
            ? `${window.location.origin}/auth-callback`
            : 'theroundtable://auth-callback',
        },
      });
      if (error) throw error;
      track('signup_started', { method: 'email' });
      setSent(true);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Could not send link.';
      if (Platform.OS === 'web') {
        window.alert(msg);
      } else {
        Alert.alert('Could not send link', msg);
      }
    } finally {
      setSending(false);
    }
  }

  return (
    <View className="flex-1 bg-charcoal px-6 pt-24">
      <Pressable onPress={() => router.back()} className="mb-12">
        <Text className="font-body text-ivory-dim text-sm">‹ Back</Text>
      </Pressable>

      <Text className="font-display text-ivory text-3xl tracking-wide">
        Sit at the table
      </Text>
      <Text className="mt-2 font-body text-ivory-dim text-sm">
        Membership is by paid subscription. Sign in to begin.
      </Text>

      {sent ? (
        <View className="mt-12 rounded-xl border border-brass/40 bg-brass/5 px-5 py-6">
          <Text className="font-display text-ivory text-lg">Check your email.</Text>
          <Text className="mt-2 font-body text-ivory-dim text-sm leading-5">
            We sent a one-time link to {email}. Open it on this device to continue.
          </Text>
        </View>
      ) : (
        <View className="mt-10 gap-3">
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor="#7A7466"
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            className="rounded-xl border border-ivory-dim/20 bg-charcoal-800 px-4 py-4 font-body text-ivory"
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor="#7A7466"
            autoCapitalize="none"
            autoComplete="password"
            secureTextEntry
            className="rounded-xl border border-ivory-dim/20 bg-charcoal-800 px-4 py-4 font-body text-ivory"
          />
          <Pressable
            disabled={signingIn || !email.trim() || !password}
            onPress={signInWithPassword}
            className="rounded-xl bg-brass px-6 py-4 active:opacity-80 disabled:opacity-40"
          >
            <Text className="text-center font-display text-charcoal text-base tracking-wider">
              {signingIn ? 'ENTERING…' : 'SIGN IN'}
            </Text>
          </Pressable>
          <Pressable
            disabled={sending || !email.trim()}
            onPress={sendMagicLink}
            className="rounded-xl border border-brass/40 px-6 py-4 active:opacity-80 disabled:opacity-40"
          >
            <Text className="text-center font-display text-brass text-base tracking-wider">
              {sending ? 'SENDING…' : 'SEND LINK'}
            </Text>
          </Pressable>

          {Platform.OS === 'ios' && (
            <Pressable className="mt-4 rounded-xl border border-ivory/30 px-6 py-4 active:opacity-70" disabled>
              <Text className="text-center font-body text-ivory-dim text-base">
                Continue with Apple (M0.1)
              </Text>
            </Pressable>
          )}
          <Pressable className="rounded-xl border border-ivory/30 px-6 py-4 active:opacity-70" disabled>
            <Text className="text-center font-body text-ivory-dim text-base">
              Continue with Google (M0.1)
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
