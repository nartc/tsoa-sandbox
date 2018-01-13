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
    tasks: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Task'
        }
    ]
});

export interface IUser extends Document {
    username: string;
    email: string;
    password?: string;
    createdOn?: Date;
    updatedOn?: Date;
    role?: UserRole;
    lastVisited?: Date;
    profile?: IUserProfile;
    tasks?: string[];
}

// export type UserRole = 'Admin' | 'User';
// export const UserRole = {
//     Admin: 'Admin' as UserRole,
//     User: 'User' as UserRole
// };

export enum UserRole {
    Admin = 'Admin' as any,
    User = 'User' as any
}

export interface IUserVm {
    _id?: string;
    username: string;
    email: string;
    password?: string;
    createdOn?: Date;
    updatedOn?: Date;
    role?: UserRole;
    lastVisited?: Date;
    profile?: IUserProfile;
}

export interface IUserProfile {
    firstName?: string;
    lastName?: string;
    fullName?: string;
}

export type UserModel = Model<IUser>;
export const User: UserModel = model<IUser>('User', UserSchema) as UserModel;
