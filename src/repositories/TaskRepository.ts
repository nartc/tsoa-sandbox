import {ITask, TaskModel} from '../models/Task';
import {ITaskRepository} from './ITaskRepository';

export class TaskRepository implements ITaskRepository {
    private _taskModel: TaskModel;

    constructor(taskModel: TaskModel) {
        this._taskModel = taskModel;
    }

    public async getTasks(userId: string): Promise<ITask[]> {
        const query = {user: userId};
        return await this._taskModel
            .find(query)
            .populate('user');
    }

    public async getTaskBySlug(slug: string): Promise<ITask> {
        const query = {slug};
        return await this._taskModel
            .findOne(query)
            .populate('user');
    }

    public async createTask(newTask: ITask): Promise<ITask> {
        return await this._taskModel.create(newTask);
    }

    public async updateTask(slug: string, updatedTask: ITask): Promise<ITask> {
        const query = {slug};
        return await this._taskModel.findOneAndUpdate(query, updatedTask, {new: true});
    }

    public async deleteTask(slug: string): Promise<ITask> {
        const query = {slug};
        return await this._taskModel.findOneAndRemove(query);
    }
}
