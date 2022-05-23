import React, {forwardRef} from 'react';
import PropTypes from 'prop-types';
import {View, Text, TextInput, ViewPropTypes} from 'react-native';
import InputStyles from './styles';

const _Input = forwardRef(
  (
    {
      label,
      value,
      placeholder,
      keyboardType,
      status,
      containerStyle,
      inputStyle,
      labelStyle,
      validColor,
      invalidColor,
      placeholderColor,
      onFocus,
      onChange,
      additionalInputProps,
    },
    ref,
  ) => {
    return (
      <View style={[containerStyle]}>
        {!!label && <Text style={[labelStyle]}>{label}</Text>}
        <TextInput
          ref={ref}
          {...additionalInputProps}
          keyboardType={keyboardType}
          autoCapitalise="words"
          autoCorrect={false}
          style={[
            InputStyles.baseInputStyle,
            inputStyle,
            validColor && status === 'valid'
              ? {color: validColor}
              : invalidColor && status === 'invalid'
              ? {color: invalidColor}
              : {},
          ]}
          underlineColorAndroid="transparent"
          placeholderTextColor={placeholderColor}
          placeholder={placeholder}
          value={value}
          onFocus={onFocus}
          onChangeText={onChange}
        />
      </View>
    );
  },
);

_Input.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  keyboardType: PropTypes.string,
  status: PropTypes.oneOf(['valid', 'invalid', 'incomplete']),
  containerStyle: ViewPropTypes.style,
  inputStyle: PropTypes.shape(Text.propTypes),
  labelStyle: PropTypes.shape(Text.propTypes),
  validColor: PropTypes.string,
  invalidColor: PropTypes.string,
  placeholderColor: PropTypes.string,
  onFocus: PropTypes.func,
  onChange: PropTypes.func,
  additionalInputProps: PropTypes.shape(TextInput.propTypes),
};

export default _Input;
