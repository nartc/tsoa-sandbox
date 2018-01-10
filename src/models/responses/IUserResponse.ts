import {ITaskVm} from '../Task';
import {IUserProfile} from '../User';

export interface IUserResponse {
    _id?: string;
    username?: string;
    email?: string;
    password?: string;
    createdOn?: Date;
    updatedOn?: Date;
    lastVisited?: Date;
    role?: string;
    profile?: IUserProfile;
    tasks?: ITaskVm[];
}
