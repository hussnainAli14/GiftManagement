import { ViewStyle } from 'react-native';

export interface ProgressBarProps {
  /** Progress value 0–100 */
  progress: number;
  /** Label below the bar (e.g. "60% contributed") */
  label?: string;
  /** Bar height */
  height?: number;
  /** Border radius of bar and fill */
  borderRadius?: number;
  /** Background color of the track */
  trackColor?: string;
  /** Color of the filled segment */
  fillColor?: string;
  style?: ViewStyle;
  /** Optional: show minus button left of bar; called when user taps minus */
  onDecrement?: () => void;
  /** Optional: show plus button right of bar; called when user taps plus */
  onIncrement?: () => void;
  /** Disable minus button (e.g. at minimum) */
  decrementDisabled?: boolean;
  /** Disable plus button (e.g. at maximum) */
  incrementDisabled?: boolean;
}
