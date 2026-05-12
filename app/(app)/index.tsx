import { ScrollView, Text, View } from 'react-native';
import { useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { track } from '@/lib/posthog';

/**
 * Primary feed shell. M0 ships this as an empty surface with the
 * Daily Standard slot and a "coming soon" message. M1 wires the
 * actual feed of member check-ins + founder posts.
 */
export default function FeedHome() {
  const { profile } = useAuth();

  useEffect(() => {
    track('feed_viewed');
  }, []);

  return (
    <ScrollView className="flex-1 bg-charcoal" contentContainerClassName="px-6 pt-20 pb-12">
      <Text className="font-body text-ivory-dim text-xs tracking-widest">
        TODAY · THE TABLE
      </Text>
      <Text className="mt-2 font-display text-ivory text-3xl tracking-wide">
        Welcome{profile?.display_name ? `, ${profile.display_name}` : ''}.
      </Text>

      <View className="mt-10 rounded-2xl border border-brass/30 bg-brass/5 p-5">
        <Text className="font-body text-brass text-xs tracking-widest">
          DAILY STANDARD
        </Text>
        <Text className="mt-3 font-display text-ivory text-xl leading-7">
          The first standard is showing up. You're here. Now pick one pillar
          and move it today.
        </Text>
        <Text className="mt-3 font-body text-ivory-dim text-xs">
          — John Maciel
        </Text>
      </View>

      <View className="mt-10">
        <Text className="font-body text-ivory-dim text-xs tracking-widest">
          THE FEED
        </Text>
        <View className="mt-3 rounded-2xl border border-ivory-dim/15 bg-charcoal-50 p-6">
          <Text className="font-body text-ivory-dim text-sm leading-6">
            The first cohort is being seated. Member posts, challenges, and
            live sessions arrive with the next release.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
