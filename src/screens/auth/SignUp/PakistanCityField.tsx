import React from 'react';
import { ViewStyle } from 'react-native';
import CityPicker from '../../../components/CityPicker/CityPicker';
import { PAKISTAN_CITY_DROPDOWN_OPTIONS } from '../../../data/pakistanCities';
import { styles } from './styles';

type PakistanCityFieldProps = {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  containerStyle?: ViewStyle;
};

const PakistanCityField: React.FC<PakistanCityFieldProps> = ({
  value,
  onChange,
  onBlur,
  error,
  containerStyle,
}) => (
  <CityPicker
    label="City"
    placeholder="Select your city"
    value={value}
    onChange={onChange}
    onBlur={onBlur}
    options={PAKISTAN_CITY_DROPDOWN_OPTIONS}
    error={error}
    containerStyle={containerStyle ?? styles.inputContainer}
  />
);

export default PakistanCityField;
