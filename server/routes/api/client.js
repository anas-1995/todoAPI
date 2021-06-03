const path = require('path');
const appRoot = require('app-root-path');
const express = require('express');
const passport = require('passport');
const { clientAuth } = require('../../middlewares/auth');
const {
    signupClientInputValidation,
    loginClientInputValidation,
    addTodoClientInputValidation,
    changePasswordInputValidation,
    updateTodoClientInputValidation,
    updateClientInputValidation,
} = require('../../middlewares/validation');

const router = express.Router();

const ClientService = require('../../schema/client');
const responseFormat = require('../../utils/responseFormat');

// @route   GET api/client/test
// @desc    Test client route
// @access  public
router.get('/test',
    (req, res) => res.json({ test: 'success' }));


// @route   POST api/client/auth/signup
// @desc    Sign up a new client
// @access  public
router.post('/auth/signup', signupClientInputValidation, (req, res, next) => {
    ClientService.signUp(req.body)
        .then(response => {
            if (response.error) {
                res.status(400);
            }
            return res.json(responseFormat(response, res.statusCode));
        })
        .catch(err => next(err));
});



// @route   POST api/client/auth/login
// @desc    Login client
// @access  public
router.post('/auth/login', loginClientInputValidation, (req, res, next) => {
    ClientService.login(req.body)
        .then(response => {
            if (response.error) {
                res.status(400);
            }
            return res.json(responseFormat(response, res.statusCode));
        })
        .catch(err => next(err));
});


// @route   PUT api/client/auth/editPassword
// @desc    Edit password
// @access  private
router.put(
    '/auth/editPassword',
    passport.authenticate('jwt', { session: false }),
    changePasswordInputValidation,
    (req, res, next) => {
        ClientService.changePassword(req.user.client.id, req.body)
            .then(response => {
                if (response.error) {
                    res.status(400);
                }
                return res.json(responseFormat(response, res.statusCode));
            })
            .catch(err => next(err));
    }
);

// @route   PUT api/client
// @desc    Edit profile
// @access  private
router.put(
    '/',
    passport.authenticate('jwt', { session: false }),
    clientAuth,
    updateClientInputValidation,
    (req, res, next) => {
        ClientService.editProfile(req.user.client.id, req.body, req.file)
            .then(response => {
                if (response.error) {
                    res.status(400);
                }
                return res.json(responseFormat(response, res.statusCode));
            })
            .catch(err => next(err));
    }
);




// @route   POST api/client/{id}/todo
// @desc    Add todo to client
// @access  Auth
router.post('/:id/todo', passport.authenticate('jwt', { session: false }), clientAuth, addTodoClientInputValidation, (req, res, next) => {
    console.log("SSSS");
    ClientService.addTodoToClient(req.params.id, req.body)
        .then(response => {
            if (response.error) {
                res.status(400);
            }
            return res.json(responseFormat(response, res.statusCode));
        })
        .catch(err => next(err));
});

// @route   PUT api/client/{id}/todo/{todoId}
// @desc    Update todo 
// @access  Auth
router.put('/:id/todo/:todoId', passport.authenticate('jwt', { session: false }), clientAuth, updateTodoClientInputValidation, (req, res, next) => {
    ClientService.updateTodoToClient(req.params.id, req.params.todoId, req.body)
        .then(response => {
            if (response.error) {
                res.status(400);
            }
            return res.json(responseFormat(response, res.statusCode));
        })
        .catch(err => next(err));
});


// @route   DELETE api/client/{id}/todo/{todoId}
// @desc    Delete todo 
// @access  Auth
router.delete('/:id/todo/:todoId', passport.authenticate('jwt', { session: false }), clientAuth, (req, res, next) => {
    ClientService.deleteTodoToClient(req.params.id, req.params.todoId, req.body)
        .then(response => {
            if (response.error) {
                res.status(400);
            }
            return res.json(responseFormat(response, res.statusCode));
        })
        .catch(err => next(err));
});


// @route   GET api/client/{id}/todo/{todoId}
// @desc    Get todo 
// @access  Auth
router.get('/:id/todo/:todoId', passport.authenticate('jwt', { session: false }), clientAuth, (req, res, next) => {
    ClientService.getTodoToClient(req.params.id, req.params.todoId)
        .then(response => {
            if (response.error) {
                res.status(400);
            }
            return res.json(responseFormat(response, res.statusCode));
        })
        .catch(err => next(err));
});


// @route   GET api/client/{id}/todo
// @desc    Get all todo 
// @access  Auth
router.get('/:id/todo', passport.authenticate('jwt', { session: false }), clientAuth, async(req, res, next) => {
    try {
        let response = await ClientService.getAllTodoToClient(req.params.id)
        return res.json(responseFormat(response, res.statusCode));

    } catch (err) {
        next(err)
    }
});



module.exports = router;