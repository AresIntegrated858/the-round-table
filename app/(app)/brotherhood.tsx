import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useRoundTableStore } from '@/lib/roundTableStore';
import { LOCAL_TABLES } from '@/lib/roundTableModel';
import type { BrotherhoodRequest, WarRoomPostType } from '@/lib/roundTableEngine';

const POST_TYPES: WarRoomPostType[] = ['win', 'lesson', 'ask', 'accountability'];
const REQUEST_TYPES: BrotherhoodRequest['category'][] = [
  'accountability',
  'local',
  'business',
  'style',
  'fitness',
  'relationship',
];

export default function BrotherhoodRoom() {
  const {
    warRoomPosts,
    brotherhoodRequests,
    localConnectionIntents,
    localTable,
    brotherCard,
    addWarRoomPost,
    addBrotherhoodRequest,
    addLocalConnectionIntent,
  } = useRoundTableStore();
  const [postType, setPostType] = useState<WarRoomPostType>('win');
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');
  const [requestType, setRequestType] = useState<BrotherhoodRequest['category']>('accountability');
  const [requestTitle, setRequestTitle] = useState('');
  const [requestBody, setRequestBody] = useState('');
  const [region, setRegion] = useState(localTable ?? LOCAL_TABLES[0].region);
  const [intent, setIntent] = useState('');
  const [availability, setAvailability] = useState('');
  const card = brotherCard();

  function submitPost() {
    addWarRoomPost({ type: postType, title: postTitle, body: postBody });
    setPostTitle('');
    setPostBody('');
  }

  function submitRequest() {
    addBrotherhoodRequest({ category: requestType, title: requestTitle, body: requestBody });
    setRequestTitle('');
    setRequestBody('');
  }

  function submitLocalIntent() {
    addLocalConnectionIntent({ region, intent, availability });
    setIntent('');
    setAvailability('');
  }

  return (
    <ScrollView
      className="flex-1 bg-charcoal"
      contentContainerClassName="mx-auto w-full max-w-6xl px-6 pt-12 pb-12"
    >
      <Text className="font-body text-brass text-xs tracking-widest">
        BROTHERHOOD ROOM
      </Text>
      <Text className="mt-2 font-display text-ivory text-4xl tracking-wide">
        The room is the product.
      </Text>
      <Text className="mt-3 font-body text-ivory-dim text-sm leading-6">
        This is where members post proof, ask for support, build local ties, and
        become known by their conduct.
      </Text>

      <View className="mt-8 rounded-2xl border border-brass/30 bg-brass/10 p-5">
        <Text className="font-body text-brass text-xs tracking-widest">
          YOUR BROTHER CARD
        </Text>
        <Text className="mt-2 font-display text-ivory text-3xl">
          {card.displayName}
        </Text>
        <Text className="mt-2 font-body text-ivory-dim text-sm leading-6">
          {card.seatStatus.toUpperCase()} / {card.location} / Command {card.commandScore}/100
        </Text>
        <Text className="mt-3 font-body text-brass text-sm">
          {card.proofCount} proof posts / {card.contributionCount} contributions
        </Text>
      </View>

      <View className="mt-8 gap-6 lg:flex-row">
        <View className="flex-1 rounded-2xl border border-ivory-dim/15 bg-charcoal-800 p-5">
          <Text className="font-body text-ivory-dim text-xs tracking-widest">
            WAR ROOM POST
          </Text>
          <View className="mt-4 flex-row flex-wrap gap-2">
            {POST_TYPES.map((type) => (
              <Pressable
                key={type}
                onPress={() => setPostType(type)}
                className={`rounded-full border px-3 py-2 ${
                  postType === type ? 'border-brass bg-brass/20' : 'border-ivory-dim/20'
                }`}
              >
                <Text className={postType === type ? 'font-body text-brass text-xs' : 'font-body text-ivory-dim text-xs'}>
                  {type.toUpperCase()}
                </Text>
              </Pressable>
            ))}
          </View>
          <Input value={postTitle} onChangeText={setPostTitle} placeholder="Title" />
          <Input value={postBody} onChangeText={setPostBody} placeholder="What happened? What is the standard?" multiline />
          <Action label="POST TO WAR ROOM" onPress={submitPost} />
        </View>

        <View className="flex-1 rounded-2xl border border-ivory-dim/15 bg-charcoal-800 p-5">
          <Text className="font-body text-ivory-dim text-xs tracking-widest">
            BROTHERHOOD REQUEST
          </Text>
          <View className="mt-4 flex-row flex-wrap gap-2">
            {REQUEST_TYPES.map((type) => (
              <Pressable
                key={type}
                onPress={() => setRequestType(type)}
                className={`rounded-full border px-3 py-2 ${
                  requestType === type ? 'border-brass bg-brass/20' : 'border-ivory-dim/20'
                }`}
              >
                <Text className={requestType === type ? 'font-body text-brass text-xs' : 'font-body text-ivory-dim text-xs'}>
                  {type.toUpperCase()}
                </Text>
              </Pressable>
            ))}
          </View>
          <Input value={requestTitle} onChangeText={setRequestTitle} placeholder="What do you need?" />
          <Input value={requestBody} onChangeText={setRequestBody} placeholder="Be direct. What would help?" multiline />
          <Action label="REQUEST SUPPORT" onPress={submitRequest} />
        </View>
      </View>

      <View className="mt-8 rounded-2xl border border-ivory-dim/15 bg-charcoal-800 p-5">
        <Text className="font-body text-ivory-dim text-xs tracking-widest">
          LOCAL TABLE MATCHMAKING
        </Text>
        <View className="mt-4 flex-row flex-wrap gap-2">
          {LOCAL_TABLES.map((table) => (
            <Pressable
              key={table.region}
              onPress={() => setRegion(table.region)}
              className={`rounded-full border px-3 py-2 ${
                region === table.region ? 'border-brass bg-brass/20' : 'border-ivory-dim/20'
              }`}
            >
              <Text className={region === table.region ? 'font-body text-brass text-xs' : 'font-body text-ivory-dim text-xs'}>
                {table.region}
              </Text>
            </Pressable>
          ))}
        </View>
        <Input value={intent} onChangeText={setIntent} placeholder="Training, coffee, business talk, local meet?" />
        <Input value={availability} onChangeText={setAvailability} placeholder="Availability" />
        <Action label="RAISE LOCAL SIGNAL" onPress={submitLocalIntent} />
      </View>

      <View className="mt-8 gap-4 lg:flex-row">
        <Feed title="WAR ROOM" empty="No War Room posts yet.">
          {warRoomPosts.map((post) => (
            <Post key={post.id} eyebrow={post.type} title={post.title} body={post.body} />
          ))}
        </Feed>
        <Feed title="REQUESTS" empty="No brotherhood requests yet.">
          {brotherhoodRequests.map((request) => (
            <Post key={request.id} eyebrow={request.status} title={request.title} body={request.body} />
          ))}
        </Feed>
        <Feed title="LOCAL SIGNALS" empty="No local signals yet.">
          {localConnectionIntents.map((item) => (
            <Post key={item.id} eyebrow={item.region} title={item.intent} body={item.availability} />
          ))}
        </Feed>
      </View>
    </ScrollView>
  );
}

function Input({
  value,
  onChangeText,
  placeholder,
  multiline,
}: {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  multiline?: boolean;
}) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#7A7466"
      multiline={multiline}
      className={`mt-4 rounded-xl border border-ivory-dim/20 bg-charcoal px-4 py-4 font-body text-ivory ${
        multiline ? 'min-h-[96px]' : ''
      }`}
    />
  );
}

function Action({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} className="mt-4 rounded-xl bg-brass px-5 py-4 active:opacity-80">
      <Text className="text-center font-display text-charcoal text-sm tracking-wider">
        {label}
      </Text>
    </Pressable>
  );
}

function Feed({ title, empty, children }: { title: string; empty: string; children: React.ReactNode[] }) {
  return (
    <View className="flex-1 rounded-2xl border border-ivory-dim/15 bg-charcoal-800 p-5">
      <Text className="font-body text-ivory-dim text-xs tracking-widest">{title}</Text>
      <View className="mt-4 gap-3">
        {children.length ? children : <Text className="font-body text-ivory-dim text-sm">{empty}</Text>}
      </View>
    </View>
  );
}

function Post({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <View className="rounded-xl border border-ivory-dim/10 bg-charcoal p-4">
      <Text className="font-body text-brass text-[10px] tracking-widest">
        {eyebrow.toUpperCase()}
      </Text>
      <Text className="mt-2 font-display text-ivory text-lg">{title}</Text>
      <Text className="mt-1 font-body text-ivory-dim text-sm leading-5">{body}</Text>
    </View>
  );
}
