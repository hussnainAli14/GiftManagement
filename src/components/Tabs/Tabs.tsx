import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { styles } from './styles';

export type TabOption<T extends string> = {
  value: T;
  label: string;
};

type TabsProps<T extends string> = {
  value: T;
  options: TabOption<T>[];
  onChange: (value: T) => void;
  style?: ViewStyle;
};

export function Tabs<T extends string>({ value, options, onChange, style }: TabsProps<T>) {
  return (
    <View style={[styles.row, style]}>
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <TouchableOpacity
            key={opt.value}
            style={[styles.tab, selected && styles.tabSelected]}
            onPress={() => onChange(opt.value)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, selected && styles.tabTextSelected]}>{opt.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

