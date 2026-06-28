import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useRoundTableStore } from '@/lib/roundTableStore';
import type { CouncilReviewItem, CouncilReviewType, SeatStatus } from '@/lib/roundTableEngine';

const REVIEW_TYPES: CouncilReviewType[] = ['application', 'proof', 'promotion', 'warning', 'removal'];
const SEATS: SeatStatus[] = ['applicant', 'initiate', 'member', 'command', 'council'];

export default function ReviewUtility() {
  const {
    application,
    seatStatus,
    councilReviewItems,
    setApplicationStatus,
    setSeatStatus,
    addCouncilReviewItem,
    resolveCouncilReviewItem,
    commandScore,
    proofPosts,
    warRoomPosts,
    brotherhoodRequests,
    localTable,
  } = useRoundTableStore();
  const [type, setType] = useState<CouncilReviewType>('promotion');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  function submitReviewItem() {
    addCouncilReviewItem({ type, title, body });
    setTitle('');
    setBody('');
  }

  return (
    <ScrollView
      className="flex-1 bg-charcoal"
      contentContainerClassName="mx-auto w-full max-w-6xl px-6 pt-12 pb-12"
    >
      <Text className="font-body text-brass text-xs tracking-widest">
        COUNCIL REVIEW
      </Text>
      <Text className="mt-2 font-display text-ivory text-4xl tracking-wide">
        Protect the room.
      </Text>
      <Text className="mt-3 font-body text-ivory-dim text-sm leading-6">
        Manual review keeps the culture from becoming a low-standard group chat.
        Applications, warnings, proof, removals, and promotions live here.
      </Text>

      <View className="mt-8 rounded-2xl border border-brass/30 bg-brass/10 p-5">
        <Text className="font-body text-brass text-xs tracking-widest">
          APPLICATION STATUS
        </Text>
        <Text className="mt-2 font-display text-ivory text-3xl">
          {application.status.toUpperCase()} / {seatStatus.toUpperCase()}
        </Text>
        <View className="mt-4 flex-row flex-wrap gap-3">
          {(['approved', 'rejected', 'draft'] as const).map((status) => (
            <Chip
              key={status}
              label={status}
              active={application.status === status}
              onPress={() => setApplicationStatus(status)}
            />
          ))}
        </View>
        <View className="mt-4 flex-row flex-wrap gap-3">
          {SEATS.map((seat) => (
            <Chip
              key={seat}
              label={seat}
              active={seatStatus === seat}
              onPress={() => setSeatStatus(seat)}
            />
          ))}
        </View>
      </View>

      <View className="mt-6 gap-4 md:flex-row">
        <Metric label="Command score" value={`${commandScore()}/100`} />
        <Metric label="Proof" value={`${proofPosts.length}`} />
        <Metric label="War Room" value={`${warRoomPosts.length}`} />
        <Metric label="Requests" value={`${brotherhoodRequests.length}`} />
        <Metric label="Local" value={localTable ?? 'Unset'} />
      </View>

      <View className="mt-6 rounded-2xl border border-ivory-dim/15 bg-charcoal-800 p-5">
        <Text className="font-body text-ivory-dim text-xs tracking-widest">
          CREATE COUNCIL ITEM
        </Text>
        <View className="mt-4 flex-row flex-wrap gap-2">
          {REVIEW_TYPES.map((option) => (
            <Chip
              key={option}
              label={option}
              active={type === option}
              onPress={() => setType(option)}
            />
          ))}
        </View>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Review title"
          placeholderTextColor="#7A7466"
          className="mt-4 rounded-xl border border-ivory-dim/20 bg-charcoal px-4 py-4 font-body text-ivory"
        />
        <TextInput
          value={body}
          onChangeText={setBody}
          placeholder="What should council decide?"
          placeholderTextColor="#7A7466"
          multiline
          className="mt-3 min-h-[96px] rounded-xl border border-ivory-dim/20 bg-charcoal px-4 py-4 font-body text-ivory"
        />
        <Pressable
          onPress={submitReviewItem}
          className="mt-4 rounded-xl bg-brass px-5 py-4 active:opacity-80"
        >
          <Text className="text-center font-display text-charcoal text-sm tracking-wider">
            ADD TO REVIEW QUEUE
          </Text>
        </Pressable>
      </View>

      <View className="mt-6 gap-4 lg:flex-row">
        <View className="flex-1 rounded-2xl border border-ivory-dim/15 bg-charcoal-800 p-5">
          <Text className="font-body text-ivory-dim text-xs tracking-widest">
            REVIEW QUEUE
          </Text>
          <View className="mt-4 gap-3">
            {(councilReviewItems.length ? councilReviewItems : seedReviewItems()).map((item) => (
              <ReviewItem
                key={item.id}
                item={item}
                onResolve={(status) => resolveCouncilReviewItem(item.id, status)}
              />
            ))}
          </View>
        </View>

        <View className="flex-1 rounded-2xl border border-ivory-dim/15 bg-charcoal-800 p-5">
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
      </View>
    </ScrollView>
  );
}

function seedReviewItems(): CouncilReviewItem[] {
  return [
    {
      id: 'seed-application',
      type: 'application',
      title: 'No active application loaded',
      body: 'Use the Apply flow to populate this review utility.',
      status: 'open',
      createdAt: new Date().toISOString(),
      resolvedAt: null,
    },
  ];
}

function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-full border px-4 py-2 ${
        active ? 'border-brass bg-brass/20' : 'border-ivory-dim/20'
      }`}
    >
      <Text className={active ? 'font-body text-brass text-xs' : 'font-body text-ivory-dim text-xs'}>
        {label.toUpperCase()}
      </Text>
    </Pressable>
  );
}

function ReviewItem({
  item,
  onResolve,
}: {
  item: CouncilReviewItem;
  onResolve: (status: Exclude<CouncilReviewItem['status'], 'open'>) => void;
}) {
  return (
    <View className="rounded-xl border border-ivory-dim/10 bg-charcoal p-4">
      <Text className="font-body text-brass text-[10px] tracking-widest">
        {item.type.toUpperCase()} / {item.status.toUpperCase()}
      </Text>
      <Text className="mt-2 font-display text-ivory text-lg">{item.title}</Text>
      <Text className="mt-1 font-body text-ivory-dim text-sm leading-5">{item.body}</Text>
      {item.status === 'open' ? (
        <View className="mt-3 flex-row flex-wrap gap-2">
          {(['approved', 'rejected', 'resolved'] as const).map((status) => (
            <Chip key={status} label={status} active={false} onPress={() => onResolve(status)} />
          ))}
        </View>
      ) : null}
    </View>
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
