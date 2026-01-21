import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { MultiStepInputProps } from './types';
import { getMultiStepInputStyles } from './styles';

const MultiStepInput: React.FC<MultiStepInputProps> = ({
  steps = 6,
  value,
  onChangeText,
  label,
  error,
  disabled = false,
  autoFocus = false,
  keyboardType = 'number-pad',
  masked = false,
  borderColor,
  focusedBorderColor,
  errorBorderColor,
  backgroundColor,
  textColor,
  borderRadius,
  borderWidth,
  boxSize = 48,
  spacing = 8,
  containerStyle,
  labelStyle,
  errorStyle,
  inputStyle,
  onComplete,
  onFocus,
  onBlur,
}) => {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(autoFocus ? 0 : null);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Initialize refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, steps);
  }, [steps]);

  // Auto focus first input if autoFocus is true
  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [autoFocus]);

  // Check if all steps are filled and call onComplete
  useEffect(() => {
    if (value.length === steps && onComplete) {
      onComplete(value);
    }
  }, [value, steps, onComplete]);

  const handleChangeText = (text: string, index: number) => {
    // Only allow single character
    if (text.length > 1) {
      return;
    }

    // Update value
    const newValue = value.split('');
    newValue[index] = text;
    const updatedValue = newValue.join('').substring(0, steps);
    onChangeText(updatedValue);

    // Move to next input if character entered
    if (text && index < steps - 1) {
      inputRefs.current[index + 1]?.focus();
      setFocusedIndex(index + 1);
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    // Handle backspace
    if (key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setFocusedIndex(index - 1);
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
    if (onFocus) {
      onFocus(index);
    }
  };

  const handleBlur = (index: number) => {
    setFocusedIndex(null);
    if (onBlur) {
      onBlur(index);
    }
  };

  const handleBoxPress = (index: number) => {
    if (!disabled) {
      inputRefs.current[index]?.focus();
      setFocusedIndex(index);
    }
  };

  const styles = getMultiStepInputStyles(
    disabled,
    error,
    focusedIndex ?? undefined,
    {
      borderColor,
      focusedBorderColor,
      errorBorderColor,
      backgroundColor,
      textColor,
      borderRadius,
      borderWidth,
      boxSize,
      spacing,
    }
  );

  // Get display value for each box
  const getDisplayValue = (index: number) => {
    if (index >= value.length) {
      return '';
    }
    return masked ? '•' : value[index];
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
        </Text>
      )}
      
      <View style={styles.inputContainer}>
        {Array.from({ length: steps }).map((_, index) => {
          const displayValue = getDisplayValue(index);
          
          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleBoxPress(index)}
              disabled={disabled}
              activeOpacity={0.7}
              style={styles.getInputBox(index)}
            >
              <TextInput
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                style={[styles.inputText, inputStyle, { width: boxSize, height: boxSize }]}
                value={displayValue}
                onChangeText={(text) => handleChangeText(text, index)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                onFocus={() => handleFocus(index)}
                onBlur={() => handleBlur(index)}
                keyboardType={keyboardType}
                maxLength={1}
                editable={!disabled}
                secureTextEntry={masked && displayValue !== ''}
                selectTextOnFocus
                caretHidden={false}
              />
            </TouchableOpacity>
          );
        })}
      </View>
      
      {error && (
        <Text style={[styles.error, errorStyle]}>
          {error}
        </Text>
      )}
    </View>
  );
};

export default MultiStepInput;
