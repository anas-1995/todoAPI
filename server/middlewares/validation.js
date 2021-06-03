const validateAddUserInput = require("../validation/validateAddUserInput")
const validateSignupClientInput = require("../validation/validateSignupClientInput")
const validateLoginClientInput = require("../validation/validateLoginClientInput")
const validateAddTodoClientInput = require("../validation/validateAddTodoClientInput")
const validateUpdateTodoClientInput = require("../validation/validateUpdateTodoClientInput")
const validateChangePasswordInput = require("../validation/validateChangePasswordInput")
const validateUpdateClientInput = require("../validation/validateUpdateClientInput")


const responseFormat = require('../utils/responseFormat');

const addUserInputValidation = (req, res, next) => {
    const isValid = validateAddUserInput(req.body);
    if (isValid.error) {
        return res.status(400).json(responseFormat(isValid, res.statusCode));
    }
    next();
};


const signupClientInputValidation = (req, res, next) => {
    const isValid = validateSignupClientInput(req.body);
    if (isValid.error) {
        return res.status(400).json(responseFormat(isValid, res.statusCode));
    }
    next();
};


const loginClientInputValidation = (req, res, next) => {
    const isValid = validateLoginClientInput(req.body);
    if (isValid.error) {
        return res.status(400).json(responseFormat(isValid, res.statusCode));
    }
    next();
};


const addTodoClientInputValidation = (req, res, next) => {
    const isValid = validateAddTodoClientInput(req.body);
    if (isValid.error) {
        return res.status(400).json(responseFormat(isValid, res.statusCode));
    }
    next();
};


const updateTodoClientInputValidation = (req, res, next) => {
    const isValid = validateUpdateTodoClientInput(req.body);
    if (isValid.error) {
        return res.status(400).json(responseFormat(isValid, res.statusCode));
    }
    next();
};


const changePasswordInputValidation = (req, res, next) => {
    const isValid = validateChangePasswordInput(req.body);
    if (isValid.error) {
        return res.status(400).json(responseFormat(isValid, res.statusCode));
    }
    next();
};



const updateClientInputValidation = (req, res, next) => {
    const isValid = validateUpdateClientInput(req.body, req.file);
    if (isValid.error) {
        if (req.file) {
            deletePicture(req.file.path);
        }
        return res.status(400).json(responseFormat(isValid, res.statusCode));
    }
    next();
};


module.exports = {
    signupClientInputValidation,
    loginClientInputValidation,
    addTodoClientInputValidation,
    updateTodoClientInputValidation,
    addUserInputValidation,
    changePasswordInputValidation,
    updateClientInputValidation
}