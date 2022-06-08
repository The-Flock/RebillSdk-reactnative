import React, {forwardRef} from 'react';
import {View, Text, TextInput} from 'react-native';
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

export default _Input;
