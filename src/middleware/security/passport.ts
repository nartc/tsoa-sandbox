import * as config from 'config';
import {MongoError} from 'mongodb';
import * as _passport from 'passport';
import {PassportStatic} from 'passport';
import {ExtractJwt, Strategy, StrategyOptions, VerifiedCallback} from 'passport-jwt';
import {User} from '../../models/User';
import {IUserRepository} from '../../repositories/IUserRepository';
import {UserRepository} from '../../repositories/UserRepository';
import {IUserResponse} from '../../models/responses';

export const authenticateUser = (passport: PassportStatic) => {
    const _userRepository: IUserRepository = new UserRepository(User);

    const options: StrategyOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
        secretOrKey: process.env.JWT_SECRET || config.get('auth.jwt_secret')
    };

    passport.use(new Strategy(options, async (jwtPayload: IJwtPayload, done: VerifiedCallback) => {
        const result = await <IUserResponse>_userRepository.getUserById(jwtPayload.user._id);

        if (result instanceof MongoError) return done(result, false);
        if (!result) {
            return done(null, false);
        } else {
            return done(null, result, {issuedAt: jwtPayload.iat});
        }
    }));
};

export const expressAuthentication = _passport.authenticate('jwt', {session: false});

interface IJwtPayload {
    user?: IUserResponse;
    iat?: Date;
}
