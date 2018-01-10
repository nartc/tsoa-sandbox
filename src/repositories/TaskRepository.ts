import { ITaskRepository } from './ITaskRepository';
import { TaskModel, ITask, TaskSchema } from '../models/Task';
import { model } from 'mongoose';
import {MongoError} from 'mongodb';

export class TaskRepository implements ITaskRepository {
    private _taskRepository: TaskModel;

    constructor() {
        this._taskRepository = model<ITask>('Task', TaskSchema) as TaskModel;
    }

    public async getTasks(userId: string): Promise<ITask[] | MongoError> {
        const query = { user: userId };
        const result = await this._taskRepository
            .find(query)
            .populate('user');

        return result;
    }

    public async getTaskBySlug(slug: string): Promise<ITask | MongoError> {
        const query = { slug };
        const result = await this._taskRepository
            .findOne(query)
            .populate('user')
        
        return result;
    }

    public async createTask(newTask: ITask): Promise<ITask | MongoError> {
        const result = await this._taskRepository.create(newTask);
        return result;
    }

    public async updateTask(slug: string, updatedTask: ITask): Promise<ITask | MongoError> {
        const query = { slug };
        const result = await this._taskRepository.findOneAndUpdate(query, updatedTask, {new: true});
        return result;
    }

    public async deleteTask(slug: string): Promise<ITask | MongoError> {
        const query = { slug };
        const result = await this._taskRepository.findOneAndRemove(query);
        return result;
    }
}
