import { useState, type ReactNode } from 'react';
import { ScrollView, View, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';

type Props = {
  children: ReactNode;
  /** Called once when the user has scrolled within `threshold` px of the bottom. */
  onReachEnd: () => void;
  /** How close to the bottom (in px) counts as "reached". */
  threshold?: number;
};

/**
 * Wraps content in a ScrollView and fires `onReachEnd` exactly once when
 * the user reaches the bottom. Used by the honor-code screen to gate the
 * "I agree" CTA on actual scroll-through, per product-brief.md §11 Step 2.
 */
export function ScrollGate({ children, onReachEnd, threshold = 32 }: Props) {
  const [fired, setFired] = useState(false);

  function onScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    if (fired) return;
    const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
    const distanceFromBottom =
      contentSize.height - (layoutMeasurement.height + contentOffset.y);
    if (distanceFromBottom <= threshold) {
      setFired(true);
      onReachEnd();
    }
  }

  return (
    <ScrollView
      onScroll={onScroll}
      scrollEventThrottle={64}
      contentContainerClassName="px-6 pt-24 pb-12"
    >
      <View>{children}</View>
    </ScrollView>
  );
}
