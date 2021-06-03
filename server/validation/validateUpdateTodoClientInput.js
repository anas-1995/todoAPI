const validator = require('validator');
const isEmpty = require('./isEmpty');
const { isString } = require('./is');

module.exports = function validateUpdateTodoClientInput(data) {
    data.content = !isEmpty(data.content) ? data.content : '';
    data.status = !isEmpty(data.status) ? data.status : ''
    if (!isString(data.content)) {
        return { error: 'content is invalid' };
    }
    if (isEmpty(data.content)) {
        return { error: 'content field is required' };
    }
    if (!validator.isLength(data.content, { min: 2, max: 200 })) {
        return { error: 'content is invalid' };
    }


    if (!isString(data.status)) {
        return { error: 'status is invalid' };
    }
    if (isEmpty(data.status)) {
        return { error: 'status field is required' };
    }
    if (data.status != "PENDING" && data.status != "DOING" && data.status != "DONE") {
        return { error: 'status is invalid' };
    }

    return true;
};