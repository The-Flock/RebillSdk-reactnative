import React, {useEffect, useState, useRef, useCallback} from 'react';
import PropTypes from 'prop-types';
import {View, Text, Image, TextInput, TouchableOpacity} from 'react-native';
import Icons from '../../Icons';
import Input from '../Input';
import CreditCardInputStyles from './styles';
import useFieldFormatter from '../hooks/useFieldFormatter';
import useFieldValidator from '../hooks/useFieldValidator';

const CreditCardInput = ({
  autoFocus,
  inputStyle,
  validColor,
  invalidColor,
  placeholderColor,
  validButtonColor,
  invalidButtonColor,
  additionalInputProps,
  additionalButtonInputProps,
  additionalTextButtonInputProps,
  iconStyle,
  icon,
  placeholders,
  defaultValues,
}) => {
  const numberRef = useRef();
  const expiryRef = useRef();
  const cvcRef = useRef();
  const {formatValues} = useFieldFormatter();
  const {validateValues} = useFieldValidator();
  const [currentFocus, setCurrentFocus] = useState('');
  const [values, setValues] = useState();
  const [status, setStatus] = useState({
    valid: undefined,
    fields: {
      numeric: 'invalid',
      expiry: 'invalid',
      cvc: 'invalid',
    },
  });

  useEffect(() => {
    if (defaultValues) {
      setValues(defaultValues);
    }
  }, [defaultValues]);

  useEffect(() => {
    if (autoFocus) {
      numberRef.current.focus();
    }
  }, [autoFocus]);

  const onBecomeValid = useCallback(
    _validateValues => {
      if (autoFocus) {
        const isValid = _validateValues.fields[currentFocus];
        if (isValid === 'valid') {
          switch (currentFocus) {
            case 'number':
              expiryRef.current.focus();
              break;
            case 'expiry':
              cvcRef.current.focus();
              break;
          }
        }
      }
    },
    [currentFocus, autoFocus],
  );

  const handleOnChange = useCallback(
    (text, field) => {
      const _formatValues = formatValues({...values, ...{[field]: text}});
      const _validateValues = validateValues(_formatValues);
      setValues(_formatValues);
      setStatus(_validateValues);
      onBecomeValid(_validateValues);
    },
    [formatValues, validateValues, onBecomeValid, values],
  );

  const handleOnFocus = useCallback((e, field) => {
    setCurrentFocus(field);
  }, []);

  const _iconToShow = () => {
    if (currentFocus === 'cvc' && values?.card.type === 'american-express') {
      return 'cvc_amex';
    }
    if (currentFocus === 'cvc') {
      return 'cvc';
    }
    if (values?.card.type) {
      return values?.card.type;
    }
    return 'placeholder';
  };

  const getProps = useCallback(
    field => {
      return {
        inputStyle: [CreditCardInputStyles.input, inputStyle],
        validColor,
        invalidColor,
        placeholderColor,
        field,
        placeholder: placeholders[field],
        value: values?.[field],
        status: status.fields[field],
        valid: status.valid,
        additionalInputProps: additionalInputProps?.[field],
      };
    },
    [
      additionalInputProps,
      inputStyle,
      invalidColor,
      placeholderColor,
      placeholders,
      status,
      validColor,
      values,
    ],
  );
  return (
    <View>
      <View
        style={[
          CreditCardInputStyles.container,
          validColor && status.valid === true
            ? {borderColor: validColor}
            : invalidColor && status.valid === false
            ? {borderColor: invalidColor}
            : {},
        ]}>
        <Image
          style={CreditCardInputStyles.icon}
          source={Icons[_iconToShow()]}
          resizeMode="contain"
        />
        <View style={CreditCardInputStyles.containerInputs}>
          <Input
            {...getProps('number')}
            ref={numberRef}
            onChange={text => handleOnChange(text, 'number')}
            onFocus={e => handleOnFocus(e, 'number')}
            keyboardType="numeric"
            containerStyle={CreditCardInputStyles.numberInput}
          />
          <Input
            {...getProps('expiry')}
            ref={expiryRef}
            onChange={text => handleOnChange(text, 'expiry')}
            onFocus={e => handleOnFocus(e, 'expiry')}
            keyboardType="numeric"
            containerStyle={CreditCardInputStyles.expiryInput}
          />
          <Input
            {...getProps('cvc')}
            ref={cvcRef}
            onChange={text => handleOnChange(text, 'cvc')}
            onFocus={e => handleOnFocus(e, 'cvc')}
            keyboardType="numeric"
            containerStyle={CreditCardInputStyles.cvcInput}
          />
        </View>
      </View>
      <TouchableOpacity
        style={[
          CreditCardInputStyles.buttonPay,
          {
            backgroundColor: status.valid
              ? validButtonColor
              : invalidButtonColor,
          },
        ]}
        disabled={!status.valid}
        {...additionalButtonInputProps}>
        <Text
          style={CreditCardInputStyles.buttonText}
          {...additionalTextButtonInputProps}>
          Pay
        </Text>
        {icon ? (
          icon
        ) : (
          <Image
            resizeMode="contain"
            source={Icons.pay}
            style={[CreditCardInputStyles.iconPay, iconStyle]}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

CreditCardInput.defaultProps = {
  autoFocus: true,
  placeholders: {
    number: '1234 5678 1234 5678',
    expiry: 'MM/YY',
    cvc: 'CVC',
  },
  defaultValues: {number: '', card: {}, expiry: '', cvc: ''},
  validColor: '',
  invalidColor: 'red',
  validButtonColor: 'black',
  invalidButtonColor: 'darkgray',
  placeholderColor: 'gray',
  additionalInputsProps: {},
  additionalButtonInputProps: {},
  additionalTextButtonInputProps: {},
  iconStyle: {},
};

CreditCardInput.propTypes = {
  autoFocus: PropTypes.bool,
  placeholders: PropTypes.object,
  inputStyle: Text.propTypes.style,
  validColor: PropTypes.string,
  invalidColor: PropTypes.string,
  validButtonColor: PropTypes.string,
  invalidButtonColor: PropTypes.string,
  placeholderColor: PropTypes.string,
  additionalInputsProps: PropTypes.objectOf(
    PropTypes.shape(TextInput.propTypes),
  ),
  additionalButtonInputProps: PropTypes.objectOf(
    PropTypes.shape(View.propTypes),
  ),
  additionalTextButtonInputProps: PropTypes.objectOf(
    PropTypes.shape(TextInput.propTypes),
  ),
  iconStyle: Image.propTypes.style,
  icon: PropTypes.element,
};

export default CreditCardInput;
