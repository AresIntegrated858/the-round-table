import { Pressable, ScrollView, Text, View } from 'react-native';
import { useRoundTableStore } from '@/lib/roundTableStore';

export default function ReviewUtility() {
  const { application, setApplicationStatus, commandScore, checkIns, wins, localTable } =
    useRoundTableStore();

  return (
    <ScrollView
      className="flex-1 bg-charcoal"
      contentContainerClassName="mx-auto w-full max-w-5xl px-6 pt-12 pb-12"
    >
      <Text className="font-body text-brass text-xs tracking-widest">
        COUNCIL REVIEW
      </Text>
      <Text className="mt-2 font-display text-ivory text-4xl tracking-wide">
        Application and member signal.
      </Text>
      <Text className="mt-3 font-body text-ivory-dim text-sm leading-6">
        MVP utility for manual review. This shows the original application,
        current status, and proof signals generated inside the app.
      </Text>

      <View className="mt-8 rounded-2xl border border-brass/30 bg-brass/10 p-5">
        <Text className="font-body text-brass text-xs tracking-widest">
          STATUS
        </Text>
        <Text className="mt-2 font-display text-ivory text-3xl">
          {application.status.toUpperCase()}
        </Text>
        <View className="mt-4 flex-row flex-wrap gap-3">
          {(['approved', 'rejected', 'draft'] as const).map((status) => (
            <Pressable
              key={status}
              onPress={() => setApplicationStatus(status)}
              className={`rounded-full border px-4 py-2 ${
                application.status === status ? 'border-brass bg-brass/20' : 'border-ivory-dim/20'
              }`}
            >
              <Text className={application.status === status ? 'font-body text-brass text-xs' : 'font-body text-ivory-dim text-xs'}>
                {status.toUpperCase()}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View className="mt-6 gap-4 md:flex-row">
        <Metric label="Command score" value={`${commandScore()}/100`} />
        <Metric label="Check-ins" value={`${checkIns.length}`} />
        <Metric label="Wins" value={`${wins.length}`} />
        <Metric label="Local table" value={localTable ?? 'Unset'} />
      </View>

      <View className="mt-6 rounded-2xl border border-ivory-dim/15 bg-charcoal-800 p-5">
        <Text className="font-body text-ivory-dim text-xs tracking-widest">
          APPLICATION
        </Text>
        <Field label="Name" value={application.fullName || 'Not captured'} />
        <Field label="Location" value={application.cityState || 'Not captured'} />
        <Field label="Age" value={application.age || 'Not captured'} />
        <Field label="Strongest" value={application.strongest || 'Not answered'} />
        <Field label="Weakest" value={application.weakest || 'Not answered'} />
        <Field label="Tired of tolerating" value={application.tolerating || 'Not answered'} />
        <Field label="Why The Round Table" value={application.why || 'Not answered'} />
      </View>
    </ScrollView>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 rounded-2xl border border-ivory-dim/15 bg-charcoal-800 p-5">
      <Text className="font-body text-ivory-dim text-xs tracking-widest">
        {label.toUpperCase()}
      </Text>
      <Text className="mt-2 font-display text-brass text-2xl">{value}</Text>
    </View>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <View className="mt-5 border-b border-ivory-dim/10 pb-4">
      <Text className="font-body text-brass text-xs tracking-widest">
        {label.toUpperCase()}
      </Text>
      <Text className="mt-2 font-body text-ivory text-sm leading-6">{value}</Text>
    </View>
  );
}
