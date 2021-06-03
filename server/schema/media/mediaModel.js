const mongoose = require('mongoose');


const mediaSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
    },
    creationDate: {
        type: Date,
        required: true,
        default: Date.now(),
    }
});

// userSchema.pre('save', function(next) {
//     const user = this;
//     user.lastModifiedDate = Date.now();
//     next();
// });

// userSchema.pre('findOneAndUpdate', function(next) {
//     const userUpdateObject = this;
//     userUpdateObject.runValidators = true;
//     userUpdateObject._update.$set.lastModifiedDate = Date.now();
//     next();
// });

module.exports = mongoose.model('media', mediaSchema, 'media');