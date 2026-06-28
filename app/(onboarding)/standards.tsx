import { useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { track } from '@/lib/posthog';
import {
  assignPathFromDiagnostic,
  PILLARS,
  type DiagnosticAnswers,
} from '@/lib/roundTableModel';

const PILLAR_OPTIONS = PILLARS.slice(0, 8).map((pillar) => pillar.title);
type Pillar = (typeof PILLAR_OPTIONS)[number];

type Row = { pillar: Pillar; statement: string };

const MAX_ROWS = 5;
const MAX_CHARS = 140;

const DIAGNOSTIC_ITEMS = [
  ['body', 'Body'],
  ['money', 'Money'],
  ['time', 'Time'],
  ['relationships', 'Relationships'],
  ['business', 'Business'],
  ['presence', 'Presence'],
] as const;

export default function Standards() {
  const router = useRouter();
  const user = useAuth((s) => s.user);
  const refreshProfile = useAuth((s) => s.refreshProfile);
  const demo = useAuth((s) => s.demo);
  const demoAdvance = useAuth((s) => s.demoAdvance);
  const [rows, setRows] = useState<Row[]>([{ pillar: 'Leadership', statement: '' }]);
  const [diagnostic, setDiagnostic] = useState<DiagnosticAnswers>({
    body: 0,
    money: 0,
    time: 0,
    relationships: 0,
    business: 0,
    presence: 0,
  });
  const [saving, setSaving] = useState(false);

  const assignedPath = assignPathFromDiagnostic(diagnostic);

  function updateRow(i: number, patch: Partial<Row>) {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }

  function addRow() {
    if (rows.length >= MAX_ROWS) return;
    setRows((prev) => [...prev, { pillar: 'Body', statement: '' }]);
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
          pillar: r.pillar.toLowerCase().replace(/ /g, '_').replace(/and/g, 'and'),
          statement: r.statement.trim().slice(0, MAX_CHARS),
        }));
      const stamp = new Date().toISOString();

      if (demo) {
        demoAdvance({
          standards_declared_at: stamp,
          transformation_path: assignedPath.id,
        });
      } else {
        const { error: insertErr } = await supabase.from('profile_standards').insert(payload);
        if (insertErr) throw insertErr;
        const { error: profErr } = await supabase
          .from('profiles')
          .update({ standards_declared_at: stamp })
          .eq('id', user.id);
        if (profErr) throw profErr;
        await refreshProfile();
      }

      track('standards_declared', { count: payload.length, path: assignedPath.id });
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
      <ScrollView contentContainerClassName="mx-auto w-full max-w-3xl px-6 pt-16 pb-12">
        <Text className="font-body text-brass text-xs tracking-widest">
          ONBOARDING DIAGNOSTIC
        </Text>
        <Text className="mt-2 font-display text-ivory text-3xl tracking-wide">
          Find your first campaign.
        </Text>
        <Text className="mt-3 font-body text-ivory-dim text-sm leading-6">
          Score where you need the most pressure. Your answers assign a path
          for the first 90 days. Then declare the standards the room can hold
          you to.
        </Text>

        <View className="mt-8 rounded-2xl border border-brass/30 bg-brass/10 p-5">
          <Text className="font-body text-brass text-xs tracking-widest">
            ASSIGNED PATH
          </Text>
          <Text className="mt-2 font-display text-ivory text-2xl">
            {assignedPath.title}
          </Text>
          <Text className="mt-2 font-body text-ivory-dim text-sm leading-6">
            {assignedPath.promise}
          </Text>
        </View>

        <View className="mt-8 gap-4">
          {DIAGNOSTIC_ITEMS.map(([key, label]) => (
            <View key={key} className="rounded-xl border border-ivory-dim/15 bg-charcoal-800 p-4">
              <Text className="font-body text-ivory text-sm">{label}</Text>
              <Text className="mt-1 font-body text-ivory-dim text-xs">
                0 = stable, 5 = needs immediate pressure
              </Text>
              <View className="mt-3 flex-row gap-2">
                {[0, 1, 2, 3, 4, 5].map((score) => (
                  <Pressable
                    key={score}
                    onPress={() => setDiagnostic((prev) => ({ ...prev, [key]: score }))}
                    className={`h-9 flex-1 items-center justify-center rounded-lg border ${
                      diagnostic[key] === score
                        ? 'border-brass bg-brass/20'
                        : 'border-ivory-dim/20'
                    }`}
                  >
                    <Text
                      className={
                        diagnostic[key] === score
                          ? 'font-body text-brass text-xs'
                          : 'font-body text-ivory-dim text-xs'
                      }
                    >
                      {score}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ))}
        </View>

        <View className="mt-10 gap-5">
          <Text className="font-body text-ivory-dim text-xs tracking-widest">
            DECLARE 1-5 STANDARDS
          </Text>
          {rows.map((row, i) => (
            <View key={i} className="rounded-xl border border-ivory-dim/15 bg-charcoal-800 p-4">
              <View className="flex-row flex-wrap gap-2">
                {PILLAR_OPTIONS.map((p) => (
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
                placeholder="I keep my word when no one is watching."
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
                Add another standard ({rows.length}/{MAX_ROWS})
              </Text>
            </Pressable>
          )}
        </View>
      </ScrollView>

      <View className="border-t border-ivory-dim/10 bg-charcoal px-6 pb-10 pt-4">
        <Pressable
          onPress={onDeclare}
          disabled={!valid || saving}
          className="mx-auto w-full max-w-3xl rounded-xl bg-brass px-6 py-4 active:opacity-80 disabled:opacity-30"
        >
          <Text className="text-center font-display text-charcoal text-base tracking-wider">
            {saving ? 'ASSIGNING...' : 'ACCEPT PATH AND DECLARE'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
