import {IUserVm} from '../User';

export interface ITaskResponse {
    _id?: string;
    title?: string;
    content?: string;
    slug?: string;
    createdOn?: Date;
    updatedOn?: Date;
    isCompleted?: boolean;
    user?: IUserVm;
}
