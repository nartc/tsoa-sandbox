import {MongoError} from 'mongodb';
import {model} from 'mongoose';
import {ITask, TaskModel, TaskSchema} from '../models/Task';
import {ITaskRepository} from './ITaskRepository';

export class TaskRepository implements ITaskRepository {
    private _taskRepository: TaskModel;

    constructor() {
        this._taskRepository = model<ITask>('Task', TaskSchema) as TaskModel;
    }

    public async getTasks(userId: string): Promise<ITask[] | MongoError> {
        const query = {user: userId};
        return await this._taskRepository
            .find(query)
            .populate('user');
    }

    public async getTaskBySlug(slug: string): Promise<ITask | MongoError> {
        const query = {slug};
        return await this._taskRepository
            .findOne(query)
            .populate('user');
    }

    public async createTask(newTask: ITask): Promise<ITask | MongoError> {
        return await this._taskRepository.create(newTask);
    }

    public async updateTask(slug: string, updatedTask: ITask): Promise<ITask | MongoError> {
        const query = {slug};
        return await this._taskRepository.findOneAndUpdate(query, updatedTask, {new: true});
    }

    public async deleteTask(slug: string): Promise<ITask | MongoError> {
        const query = {slug};
        return await this._taskRepository.findOneAndRemove(query);
    }
}
