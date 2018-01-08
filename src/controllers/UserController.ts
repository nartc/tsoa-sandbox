import { Controller, Route, Post, Body, SuccessResponse, Example, Response } from 'tsoa';
import { INewUserParams, IUser, User, IUserVm, ILoginParams, ILoginResponse } from '../models/User';
import { IErrorResponse } from '../models/ErrorResponse';
import { hash, genSalt, compare } from 'bcryptjs';
import { MongoError } from 'mongodb';
import { IUserRepository } from '../repositories/IUserRepository';
import { UserRepository } from '../repositories/UserRepository';
import { sign } from 'jsonwebtoken';

import * as config from 'config';
import * as moment from 'moment';
@Route('users')
export class UserController extends Controller {
    private static resolveErrorResponse(error: MongoError | null, message: string): Promise<IErrorResponse> {
        const response: IErrorResponse = {
            error,
            message
        };

        return Promise.resolve(response);
    }

    private readonly _userRepository: IUserRepository = new UserRepository();

    @SuccessResponse('200', 'Successfully Registered')
    @Example<IUserVm>({
        username: 'jdoe',
        email: 'jdoe@mail.com',
        password: 'hashed-password',
        createdOn: moment().toDate(),
        updatedOn: moment().toDate(),
        role: 'User',
        lastVisited: moment().toDate(),
        profile: {
            firstName: 'John',
            lastName: 'Doe',
            fullName: 'John Doe'
        },
        tasks: []
    })
    @Post('/register')
    public async registerUser(@Body() requestBody: INewUserParams): Promise<IUser | IErrorResponse> {
        const username: string = requestBody.username;
        const password: string = requestBody.password;
        const email: string = requestBody.email;

        const existUser: IUser = await this._userRepository.getUserByEmailOrUsername(email, username);

        if (existUser instanceof MongoError) return UserController.resolveErrorResponse(existUser, existUser.message);

        if (existUser) return UserController.resolveErrorResponse(null, 'Email or Username already existed.');

        const newUser: IUser = new User();
        newUser.username = username;
        newUser.email = email;

        const salt = await genSalt(10);
        newUser.password = await hash(password, salt);

        const result = await this._userRepository.createUser(newUser);
        return result;
    }

    @SuccessResponse('200', 'Logged In')
    @Example<IUserVm>({
        username: 'jdoe',
        email: 'jdoe@mail.com',
        password: 'hashed-password',
        createdOn: moment().toDate(),
        updatedOn: moment().toDate(),
        role: 'User',
        lastVisited: moment().toDate(),
        profile: {
            firstName: 'John',
            lastName: 'Doe',
            fullName: 'John Doe'
        },
        tasks: []
    })
    @Post('/login')
    public async login(@Body() loginParams: ILoginParams): Promise<ILoginResponse | IErrorResponse> {
        const username: string = loginParams.username;
        const email: string = loginParams.email;
        const password: string = loginParams.password;

        const fetchedUser: IUser | MongoError = await this._userRepository.getUserByEmailOrUsername(email, username);
        if (fetchedUser instanceof MongoError) 
          return UserController.resolveErrorResponse(fetchedUser, fetchedUser.message);
        
        if (!fetchedUser || fetchedUser === null)
          return UserController.resolveErrorResponse(null, 'Does not exist');

        const isMatched: boolean = await compare(password, fetchedUser.password);

        if (!isMatched)
          return UserController.resolveErrorResponse(null, 'Password does not match');
        
        const payload = {user: fetchedUser};
        const token: string = sign(payload, config.get('auth.jwt_secret'), {expiresIn: 1800});

        if (!token)
          return UserController.resolveErrorResponse(null, 'Error signing payload');
        
        fetchedUser.lastVisited = moment().toDate();
        try {
          const result = await fetchedUser.save();
          const response = {
            authToken: `JWT ${token}`,
            user: {
              _id: result._id,
              username: result.username,
              email: result.email,
              createdOn: result.createdOn,
              updatedOn: result.updatedOn,
              lastVisited: result.lastVisited,
              role: result.role,
              profile: result.profile
            }
          }
          return Promise.resolve(response);
        } catch (error) {
          return UserController.resolveErrorResponse(
            error instanceof MongoError ? error : null, 
            error instanceof MongoError ? error.message : 'Unexpected Error');
        }
    }
}
