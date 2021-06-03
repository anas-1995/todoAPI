const validator = require('validator');
const isEmpty = require('./isEmpty');
const { isString } = require('./is');

module.exports = function validateAddUserInput(data) {
    data.name = !isEmpty(data.name) ? data.name : '';
    data.media = !isEmpty(data.media) ? data.media : '';

    if (!isString(data.name)) {
        return { error: 'Name is invalid' };
    }
    if (isEmpty(data.name)) {
        return { error: 'Name field is required' };
    }
    if (!validator.isLength(data.name, { min: 2 })) {
        return { error: 'Name is invalid' };
    }


    if (isEmpty(data.media)) {
        return { error: 'media is empty' };
    }
    if (!isString(data.media)) {
        return { error: 'media is invalid' };
    }
    if (!validator.isMongoId(data.media)) {
        return { error: 'media is invalid' };
    }

    return true;
};