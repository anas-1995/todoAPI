const { ExtractJwt, Strategy: JwtStrategy } = require('passport-jwt');

const ClientService = require('../schema/client');

const jwtOpts = {};
jwtOpts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOpts.secretOrKey = process.env.JWT_SECRET;


module.exports = passport => {
    passport.use(
        'jwt',
        new JwtStrategy(jwtOpts, (payload, done) => {

            if (payload.type === 'client') {
                ClientService.findClientById(payload.id)
                    .then(client => {
                        if (client) {
                            client.type = 'client';
                            return done(null, client);
                        }
                        return done(null, false);
                    })
                    .catch(err => done(err));
            }
        })
    );
};