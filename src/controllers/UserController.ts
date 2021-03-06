import {compare, genSalt, hash} from 'bcryptjs';
import * as config from 'config';
import {sign} from 'jsonwebtoken';
import * as moment from 'moment';
import {MongoError} from 'mongodb';
import {Body, Controller, FormFile, Get, Path, Post, Request, Response, Route, Security, Tags} from 'tsoa';
import {IFileReference, ILoginParams, INewUserParams} from '../models/requests';
import {IErrorResponse, ILoginResponse, IUserResponse} from '../models/responses';
import {IUser, User} from '../models/User';
import {IUserRepository} from '../repositories/IUserRepository';
import {UserRepository} from '../repositories/UserRepository';
import {Request as eRequest} from 'express';

@Route('users')
export class UserController extends Controller {

    private static resolveErrorResponse(error: MongoError | null, message: string): IErrorResponse {
        return {
            thrown: true,
            error,
            message
        };
    }

    private readonly _userRepository: IUserRepository = new UserRepository(User);

    /**
     * Register new user
     *
     * @param {INewUserParams} requestBody Parameters to register new user
     * @returns {Promise<IUserResponse>}
     */
    @Response<IErrorResponse>('default', 'Error occurred')
    @Response<IUserResponse>('200', 'Success')
    @Tags('Auth')
    @Post('register')
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

        return await <IUserResponse>this._userRepository.createUser(newUser);
    }

    /**
     * Upload User's Profile picture
     *
     * @param image Profile Picture
     * @param request Current User Payload
     * @returns {Promise<IUserResponse>}
     */
    @Response<IErrorResponse>('default', 'Error occurred')
    @Response<IUserResponse>('200', 'Success')
    @Tags('Auth')
    @Security('JWT')
    @Post('uploadPicture')
    public async uploadProfilePicture(@FormFile() image, @Request() request: eRequest): Promise<IUserResponse> {
        console.log(image);
        return;
    }

    /**
     * Login user
     *
     * @param {ILoginParams} loginParams Parameters to login
     * @returns {Promise<ILoginResponse>}
     */
    @Response<IErrorResponse>('default', 'Error Occurred')
    @Response<ILoginResponse>('200', 'Success')
    @Tags('Auth')
    @Post('login')
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

        const payload = {user: fetchedUser};
        const token: string = sign(payload, process.env.JWT_SECRET || config.get('auth.jwt_secret'), {expiresIn: 1800});

        if (!token) throw UserController.resolveErrorResponse(null, 'Error signing payload');

        fetchedUser.lastVisited = moment().toDate();
        try {
            const result = await fetchedUser.save();
            return {
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
        } catch (error) {
            throw UserController.resolveErrorResponse(
                error instanceof MongoError ? error : null,
                error instanceof MongoError ? error.message : 'Unexpected Error');
        }
    }

    /**
     * Get detail information of a user
     *
     * @param {e.Request} request
     * @returns {Promise<IUserResponse>}
     */
    @Response<IErrorResponse>('default', 'Error Occurred')
    @Response<IUserResponse>('200', 'Success')
    @Tags('Auth')
    @Security('JWT')
    @Get('profile')
    public async getCurrentUser(@Request() request: eRequest): Promise<IUserResponse> {
        const currentUser: IUser = request.user;

        if (currentUser instanceof MongoError)
            throw UserController.resolveErrorResponse(currentUser, 'Error getting current User');

        if (!currentUser || currentUser === null)
            throw UserController.resolveErrorResponse(null, 'No current User');

        return <IUserResponse>currentUser;
    }
}
