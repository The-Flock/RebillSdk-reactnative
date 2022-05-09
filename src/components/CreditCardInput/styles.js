import {StyleSheet} from 'react-native';

const CreditCardInputStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 4,
    borderWidth: 2,
  },
  containerInputs: {flexDirection: 'row', flex: 1},
  icon: {
    width: 40,
    height: 20,
  },
  expanded: {
    flex: 1,
  },
  hidden: {
    width: 0,
  },
  leftPart: {
    overflow: 'hidden',
  },
  rightPart: {
    overflow: 'hidden',
    flexDirection: 'row',
  },
  last4: {
    flex: 1,
    justifyContent: 'center',
  },
  numberInput: {
    width: '64%',
  },
  expiryInput: {
    width: '18%',
  },
  cvcInput: {
    width: '18%',
  },
  last4Input: {
    width: 60,
    marginLeft: 20,
  },
  last4InputHiddenView: {
    width: 20,
  },
  input: {
    height: 40,
    color: 'black',
  },
});

export default CreditCardInputStyles;
