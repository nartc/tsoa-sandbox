import {IUser} from '../models/User';

export interface IUserRepository {
    createUser(newUser: IUser);

    getUserByUsername(username: string);

    getUserByEmailOrUsername(email: string, username: string);

    getUserById(id: string);

    updateUser(id: string, updatedUser: IUser);
}
