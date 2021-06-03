const responseFormat = require('../utils/responseFormat');

const clientAuth = (req, res, next) => {
    if (req.user.type !== 'client') {
        return res.status(401).json(responseFormat({ error: "You don't have authority." }, res.statusCode));
    }
    next();
};


module.exports = {
    clientAuth
};