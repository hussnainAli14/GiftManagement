import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Dropdown as RNDropdown } from 'react-native-element-dropdown';
import { DropdownProps } from './types';
import { getDropdownStyles } from './styles';
import { colors } from '../../theme';

const Dropdown: React.FC<DropdownProps> = ({
  label,
  placeholder = 'Select an option',
  value,
  onChange,
  data,
  error,
  disabled = false,
  searchable = false,
  searchPlaceholder = 'Search...',
  containerStyle,
  dropdownStyle,
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
  maxHeight = 300,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const styles = getDropdownStyles(
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

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleChange = (item: { label: string; value: string | number }) => {
    onChange(item.value);
    setIsFocused(false);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[
          styles.label,
          { color: '#000000', fontWeight: '700' },
          labelStyle,
        ]}>
          {label}
        </Text>
      )}
      
      <RNDropdown
        style={[styles.dropdownContainer, dropdownStyle]}
        placeholderStyle={[styles.placeholder, placeholderStyle]}
        selectedTextStyle={[
          styles.selectedText,
          { color: textColor || '#000000' },
          selectedTextStyle,
        ]}
        data={data}
        maxHeight={maxHeight}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disable={disabled}
        search={searchable}
        searchPlaceholder={searchPlaceholder}
        activeColor={colors.primary}
        containerStyle={{
          borderRadius: borderRadius ?? 8,
          borderColor: error ? (errorBorderColor || colors.primary) : colors.gray,
          borderWidth: borderWidth ?? 1,
        }}
        itemTextStyle={{
          ...styles.selectedText,
          color: textColor || '#000000',
        }}
        renderItem={(item: any) => {
          const isSelected = item.value === value;
          return (
            <View
              style={{
                padding: 12,
                backgroundColor: isSelected ? colors.primary : 'transparent',
              }}
            >
              <Text
                style={{
                  ...styles.selectedText,
                  color: isSelected ? colors.white : (textColor || '#000000'),
                }}
              >
                {item.label}
              </Text>
            </View>
          );
        }}
        iconColor={colors.darkPurple}
      />
      
      {error && (
        <Text style={[styles.error, errorStyle]}>
          {error}
        </Text>
      )}
    </View>
  );
};

export default Dropdown;
