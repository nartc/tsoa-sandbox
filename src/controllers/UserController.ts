import { Controller, Route, Post, Body, SuccessResponse, Example, Response, Tags } from 'tsoa';
import { IUser, User } from '../models/User';
import { hash, genSalt, compare } from 'bcryptjs';
import { MongoError } from 'mongodb';
import { IUserRepository } from '../repositories/IUserRepository';
import { TaskRepository } from '../repositories/UserRepository';
import { sign } from 'jsonwebtoken';
import { INewUserParams, ILoginParams } from '../models/requests/index';
import { IErrorResponse, ILoginResponse, IUserResponse } from '../models/responses/index';
import * as config from 'config';
import * as moment from 'moment';

@Route('users')
export class UserController extends Controller {

    private static resolveErrorResponse(error: MongoError | null, message: string): IErrorResponse {
        const response: IErrorResponse = {
            thrown: true,
            error,
            message
        };

        return response;
    }

    private readonly _userRepository: IUserRepository = new TaskRepository();
    
    @Response<IErrorResponse>('default', 'Error occurred')
    @Response<IUserResponse>('200', 'Success')
    @Tags('Auth')
    @Post('/register')
    public async registerUser(@Body() requestBody: INewUserParams): Promise<IUserResponse> {
        const username: string = requestBody.username;
        const password: string = requestBody.password;
        const email: string = requestBody.email;

        const existUser: IUser = await this._userRepository.getUserByEmailOrUsername(email, username);

        if (existUser instanceof MongoError) throw UserController.resolveErrorResponse(existUser, existUser.message);

        if (existUser) throw UserController.resolveErrorResponse(null, 'Email or Username already existed.');

        const newUser: IUser = new User();
        newUser.username = username;
        newUser.email = email;

        const salt = await genSalt(10);
        newUser.password = await hash(password, salt);

        const result = await this._userRepository.createUser(newUser);
        return result;
    }

    @Response<IErrorResponse>('default', 'Error Occured')
    @Response<ILoginResponse>('200', 'Success')
    @Tags('Auth')
    @Post('/login')
    public async login(@Body() loginParams: ILoginParams): Promise<ILoginResponse> {
        const username: string = loginParams.username;
        const email: string = loginParams.email;
        const password: string = loginParams.password;

        const fetchedUser: IUser = await this._userRepository.getUserByEmailOrUsername(email, username);
        if (fetchedUser instanceof MongoError) 
            throw UserController.resolveErrorResponse(fetchedUser, fetchedUser.message);

        if (!fetchedUser || fetchedUser === null) throw UserController.resolveErrorResponse(null, 'Does not exist');

        const isMatched: boolean = await compare(password, fetchedUser.password);

        if (!isMatched) throw UserController.resolveErrorResponse(null, 'Password does not match');

        const payload = { user: fetchedUser };
        const token: string = sign(payload, config.get('auth.jwt_secret'), { expiresIn: 1800 });

        if (!token) throw UserController.resolveErrorResponse(null, 'Error signing payload');

        fetchedUser.lastVisited = moment().toDate();
        try {
            const result = await fetchedUser.save();
            const response: ILoginResponse = {
                authToken: `JWT ${token}`,
                _id: result._id,
                username: result.username,
                email: result.email,
                createdOn: result.createdOn,
                updatedOn: result.updatedOn,
                lastVisited: result.lastVisited,
                role: result.role,
                profile: result.profile
            };
            return response;
        } catch (error) {
            throw UserController.resolveErrorResponse(
                error instanceof MongoError ? error : null, 
                error instanceof MongoError ? error.message : 'Unexpected Error');
        }
    }
}
