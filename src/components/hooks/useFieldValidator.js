import {FALLBACK_CARD} from '../../utils/Constants';
var valid = require('card-validator');

const toStatus = validation => {
  return validation.isValid
    ? 'valid'
    : validation.isPotentiallyValid
    ? 'incomplete'
    : 'invalid';
};

const useFieldValidator = () => {
  const validateValues = formValues => {
    const numberValidation = valid.number(formValues.number);
    const expiryValidation = valid.expirationDate(formValues.expiry);
    const maxCVCLength = (numberValidation.card || FALLBACK_CARD).code.size;
    const cvcValidation = valid.cvv(formValues.cvc, maxCVCLength);

    const validationStatuses = {
      number: toStatus(numberValidation),
      expiry: toStatus(expiryValidation),
      cvc: toStatus(cvcValidation),
    };

    return {
      valid: Object.values(validationStatuses).every((value, _index, arr) => {
        if (value === 'valid') {
          return true;
        }
        return false;
      }),
      fields: validationStatuses,
    };
  };
  return {validateValues};
};

export default useFieldValidator;
