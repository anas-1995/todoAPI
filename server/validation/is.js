const isString = value => typeof value === 'string' || value instanceof String;

const isNumber = value => typeof value === 'number' && isFinite(value);

const isInteger = value => isNumber(value) && Number.isInteger(value);

const isFloat = value => (isNumber(value) && value % 1 !== 0) || value === 0;

const isArray = value => Array.isArray(value);

const isObject = value => value && typeof value === 'object';

module.exports = {
  isString,
  isNumber,
  isInteger,
  isFloat,
  isArray,
  isObject,
};
