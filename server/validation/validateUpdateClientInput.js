const validator = require('validator');
const isEmpty = require('./isEmpty');
const { isString, isObject } = require('./is');

module.exports = function validateUpdateClientInput(data, avatar) {
    data.username = !isEmpty(data.username) ? data.username : '';
    data.media = !isEmpty(data.media) ? data.media : '';

    if (isEmpty(data.username)) {
        return { error: 'Username field is required' };
    }
    if (!isString(data.username)) {
        return { error: 'Username is invalid' };
    }
    if (!validator.isLength(data.username, { min: 2 })) {
        return { error: 'Username is invalid' };
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