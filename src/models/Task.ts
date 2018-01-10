import {MongoError} from 'mongodb';
import {Document, Model, model, Schema} from 'mongoose';
import {User} from './User';

export const TaskSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        unique: true
    },
    content: {
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
    isCompleted: {
        type: Boolean,
        default: false
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

TaskSchema.post('remove', async (error: MongoError, task: ITask) => {
    const user = await User.findById(task.user);
    user.tasks.splice(user.tasks.indexOf(task._id, 1));
    user.save();
});

export interface ITask extends Document {
    title?: string;
    slug?: string;
    content?: string;
    createdOn?: Date;
    updatedOn?: Date;
    isCompleted?: boolean;
    user?: string;
}

export interface ITaskVm {
    _id?: string;
    title?: string;
    slug?: string;
    content?: string;
    createdOn?: Date;
    updatedOn?: Date;
    isCompleted?: boolean;
}

export type TaskModel = Model<ITask>;
export const Task: TaskModel = model<ITask>('Task', TaskSchema) as TaskModel;
