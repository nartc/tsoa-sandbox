import * as config from 'config';
import * as _passport from 'passport';
import { PassportStatic } from 'passport';
import { StrategyOptions, ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { IUser } from '../../models/User';
import { IUserRepository } from '../../repositories/IUserRepository';
import { TaskRepository } from '../../repositories/UserRepository';
import { MongoError } from 'mongodb';

export const authenticateUser = (passport: PassportStatic) => {
  const _userRepository: IUserRepository = new TaskRepository();

  const options: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    secretOrKey: config.get('auth.jwt_secret')
  };

  passport.use(new Strategy(options, async (jwtPayload: IJwtPayload, done: VerifiedCallback) => {
    const result = await _userRepository.getUserById(jwtPayload.user._id);

    if (result instanceof MongoError) return done(result, false);
    if (!result) {
      return done(null, false);
    } else {
      return done(null, result, { issuedAt: jwtPayload.iat });
    }
  }));
};

export const expressAuthentication = _passport.authenticate('jwt', { session: false });

interface IJwtPayload {
  user?: IUser;
  iat?: Date;
}
