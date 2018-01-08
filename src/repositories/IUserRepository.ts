import {IUser} from '../models/User';

export interface IUserRepository {
    createUser(newUser: IUser);
    getUserByUsername(username: string);
    getUserByEmail(email: string);
    getUserById(id: string);
    updateUser(id: string, updatedUser: IUser);
}
