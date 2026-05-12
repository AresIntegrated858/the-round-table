import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';

type StandardRow = { id: string; pillar: string; statement: string };

export default function StandardsTab() {
  const { user } = useAuth();
  const [rows, setRows] = useState<StandardRow[]>([]);

  useEffect(() => {
    if (!user) return;
    void (async () => {
      const { data } = await supabase
        .from('profile_standards')
        .select('id, pillar, statement')
        .eq('profile_id', user.id);
      setRows((data ?? []) as StandardRow[]);
    })();
  }, [user]);

  return (
    <ScrollView className="flex-1 bg-charcoal" contentContainerClassName="px-6 pt-20 pb-12">
      <Text className="font-body text-ivory-dim text-xs tracking-widest">
        YOUR STANDARDS
      </Text>
      <Text className="mt-2 font-display text-ivory text-3xl tracking-wide">
        What you declared
      </Text>

      <View className="mt-8 gap-3">
        {rows.length === 0 ? (
          <Text className="font-body text-ivory-dim text-sm">No standards yet.</Text>
        ) : (
          rows.map((r) => (
            <View key={r.id} className="rounded-xl border border-ivory-dim/15 bg-charcoal-50 p-4">
              <Text className="font-body text-brass text-[11px] tracking-widest uppercase">
                {r.pillar.replace(/_/g, ' ')}
              </Text>
              <Text className="mt-2 font-body text-ivory text-base leading-6">
                {r.statement}
              </Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}
