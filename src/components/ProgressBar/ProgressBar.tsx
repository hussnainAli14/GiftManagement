import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../theme';
import { ProgressBarProps } from './types';
import { styles } from './styles';

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  height = 6,
  borderRadius = 3,
  trackColor = colors.borderGray,
  fillColor = colors.primary,
  style,
  onDecrement,
  onIncrement,
  decrementDisabled = false,
  incrementDisabled = false,
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const showButtons = onDecrement != null || onIncrement != null;

  const renderBar = () => (
    <View
      style={[
        styles.track,
        { height, borderRadius, backgroundColor: trackColor },
      ]}
    >
      <View
        style={[
          styles.fill,
          {
            width: `${clampedProgress}%`,
            borderRadius,
            backgroundColor: fillColor,
          },
        ]}
      >
      </View>
    </View>
  );

  return (
    <View style={[styles.container, style]}>
      {showButtons ? (
        <View style={styles.row}>
          {onDecrement != null ? (
            <TouchableOpacity
              style={[styles.actionButton, decrementDisabled && styles.actionButtonDisabled]}
              onPress={onDecrement}
              disabled={decrementDisabled}
              activeOpacity={0.7}
            >
              <Icon name="remove" size={22} color={colors.black} />
            </TouchableOpacity>
          ) : null}
          <View style={styles.barWrapper}>{renderBar()}</View>
          {onIncrement != null ? (
            <TouchableOpacity
              style={[styles.actionButton, incrementDisabled && styles.actionButtonDisabled]}
              onPress={onIncrement}
              disabled={incrementDisabled}
              activeOpacity={0.7}
            >
              <Icon name="add" size={22} color={colors.black} />
            </TouchableOpacity>
          ) : null}
        </View>
      ) : (
        renderBar()
      )}
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </View>
  );
};

export default ProgressBar;
