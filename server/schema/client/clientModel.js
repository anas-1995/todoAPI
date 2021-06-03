const mongoose = require('mongoose');
// const idValidator = require('mongoose-id-validator');
const bcrypt = require('bcryptjs');

const SALT_WORK_FACTOR = 10;

const clientSchema = mongoose.Schema({
    method: {
        type: String,
        enum: ['localAuth'],
        required: true,
    },
    localAuth: {
        _id: false,
        email: {
            type: String,
            index: true,
        },
        password: {
            type: String,
        },
        resetPasswordToken: {
            type: String,
        },
        resetPasswordTokenExpires: {
            type: Date,
        },
    },
    linkedin: {
        _id: false,
        id: {
            type: String,
            index: true,
        },
        email: {
            type: String,
        },
    },
    google: {
        _id: false,
        id: {
            type: String,
            index: true,
        },
        email: {
            type: String,
        },
    },
    verified: {
        type: Boolean,
        required: true,
        default: true,
    },
    username: {
        type: String,
        required: true,
    },
    media: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'media',
        required: true,
    },
    todo: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            auto: true
        },
        content: { type: String, max: 100 },
        status: { type: String, enum: ['PENDING', 'DOING', 'DONE'], default: "PENDING" },
        creationDate: {
            type: Date,
            required: true,
            default: Date.now(),
        },
        lastModifiedDate: {
            type: Date,
            required: true,
            default: Date.now(),
        },
    }],
    creationDate: {
        type: Date,
        required: true,
        default: Date.now(),
    },
    lastModifiedDate: {
        type: Date,
        required: true,
        default: Date.now(),
    },
});

clientSchema.pre('save', function(next) {
    const client = this;
    if (!client.isModified('localAuth.password')) {
        client.lastModifiedDate = Date.now();
        next();
    }
    bcrypt
        .genSalt(SALT_WORK_FACTOR)
        .then(salt => bcrypt.hash(client.localAuth.password, salt))
        .then(hash => {
            client.localAuth.password = hash;
            client.localAuth.lastModifiedDate = Date.now();
            next();
        })
        .catch(err => next(err));
});

clientSchema.pre('findOneAndUpdate', function(next) {
    const clientUpdateObject = this;
    clientUpdateObject.options.runValidators = true;
    if (clientUpdateObject._update.$pull) {
        clientUpdateObject._update.$set = {};
        clientUpdateObject._update.$set.lastModifiedDate = Date.now();
        next();
    }

    if (!clientUpdateObject._update.$set['localAuth.password']) {
        clientUpdateObject._update.$set.lastModifiedDate = Date.now();
        next();
    }
    bcrypt
        .genSalt(SALT_WORK_FACTOR)
        .then(salt => bcrypt.hash(clientUpdateObject._update.$set['localAuth.password'], salt))
        .then(hash => {
            clientUpdateObject._update.$set['localAuth.password'] = hash;
            clientUpdateObject._update.$set.lastModifiedDate = Date.now();
            next();
        })
        .catch(err => next(err));
});

clientSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.localAuth.password).catch(err => Promise.reject(err));
};

// clientSchema.plugin(idValidator);
module.exports = mongoose.model('client', clientSchema);