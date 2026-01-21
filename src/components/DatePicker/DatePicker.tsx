import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DatePickerProps } from './types';
import { getDatePickerStyles } from './styles';

const DatePicker: React.FC<DatePickerProps> = ({
  label,
  placeholder = 'Pick a date',
  value,
  onChange,
  minimumDate,
  maximumDate,
  mode = 'date',
  displayFormat = 'MM/DD/YYYY',
  error,
  disabled = false,
  leftIcon,
  containerStyle,
  inputContainerStyle,
  labelStyle,
  errorStyle,
  selectedTextStyle,
  placeholderStyle,
  borderColor,
  focusedBorderColor,
  errorBorderColor,
  backgroundColor,
  textColor,
  placeholderTextColor,
  borderRadius,
  borderWidth,
  paddingVertical,
  paddingHorizontal,
  fullWidth = true,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const styles = getDatePickerStyles(
    disabled,
    error,
    isFocused,
    {
      borderColor,
      focusedBorderColor,
      errorBorderColor,
      backgroundColor,
      textColor,
      placeholderTextColor,
      borderRadius,
      borderWidth,
      paddingVertical,
      paddingHorizontal,
      fullWidth,
    }
  );

  const formatDate = (date: Date): string => {
    if (displayFormat === 'MM/DD/YYYY') {
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    }
    // Add more format options if needed
    return date.toLocaleDateString();
  };

  const handlePress = () => {
    if (!disabled) {
      setShowPicker(true);
      setIsFocused(true);
    }
  };

  const handleChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
      setIsFocused(false);
    }

    if (event.type === 'set' && selectedDate) {
      onChange(selectedDate);
      if (Platform.OS === 'ios') {
        setShowPicker(false);
        setIsFocused(false);
      }
    } else if (event.type === 'dismissed') {
      setShowPicker(false);
      setIsFocused(false);
    }
  };

  const displayValue = value ? formatDate(value) : '';

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
        </Text>
      )}
      
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.7}
        style={[styles.inputContainer, inputContainerStyle]}
      >
        {leftIcon && (
          <View style={styles.iconContainer}>
            {leftIcon}
          </View>
        )}
        
        {displayValue ? (
          <Text style={[styles.selectedText, selectedTextStyle]}>
            {displayValue}
          </Text>
        ) : (
          <Text style={[styles.placeholder, placeholderStyle]}>
            {placeholder}
          </Text>
        )}
      </TouchableOpacity>
      
      {error && (
        <Text style={[styles.error, errorStyle]}>
          {error}
        </Text>
      )}
      
      {showPicker && (
        <DateTimePicker
          value={value || new Date()}
          mode={mode}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      )}
    </View>
  );
};

export default DatePicker;
