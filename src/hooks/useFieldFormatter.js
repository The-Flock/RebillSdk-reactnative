import {removeNonNumber} from '../utils/Utilities';
import {FALLBACK_CARD} from '../utils/Constants';
var valid = require('card-validator');

const limitLength = (string = '', maxLength) => string.substr(0, maxLength);
const addGaps = (string = '', gaps) => {
  const offsets = [0].concat(gaps).concat([string.length]);

  return offsets
    .map((end, index) => {
      if (index === 0) {
        return '';
      }
      const start = offsets[index - 1];
      return string.substr(start, end - start);
    })
    .filter(part => part !== '')
    .join(' ');
};
const _formatNumber = (number, card) => {
  const numberSanitized = removeNonNumber(number);
  const maxLength = card.lengths[card.lengths.length - 1];
  const lengthSanitized = limitLength(numberSanitized, maxLength);
  const formatted = addGaps(lengthSanitized, card.gaps);
  return formatted;
};

const _formatExpiry = expiry => {
  const sanitized = limitLength(removeNonNumber(expiry), 4);
  if (sanitized.match(/^[2-9]$/)) {
    return `0${sanitized}`;
  }
  if (sanitized.length > 2) {
    return `${sanitized.substr(0, 2)}/${sanitized.substr(2, sanitized.length)}`;
  }
  return sanitized;
};

const _formatCVC = (cvc, card) => {
  const maxCVCLength = card.code.size;
  return limitLength(removeNonNumber(cvc), maxCVCLength);
};

const useFieldFormatter = () => {
  const formatValues = values => {
    const card = valid.number(values.number).card || FALLBACK_CARD;
    return {
      card: card,
      number: _formatNumber(values.number, card),
      expiry: _formatExpiry(values.expiry),
      cvc: _formatCVC(values.cvc, card),
    };
  };
  return {formatValues};
};

export default useFieldFormatter;
