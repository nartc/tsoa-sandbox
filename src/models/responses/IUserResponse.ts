import { IUserProfile } from '../User';
import { ITask, ITaskVm } from '../Task';

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
