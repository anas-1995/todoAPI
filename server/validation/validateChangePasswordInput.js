const validator = require('validator');
const isEmpty = require('./isEmpty');
const { isString } = require('./is');

module.exports = function validateChangePasswordInput(data) {
    data.oldPassword = !isEmpty(data.oldPassword) ? data.oldPassword : '';
    data.newPassword = !isEmpty(data.newPassword) ? data.newPassword : '';
    data.confirmNewPassword = !isEmpty(data.confirmNewPassword) ? data.confirmNewPassword : '';
    if (isEmpty(data.oldPassword)) {
        return { error: 'Old password field is required' };
    }
    if (!isString(data.oldPassword)) {
        return { error: 'Old password is invalid' };
    }
    if (isEmpty(data.newPassword)) {
        return { error: 'New password field is required' };
    }
    if (!isString(data.newPassword)) {
        return { error: 'New password is invalid' };
    }
    if (!validator.isLength(data.newPassword, { min: 6, max: 30 })) {
        return { error: 'New password must be at least 6 characters' };
    }
    if (isEmpty(data.confirmNewPassword)) {
        return { error: 'Confirm new password field is required' };
    }
    if (!isString(data.confirmNewPassword)) {
        return { error: 'Confirm new password is invalid' };
    }
    if (!validator.equals(data.newPassword, data.confirmNewPassword)) {
        return { error: 'Passwords must match' };
    }
    if (data.oldPassword === data.newPassword) {
        return { error: 'New password is the same as the old password.' };
    }
    return true;
};