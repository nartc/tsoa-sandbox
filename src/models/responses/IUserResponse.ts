import {ITaskVm} from '../Task';
import {IUserProfile, UserRole} from '../User';

export interface IUserResponse {
    _id?: string;
    username?: string;
    email?: string;
    password?: string;
    createdOn?: Date;
    updatedOn?: Date;
    lastVisited?: Date;
    role?: UserRole;
    profile?: IUserProfile;
    tasks?: ITaskVm[];
}
