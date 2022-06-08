import React from 'react';
import {TouchableOpacity, Text, Image} from 'react-native';
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
  validButtonColor: 'black',
  invalidButtonColor: 'darkgray',
  labelButton: 'Pay',
};

export default ButtonPay;
