import {MongoError} from 'mongodb';
import {model} from 'mongoose';
import {IUser, UserModel, UserSchema} from '../models/User';
import {IUserRepository} from './IUserRepository';

export class TaskRepository implements IUserRepository {
    private _userRepository: UserModel;

    constructor() {
        this._userRepository = model<IUser>('User', UserSchema) as UserModel;
    }

    public async createUser(newUser: IUser): Promise<IUser | MongoError> {
        return await this._userRepository.create(newUser);
    }

    public async getUserByUsername(username: string): Promise<IUser | MongoError> {
        const query = {username};
        return await this._userRepository.findOne(query);
    }

    public async getUserByEmailOrUsername(email: string, username: string): Promise<IUser | MongoError> {
        const query = {$or: [{email}, {username}]};
        return await this._userRepository.findOne(query);
    }

    public async getUserById(id: string): Promise<IUser | MongoError> {
        return await this._userRepository.findById(id);
    }

    public async updateUser(id: string, updatedUser: IUser): Promise<IUser | MongoError> {
        return await this._userRepository.findByIdAndUpdate(id, updatedUser, {new: true});
    }
}
