import React, {useEffect, useState, useRef, useCallback} from 'react';
import {View, Image} from 'react-native';
import Icons from '../../Icons';
import Input from '../Input';
import ButtonPay from '../ButtonPay';
import CreditCardInputStyles from './styles';
import useFieldFormatter from '../../hooks/useFieldFormatter';
import useFieldValidator from '../../hooks/useFieldValidator';
import useCheckOut from '../../hooks/useCheckOut';

const CreditCardInput = ({
  autoFocus,
  inputStyle,
  buttonStyle,
  buttonTextStyle,
  validColor,
  invalidColor,
  placeholderColor,
  validButtonColor,
  invalidButtonColor,
  additionalInputProps,
  additionalButtonInputProps,
  additionalTextButtonInputProps,
  iconStyle,
  labelButton,
  icon,
  placeholders,
  defaultValues,
  rebillSdk,
  onCheckoutInProcess,
  onPay,
}) => {
  const numberRef = useRef();
  const expiryRef = useRef();
  const cvcRef = useRef();
  const {formatValues} = useFieldFormatter();
  const {validateValues} = useFieldValidator();
  const checkout = useCheckOut();
  const [currentFocus, setCurrentFocus] = useState('');
  const [checkoutInProcess, setCheckoutInProcess] = useState(false);
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
    onCheckoutInProcess?.(checkoutInProcess);
  }, [checkoutInProcess, onCheckoutInProcess]);

  useEffect(() => {
    if (autoFocus) {
      numberRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    const _formatValues = formatValues({...defaultValues});
    if (defaultValues?.number?.length > 0) {
      const _validateValues = validateValues(_formatValues);
      setStatus(_validateValues);
    }
    setValues({
      ..._formatValues,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

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
      setValues({...values, ..._formatValues});
      setStatus(_validateValues);
      onBecomeValid(_validateValues);
    },
    [formatValues, validateValues, onBecomeValid, values],
  );

  const handleOnFocus = useCallback((_e, field) => setCurrentFocus(field), []);

  const _iconToShow = () => {
    if (currentFocus === 'cvc' && values?.card?.type === 'american-express') {
      return 'cvc_amex';
    }
    if (currentFocus === 'cvc') {
      return 'cvc';
    }
    if (values?.card?.type) {
      return values?.card.type;
    }
    return 'placeholder';
  };

  const handleOnPay = useCallback(async () => {
    if (rebillSdk) {
      setCheckoutInProcess(true);
      rebillSdk.setNumber(values.number.replaceAll(' ', ''));
      rebillSdk.setExpiry(values.expiry);
      rebillSdk.setCvc(values.cvc);
      await checkout(rebillSdk);
      setCheckoutInProcess(false);
    } else {
      onPay?.({
        cardNumber: values.number.replaceAll(' ', ''),
        securityCode: values.cvc,
        expiration: {
          month: values.expiry.split('/')[0],
          year: `${new Date().getFullYear().toString().substring(0, 2)}${
            values.expiry.split('/')[1]
          }`,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rebillSdk, onPay, values]);

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
      <ButtonPay
        status={status}
        validButtonColor={validButtonColor}
        invalidButtonColor={invalidButtonColor}
        onPressPlay={handleOnPay}
        icon={icon}
        iconStyle={iconStyle}
        buttonStyle={buttonStyle}
        buttonTextStyle={buttonTextStyle}
        labelButton={labelButton}
        additionalButtonInputProps={additionalButtonInputProps}
        additionalTextButtonInputProps={additionalTextButtonInputProps}
      />
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
  invalidColor: 'red',
  validButtonColor: 'black',
  invalidButtonColor: 'darkgray',
  placeholderColor: 'gray',
};

export default CreditCardInput;
