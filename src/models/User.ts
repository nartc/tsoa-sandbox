import {Document, Model, model, Schema} from 'mongoose';

export const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now()
    },
    updatedOn: {
        type: Date,
        default: Date.now()
    },
    role: {
        type: String,
        enum: ['User', 'Admin'],
        default: 'User'
    },
    lastVisited: Date,
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    profile: {
        firstName: String,
        lastName: String,
        fullName: String
    },
    tasks: [{
        type: Schema.Types.ObjectId,
        ref: 'Task'
    }]
});

export interface IUser extends Document {
    username: string;
    email: string;
    password?: string;
    createdOn?: Date;
    updatedOn?: Date;
    role?: string;
    lastVisited?: Date;
    profile?: IUserProfile;
    tasks?: string[];
}

export interface IUserVm {
    username: string;
    email: string;
    password?: string;
    createdOn?: Date;
    updatedOn?: Date;
    role?: string;
    lastVisited?: Date;
    profile?: IUserProfile;
    tasks?: string[];
}

export interface ILoginResponse {
    authToken: string,
    user: {
        username?: string,
        email?: string,
        createdOn?: Date,
        updatedOn?: Date,
        lastVisited?: Date,
        role?: string,
        profile?: IUserProfile
    }
}

interface IUserProfile {
    firstName?: string;
    lastName?: string;
    fullName?: string;
}

export interface INewUserParams {
    username: string;
    email: string;
    password: string;
}

export interface ILoginParams {
    username?: string;
    email?: string;
    password?: string;
}

export type UserModel = Model<IUser>;
export const User: UserModel = model<IUser>('User', UserSchema) as UserModel;
