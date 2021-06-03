const mongoose = require('mongoose');

const connectToMongodb = () =>
    mongoose
    .connect(
        "mongodb://localhost:27017/" + process.env.DB_NAME, { useNewUrlParser: true, useCreateIndex: true }
    )
    .then(() => {
        console.log('Mongodb is connected!');
        //   logger.info('Mongodb is connected!');
    })
    .catch(err => {
        console.log('Mongodb connection falied', err);
        //   logger.info('Mongodb connection falied', err);
    });

module.exports = {
    mongoose,
    connectToMongodb,
};