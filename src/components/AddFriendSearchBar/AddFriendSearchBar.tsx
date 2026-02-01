import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TextInput } from '../TextInput';
import { Button } from '../Button';
import { colors } from '../../theme';
import { AddFriendSearchBarProps, SearchCriteria } from './types';
import { styles } from './styles';

const CRITERIA_OPTIONS: { value: SearchCriteria; label: string }[] = [
  { value: 'username', label: 'Username' },
  { value: 'phone', label: 'Phone' },
  { value: 'email', label: 'Email' },
];

const AddFriendSearchBar: React.FC<AddFriendSearchBarProps> = ({
  value,
  onChangeText,
  selectedCriteria,
  onCriteriaChange,
  onSearch,
  placeholder = 'Search by username...',
  containerStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        leftIcon={<Icon name="search" size={20} color={colors.darkGray} />}
        backgroundColor={colors.white}
        borderColor={colors.borderGray}
        borderRadius={8}
        paddingVertical={12}
        paddingHorizontal={16}
        fullWidth
        containerStyle={styles.inputContainer}
      />
      <View style={styles.criteriaRow}>
        {CRITERIA_OPTIONS.map((option) => {
          const isSelected = selectedCriteria === option.value;
          return (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.criteriaButton,
                isSelected ? styles.criteriaButtonSelected : styles.criteriaButtonUnselected,
              ]}
              onPress={() => onCriteriaChange(option.value)}
            >
              <Text
                style={
                  isSelected ? styles.criteriaTextSelected : styles.criteriaTextUnselected
                }
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <Button
        variant="primary"
        fullWidth
        onPress={onSearch}
        style={styles.searchButton}
      >
        Search
      </Button>
    </View>
  );
};

export default AddFriendSearchBar;
