import React, { useMemo } from 'react';
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
  mode = 'modal',
}) => {
  const styles = useMemo(
    () =>
      getDropdownStyles(disabled, error, false, {
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
      }),
    [
      disabled,
      error,
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
    ],
  );

  const listContainerStyle = useMemo(
    () => ({
      borderRadius: borderRadius ?? 8,
      borderColor: error ? errorBorderColor || colors.primary : colors.gray,
      borderWidth: borderWidth ?? 1,
      elevation: 8,
      zIndex: 9999,
    }),
    [borderRadius, borderWidth, error, errorBorderColor],
  );

  const handleChange = (item: { label: string; value: string | number }) => {
    onChange(item.value);
  };

  const selectedValue = value === null || value === undefined || value === '' ? null : value;

  return (
    <View style={[styles.container, { zIndex: mode === 'default' ? 10 : 0 }, containerStyle]}>
      {label ? (
        <Text style={[styles.label, { color: '#000000', fontWeight: '700' }, labelStyle]}>
          {label}
        </Text>
      ) : null}

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
        value={selectedValue}
        onChange={handleChange}
        disable={disabled}
        search={searchable}
        searchPlaceholder={searchPlaceholder}
        mode={mode}
        activeColor={colors.primary}
        containerStyle={listContainerStyle}
        itemTextStyle={{
          ...styles.selectedText,
          color: textColor || '#000000',
        }}
        renderItem={(item: { label: string; value: string | number }) => {
          const isSelected = item.value === selectedValue;
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
                  color: isSelected ? colors.white : textColor || '#000000',
                }}
              >
                {item.label}
              </Text>
            </View>
          );
        }}
        iconColor={colors.darkPurple}
      />

      {error ? <Text style={[styles.error, errorStyle]}>{error}</Text> : null}
    </View>
  );
};

export default Dropdown;
