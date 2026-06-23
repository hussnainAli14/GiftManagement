import React, { useMemo, useState } from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getDropdownStyles } from '../DropDown/styles';
import { colors } from '../../theme';

export type CityPickerOption = {
  label: string;
  value: string;
};

type CityPickerProps = {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  options?: readonly CityPickerOption[];
  data?: readonly CityPickerOption[];
  error?: string;
  containerStyle?: ViewStyle;
};

const EMPTY_OPTIONS: CityPickerOption[] = [];
const LIST_MAX_HEIGHT = Math.round(Dimensions.get('window').height * 0.55);

const CityPicker: React.FC<CityPickerProps> = ({
  label,
  placeholder = 'Select your city',
  value,
  onChange,
  onBlur,
  options,
  data,
  error,
  containerStyle,
}) => {
  const [open, setOpen] = useState(false);
  const fieldStyles = useMemo(() => getDropdownStyles(false, error, false, {}), [error]);

  const list = useMemo(
    () => (Array.isArray(options) ? options : Array.isArray(data) ? data : EMPTY_OPTIONS),
    [options, data],
  );

  const selectedLabel = useMemo(
    () => list.find((option) => option.value === value)?.label,
    [list, value],
  );

  const closeModal = () => {
    setOpen(false);
    onBlur?.();
  };

  const handleSelect = (cityValue: string) => {
    onChange(cityValue);
    setOpen(false);
    onBlur?.();
  };

  return (
    <View style={[fieldStyles.container, containerStyle]}>
      {label ? <Text style={fieldStyles.label}>{label}</Text> : null}

      <TouchableOpacity
        style={[
          fieldStyles.dropdownContainer,
          styles.trigger,
          error ? styles.triggerError : null,
        ]}
        onPress={() => setOpen(true)}
        activeOpacity={0.85}
      >
        <Text
          style={selectedLabel ? fieldStyles.selectedText : fieldStyles.placeholder}
          numberOfLines={1}
        >
          {selectedLabel ?? placeholder}
        </Text>
        <Icon name="keyboard-arrow-down" size={22} color={colors.darkPurple} />
      </TouchableOpacity>

      {error ? <Text style={fieldStyles.error}>{error}</Text> : null}

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
        statusBarTranslucent
      >
        <View style={styles.modalRoot}>
          <Pressable style={styles.backdrop} onPress={closeModal} />
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Select your city</Text>
            <ScrollView
              style={styles.list}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator
              keyboardShouldPersistTaps="handled"
              bounces={false}
            >
              {list.length === 0 ? (
                <Text style={styles.emptyText}>No cities available</Text>
              ) : (
                list.map((item) => {
                  const selected = item.value === value;
                  return (
                    <TouchableOpacity
                      key={item.value}
                      style={[styles.optionRow, selected ? styles.optionRowSelected : null]}
                      onPress={() => handleSelect(item.value)}
                      activeOpacity={0.85}
                    >
                      <Text style={[styles.optionText, selected ? styles.optionTextSelected : null]}>
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  triggerError: {
    borderColor: colors.primary,
  },
  modalRoot: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingTop: 16,
    paddingBottom: 8,
    elevation: 12,
    zIndex: 2,
    overflow: 'hidden',
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.black,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  list: {
    maxHeight: LIST_MAX_HEIGHT,
  },
  listContent: {
    paddingBottom: 8,
  },
  emptyText: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    fontSize: 15,
    color: colors.black,
    textAlign: 'center',
  },
  optionRow: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  optionRowSelected: {
    backgroundColor: colors.primary,
  },
  optionText: {
    fontSize: 16,
    color: colors.black,
  },
  optionTextSelected: {
    color: colors.white,
    fontWeight: '600',
  },
});

export default CityPicker;
