import {ITask} from '../models/Task';

export interface ITaskRepository {
    getTasks(userId: string);
    getTaskBySlug(slug: string);
    createTask(newTask: ITask);
    updateTask(slug: string, updatedTask: ITask);
    deleteTask(slug: string);
}
