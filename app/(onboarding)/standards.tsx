import { useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { track } from '@/lib/posthog';

/**
 * Ritual Step 3 — Standards declaration. The user declares 1–5 personal
 * standards, each tagged to one of the 7 pillars. Minimum 1 to proceed.
 * Each statement is hard-capped at 140 chars.
 *
 * Pillars are canonical from product-brief.md §3.
 */

const PILLARS = [
  'Fitness',
  'Investing',
  'Style',
  'Relationship Building',
  'Time Management',
  'Business Building',
  'Leadership',
] as const;
type Pillar = (typeof PILLARS)[number];

type Row = { pillar: Pillar; statement: string };

const MAX_ROWS = 5;
const MAX_CHARS = 140;

export default function Standards() {
  const router = useRouter();
  const { user, refreshProfile } = useAuth();
  const [rows, setRows] = useState<Row[]>([{ pillar: 'Leadership', statement: '' }]);
  const [saving, setSaving] = useState(false);

  function updateRow(i: number, patch: Partial<Row>) {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }
  function addRow() {
    if (rows.length >= MAX_ROWS) return;
    setRows((prev) => [...prev, { pillar: 'Fitness', statement: '' }]);
  }
  function removeRow(i: number) {
    if (rows.length <= 1) return;
    setRows((prev) => prev.filter((_, idx) => idx !== i));
  }

  const valid = rows.some((r) => r.statement.trim().length > 0);

  async function onDeclare() {
    if (!user || !valid) return;
    setSaving(true);
    try {
      const payload = rows
        .filter((r) => r.statement.trim().length > 0)
        .map((r) => ({
          profile_id: user.id,
          pillar: r.pillar.toLowerCase().replace(/ /g, '_'),
          statement: r.statement.trim().slice(0, MAX_CHARS),
        }));

      const { error: insertErr } = await supabase.from('profile_standards').insert(payload);
      if (insertErr) throw insertErr;

      const { error: profErr } = await supabase
        .from('profiles')
        .update({ standards_declared_at: new Date().toISOString() })
        .eq('id', user.id);
      if (profErr) throw profErr;

      track('standards_declared', { count: payload.length });
      await refreshProfile();
      router.replace('/(onboarding)/paywall');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Could not save.';
      if (Platform.OS === 'web') window.alert(msg);
      else Alert.alert('Could not save', msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <View className="flex-1 bg-charcoal">
      <ScrollView contentContainerClassName="px-6 pt-24 pb-12">
        <Text className="font-display text-ivory text-3xl tracking-wide">
          State your standards
        </Text>
        <Text className="mt-3 font-body text-ivory-dim text-sm leading-5">
          These are visible on your profile. You can revise them — but every
          revision is logged. The table sees who's actually moving.
        </Text>

        <View className="mt-8 gap-5">
          {rows.map((row, i) => (
            <View key={i} className="rounded-xl border border-ivory-dim/15 bg-charcoal-50 p-4">
              <View className="flex-row flex-wrap gap-2">
                {PILLARS.map((p) => (
                  <Pressable
                    key={p}
                    onPress={() => updateRow(i, { pillar: p })}
                    className={`rounded-full border px-3 py-1.5 ${
                      row.pillar === p
                        ? 'border-brass bg-brass/20'
                        : 'border-ivory-dim/30'
                    }`}
                  >
                    <Text
                      className={`font-body text-xs ${
                        row.pillar === p ? 'text-brass' : 'text-ivory-dim'
                      }`}
                    >
                      {p}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <TextInput
                value={row.statement}
                onChangeText={(t) => updateRow(i, { statement: t.slice(0, MAX_CHARS) })}
                placeholder="Train six days a week. No exceptions."
                placeholderTextColor="#7A7466"
                multiline
                className="mt-4 min-h-[64px] font-body text-ivory text-base leading-6"
              />
              <View className="mt-2 flex-row items-center justify-between">
                <Text className="font-body text-ivory-dim text-xs">
                  {row.statement.length}/{MAX_CHARS}
                </Text>
                {rows.length > 1 && (
                  <Pressable onPress={() => removeRow(i)}>
                    <Text className="font-body text-crimson-light text-xs">Remove</Text>
                  </Pressable>
                )}
              </View>
            </View>
          ))}

          {rows.length < MAX_ROWS && (
            <Pressable
              onPress={addRow}
              className="rounded-xl border border-dashed border-ivory-dim/30 px-4 py-4"
            >
              <Text className="text-center font-body text-ivory-dim text-sm">
                + Add another standard ({rows.length}/{MAX_ROWS})
              </Text>
            </Pressable>
          )}
        </View>
      </ScrollView>

      <View className="border-t border-ivory-dim/10 bg-charcoal px-6 pb-10 pt-4">
        <Pressable
          onPress={onDeclare}
          disabled={!valid || saving}
          className="rounded-xl bg-brass px-6 py-4 active:opacity-80 disabled:opacity-30"
        >
          <Text className="text-center font-display text-charcoal text-base tracking-wider">
            {saving ? 'DECLARING…' : 'DECLARE'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
