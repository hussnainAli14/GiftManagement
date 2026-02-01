import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { colors } from '../../theme';
import { typography } from '../../theme';
import { RadioButtonProps } from './types';
import { styles } from './styles';

function RadioButtonInner<T = string>({
  options,
  value,
  onChange,
  disabled = false,
  containerStyle,
}: RadioButtonProps<T>) {
  return (
    <View style={[styles.container, containerStyle]}>
      {options.map((option) => {
        const isSelected = value === option.value;
        return (
          <TouchableOpacity
            key={String(option.value)}
            style={styles.optionRow}
            onPress={() => !disabled && onChange(option.value)}
            disabled={disabled}
            activeOpacity={0.7}
          >
            <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
              {isSelected && <View style={styles.radioInner} />}
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionLabel}>{option.label}</Text>
              {option.description && (
                <Text style={styles.optionDescription}>{option.description}</Text>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const RadioButton = RadioButtonInner as <T = string>(props: RadioButtonProps<T>) => JSX.Element;

export default RadioButton;
