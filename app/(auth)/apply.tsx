import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/lib/auth';
import { track } from '@/lib/posthog';
import { useRoundTableStore } from '@/lib/roundTableStore';

const QUESTIONS = [
  'Where are you strongest right now?',
  'Where are you weakest right now?',
  'What are you tired of tolerating in yourself?',
  'Why do you want to sit at The Round Table?',
];

export default function Apply() {
  const router = useRouter();
  const startDemo = useAuth((s) => s.startDemo);
  const saveApplication = useRoundTableStore((s) => s.saveApplication);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [fullName, setFullName] = useState('');
  const [cityState, setCityState] = useState('');
  const [age, setAge] = useState('');

  function update(question: string, value: string) {
    setAnswers((prev) => ({ ...prev, [question]: value }));
  }

  function approveDemo() {
    saveApplication({
      fullName,
      cityState,
      age,
      strongest: answers['Where are you strongest right now?'] ?? '',
      weakest: answers['Where are you weakest right now?'] ?? '',
      tolerating: answers['What are you tired of tolerating in yourself?'] ?? '',
      why: answers['Why do you want to sit at The Round Table?'] ?? '',
      status: 'approved',
    });
    track('signup_started', {
      method: 'application_demo',
      answered: Object.values(answers).filter(Boolean).length,
    });
    startDemo();
    router.replace('/(onboarding)/brief');
  }

  return (
    <ScrollView
      className="flex-1 bg-charcoal"
      contentContainerClassName="mx-auto w-full max-w-3xl px-6 py-10 md:py-16"
    >
      <Pressable onPress={() => router.back()} className="mb-8">
        <Text className="font-body text-ivory-dim text-sm">Back</Text>
      </Pressable>

      <Text className="font-body text-brass text-xs tracking-widest">
        APPLICATION ONLY
      </Text>
      <Text className="mt-3 font-display text-ivory text-4xl tracking-wide">
        Apply for a founding seat.
      </Text>
      <Text className="mt-4 font-body text-ivory-dim text-base leading-7">
        The Round Table is low-ticket on purpose, but not low-standard. First
        members are manually reviewed. The founding seat is $25/month with a
        90-day minimum commitment after approval.
      </Text>

      <View className="mt-8 rounded-2xl border border-brass/30 bg-brass/10 p-5">
        <Text className="font-display text-ivory text-xl">Fit standard</Text>
        <Text className="mt-2 font-body text-ivory-dim text-sm leading-6">
          You do not need to arrive impressive. You do need humility, hunger,
          and proof you will take action. Victim mindset and no work ethic do
          not get seated.
        </Text>
      </View>

      <View className="mt-8 gap-4">
        <TextInput
          value={fullName}
          onChangeText={setFullName}
          placeholder="Full name"
          placeholderTextColor="#7A7466"
          className="rounded-xl border border-ivory-dim/20 bg-charcoal-800 px-4 py-4 font-body text-ivory"
        />
        <TextInput
          value={cityState}
          onChangeText={setCityState}
          placeholder="City and state"
          placeholderTextColor="#7A7466"
          className="rounded-xl border border-ivory-dim/20 bg-charcoal-800 px-4 py-4 font-body text-ivory"
        />
        <TextInput
          value={age}
          onChangeText={setAge}
          placeholder="Age"
          placeholderTextColor="#7A7466"
          keyboardType="number-pad"
          className="rounded-xl border border-ivory-dim/20 bg-charcoal-800 px-4 py-4 font-body text-ivory"
        />

        {QUESTIONS.map((question) => (
          <View key={question}>
            <Text className="mb-2 font-body text-ivory-dim text-xs tracking-widest">
              {question.toUpperCase()}
            </Text>
            <TextInput
              value={answers[question] ?? ''}
              onChangeText={(value) => update(question, value)}
              placeholder="Answer directly."
              placeholderTextColor="#7A7466"
              multiline
              className="min-h-[92px] rounded-xl border border-ivory-dim/20 bg-charcoal-800 px-4 py-4 font-body text-ivory"
            />
          </View>
        ))}
      </View>

      <View className="mt-8 gap-3">
        <Pressable
          onPress={approveDemo}
          className="rounded-xl bg-brass px-6 py-4 active:opacity-80"
        >
          <Text className="text-center font-display text-charcoal text-base tracking-wider">
            DEMO APPROVAL - ENTER ONBOARDING
          </Text>
        </Pressable>
        <Pressable
          onPress={() => router.push('/(auth)/sign-in')}
          className="rounded-xl border border-ivory-dim/25 px-6 py-4 active:opacity-70"
        >
          <Text className="text-center font-body text-ivory text-base">
            Already approved? Sign in
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
