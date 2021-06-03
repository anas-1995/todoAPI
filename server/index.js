const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const path = require('path');

const dotenvJSON = require("dotenv-json");
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
if (process.env.NODE_ENV === 'development') {
    dotenvJSON({ path: path.resolve('./config', 'config.development.json') });
} else if (process.env.NODE_ENV === 'production') {
    dotenvJSON({ path: path.resolve('./config', 'config.production.json') });
}
const { connectToMongodb } = require('./db');

const passport = require('passport');
const passportConfig = require('./passport');


const port = process.env.PORT

app.use(express.static('public'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));




// Use passport
app.use(passport.initialize());
passportConfig(passport);

// Routes
const mediaRoute = require('./routes/api/media');
const clientRoute = require('./routes/api/client');


// Use Route
app.use('/api/client', clientRoute);
app.use('/api/media', mediaRoute);
app.use(express.static('public'))


// Connect to mongodb
connectToMongodb();



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})