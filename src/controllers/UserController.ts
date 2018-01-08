import { Controller, Route, Post, Body, SuccessResponse, Example } from 'tsoa';
import { INewUserParams, IUser, User } from '../models/User';
import { IErrorResponse } from '../models/ErrorResponse';
import { hash, genSalt } from 'bcryptjs';
import { MongoError } from 'mongodb';
import { IUserRepository } from '../repositories/IUserRepository';
import { UserRepository } from '../repositories/UserRepository';

@Route('users')
export class UserController extends Controller {

  private _userRepository: IUserRepository = new UserRepository();

  @SuccessResponse('200', 'Successfully Registered')
  @Post('/register')
  public async registerUser(@Body() requestBody: INewUserParams): Promise<IUser | IErrorResponse> {
    const username: string = requestBody.username;
    const password: string = requestBody.password;
    const email: string = requestBody.email;

    if (!username || !password || !email) {
      const response: IErrorResponse = {
        error: null,
        message: 'All fields must be entered.'
      }

      return Promise.resolve(response);
    }

    const existUser: IUser = await this._userRepository.getUserByEmailOrUsername(email, username);

    if (existUser instanceof MongoError) {
      const response: IErrorResponse = {
        error: existUser,
        message: existUser.message
      }

      return Promise.resolve(response);
    }

    if (existUser) {
      const response: IErrorResponse = {
        error: null,
        message: 'Email or Username already existed.'
      }

      return Promise.resolve(response);
    }

    const newUser: IUser = new User();
    newUser.username = username;
    newUser.email = email;

    const salt = await genSalt(10);
    newUser.password = await hash(newUser.password, salt);

    const result: IUser = await this._userRepository.createUser(newUser);
    return result;
  }

}
