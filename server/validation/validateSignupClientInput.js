const validator = require('validator');
const isEmpty = require('./isEmpty');
const { isString } = require('./is');

module.exports = function validateSignupClientInput(data) {
    data.username = !isEmpty(data.username) ? data.username : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
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
    if (isEmpty(data.email)) {
        return { error: 'Email field is required' };
    }
    if (!isString(data.email)) {
        return { error: 'Email is invalid' };
    }
    if (!validator.isEmail(data.email)) {
        return { error: 'Email is invalid' };
    }
    if (isEmpty(data.password)) {
        return { error: 'Password field is required' };
    }
    if (!isString(data.password)) {
        return { error: 'Password is invalid' };
    }
    if (!validator.isLength(data.password, { min: 6, max: 30 })) {
        return { error: 'Password must be at least 6 characters' };
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