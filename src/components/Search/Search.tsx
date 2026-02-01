import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TextInput } from '../TextInput';
import { colors } from '../../theme';
import { SearchProps } from './types';
import { styles } from './styles';

const Search: React.FC<SearchProps> = ({
  placeholder = 'Search...',
  value,
  onChangeText,
  containerStyle,
  ...textInputProps
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
        fullWidth={true}
        containerStyle={styles.inputContainer}
        {...textInputProps}
      />
    </View>
  );
};

export default Search;
