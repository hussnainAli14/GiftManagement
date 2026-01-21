import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput as RNTextInput,
  TouchableOpacity,
} from 'react-native';
import { TextInputComponentProps } from './types';
import { getTextInputStyles } from './styles';

const TextInput: React.FC<TextInputComponentProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  leftIcon,
  rightIcon,
  onRightIconPress,
  secureTextEntry = false,
  masked = false,
  maskLength = 6,
  error,
  disabled = false,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
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
  autoFocus = false,
  keyboardType,
  autoCapitalize,
  maxLength,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const inputRef = useRef<RNTextInput>(null);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    if (textInputProps.onFocus) {
      textInputProps.onFocus(e);
    }
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (textInputProps.onBlur) {
      textInputProps.onBlur(e);
    }
  };

  const handlePasswordToggle = () => {
    // If parent provides onRightIconPress, let parent handle the state
    // Otherwise, use internal state
    if (onRightIconPress) {
      onRightIconPress();
    } else {
      setIsPasswordVisible(!isPasswordVisible);
    }
  };

  const styles = getTextInputStyles(
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

  const placeholderColor = placeholderTextColor || (styles.placeholder.color as string) || '#000000';

  // Determine if we should show secure text
  // For masked input (verification codes), use secureTextEntry to show dots
  // If parent provides onRightIconPress, use secureTextEntry prop directly (parent manages state)
  // Otherwise, use internal isPasswordVisible state
  const shouldSecureText = onRightIconPress 
    ? secureTextEntry 
    : (secureTextEntry && !isPasswordVisible) || masked;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
        </Text>
      )}
      
      <View style={styles.inputContainer}>
        {leftIcon && (
          <View style={styles.iconContainer}>
            {leftIcon}
          </View>
        )}
        
        <RNTextInput
          ref={inputRef}
          {...textInputProps}
          style={[styles.input, inputStyle]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
          secureTextEntry={shouldSecureText}
          editable={!disabled}
          autoFocus={autoFocus}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          maxLength={masked ? maskLength : maxLength}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        
        {rightIcon && (
          <TouchableOpacity
            onPress={secureTextEntry ? handlePasswordToggle : onRightIconPress}
            disabled={disabled}
            activeOpacity={0.7}
            style={styles.rightIconContainer}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text style={[styles.error, errorStyle]}>
          {error}
        </Text>
      )}
    </View>
  );
};

export default TextInput;
