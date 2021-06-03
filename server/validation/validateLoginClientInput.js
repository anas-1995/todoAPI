const isEmpty = require('./isEmpty');
const { isString } = require('./is');

module.exports = function validateLoginClientInput(data) {
    data.email = !isEmpty(data.email) ? data.email : '';
    if (isEmpty(data.email)) {
        return { error: 'Email field is required' };
    }
    if (!isString(data.email)) {
        return { error: 'Email is invalid' };
    }
    data.password = !isEmpty(data.password) ? data.password : '';
    if (isEmpty(data.password)) {
        return { error: 'Password field is required' };
    }
    if (!isString(data.password)) {
        return { error: 'Password is invalid' };
    }
    return true;
};