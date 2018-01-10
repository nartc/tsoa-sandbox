import { IUserRepository } from './IUserRepository';
import { UserSchema, IUser, UserModel } from '../models/User';
import { Model, model } from 'mongoose';
import { MongoError } from 'mongodb';

export class TaskRepository implements IUserRepository {
    private _userRepository: UserModel;

    constructor() {
        this._userRepository = model<IUser>('User', UserSchema) as UserModel;
    }
    public async createUser(newUser: IUser): Promise<IUser | MongoError> {
        const result = await this._userRepository.create(newUser);
        return result;
    }

    public async getUserByUsername(username: string): Promise<IUser | MongoError> {
        const query = { username };
        const result = await this._userRepository.findOne(query);
        return result;
    }

    public async getUserByEmailOrUsername(email: string, username: string): Promise<IUser | MongoError> {
        const query = { $or: [{ email }, { username }] };
        const result = await this._userRepository.findOne(query);
        return result;
    }

    public async getUserById(id: string): Promise<IUser | MongoError> {
        const result = await this._userRepository.findById(id);
        return result;
    }

    public async updateUser(id: string, updatedUser: IUser): Promise<IUser | MongoError> {
        const result = await this._userRepository.findByIdAndUpdate(id, updatedUser, { new: true });
        return result;
    }
}
