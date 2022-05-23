import React from 'react';
import {TouchableOpacity, Text, Image, View, TextInput} from 'react-native';
import PropTypes from 'prop-types';
import ButtonPayStyles from './styles';
import Icons from '../../Icons';

const ButtonPay = ({
  status,
  validButtonColor,
  invalidButtonColor,
  onPressPlay,
  icon,
  iconStyle,
  buttonStyle,
  buttonTextStyle,
  labelButton,
  additionalButtonInputProps,
  additionalTextButtonInputProps,
}) => (
  <TouchableOpacity
    style={[
      ButtonPayStyles.buttonPay,
      buttonStyle,
      {
        backgroundColor: status.valid ? validButtonColor : invalidButtonColor,
      },
    ]}
    disabled={!status.valid}
    onPress={onPressPlay}
    {...additionalButtonInputProps}>
    <Text
      style={[ButtonPayStyles.buttonText, buttonTextStyle]}
      {...additionalTextButtonInputProps}>
      {labelButton}
    </Text>
    {icon ? (
      icon
    ) : (
      <Image
        resizeMode="contain"
        source={Icons.pay}
        style={[ButtonPayStyles.iconPay, iconStyle]}
      />
    )}
  </TouchableOpacity>
);

ButtonPay.defaultProps = {
  status: {},
  validButtonColor: 'black',
  invalidButtonColor: 'darkgray',
  additionalButtonInputProps: {},
  additionalTextButtonInputProps: {},
  iconStyle: {},
  buttonStyle: {},
  buttonTextStyle: {},
  labelButton: 'Pay',
};

ButtonPay.propTypes = {
  status: PropTypes.object,
  validButtonColor: PropTypes.string,
  invalidButtonColor: PropTypes.string,
  additionalButtonInputProps: PropTypes.objectOf(
    PropTypes.shape(View.propTypes),
  ),
  additionalTextButtonInputProps: PropTypes.objectOf(
    PropTypes.shape(TextInput.propTypes),
  ),
  iconStyle: Image.propTypes.style,
  buttonStyle: View.propTypes.style,
  buttonTextStyle: Text.propTypes.style,
  labelButton: PropTypes.string,
  icon: PropTypes.element,
};

export default ButtonPay;
