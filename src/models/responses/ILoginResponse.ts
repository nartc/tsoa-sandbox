import {IUserProfile, UserRole} from '../User';

export interface ILoginResponse {
    authToken: string;
    _id?: string;
    username?: string;
    email?: string;
    createdOn?: Date;
    updatedOn?: Date;
    lastVisited?: Date;
    role?: UserRole;
    profile?: IUserProfile;
}
