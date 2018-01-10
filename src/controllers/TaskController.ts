import {Request as eRequest} from 'express';
import * as moment from 'moment';
import {MongoError} from 'mongodb';
import {Body, Controller, Delete, Get, Path, Post, Put, Request, Response, Route, Security, Tags} from 'tsoa';
import {INewTaskParams, IUpdateTaskParams} from '../models/requests';
import {IErrorResponse, ITaskResponse} from '../models/responses';
import {ITask, Task} from '../models/Task';
import {IUser} from '../models/User';
import {ITaskRepository} from '../repositories/ITaskRepository';
import {TaskRepository} from '../repositories/TaskRepository';

@Route('tasks')
export class TaskController extends Controller {
    private static resolveErrorResponse(error: MongoError | null, message: string): IErrorResponse {
        return {
            thrown: true,
            error,
            message
        };
    }

    private readonly _taskRepository: ITaskRepository = new TaskRepository();

    @Response<IErrorResponse>('default', 'Error Occurred')
    @Response<ITaskResponse[]>('200', 'Success')
    @Tags('Task')
    @Security('JWT')
    @Get()
    public async getTasks(@Request() request: eRequest): Promise<ITaskResponse[]> {
        const currentUser: IUser = request.user;

        if (currentUser instanceof MongoError)
            throw TaskController.resolveErrorResponse(currentUser, 'Error getting current User');

        if (!currentUser || currentUser === null)
            throw TaskController.resolveErrorResponse(null, 'No current User');

        const result = await this._taskRepository.getTasks(currentUser._id);

        if (result instanceof MongoError)
            throw TaskController.resolveErrorResponse(result, 'Error fetching Tasks');

        return result;
    }

    @Response<IErrorResponse>('default', 'Error Occurred')
    @Response<ITaskResponse>('200', 'Success')
    @Tags('Task')
    @Security('JWT')
    @Post('create')
    public async createTask(@Body() requestBody: INewTaskParams, @Request() request: eRequest): Promise<ITaskResponse> {
        const currentUser: IUser = request.user;
        if (currentUser instanceof MongoError)
            throw TaskController.resolveErrorResponse(currentUser, 'Error getting current User');

        if (!currentUser || currentUser === null)
            throw TaskController.resolveErrorResponse(null, 'No current User');

        const newTask: ITask = new Task();
        newTask.title = requestBody.title;
        newTask.content = requestBody.content;
        newTask.slug = this.generateSlug(newTask._id, newTask.title);

        const result = await this._taskRepository.createTask(newTask);

        if (result instanceof MongoError)
            throw TaskController.resolveErrorResponse(result, 'Error creating new Task');

        currentUser.tasks.push(result._id);
        try {
            currentUser.save();
            return result;
        } catch (error) {
            throw TaskController.resolveErrorResponse(error, 'Unexpected Error occurred');
        }
    }

    @Response<IErrorResponse>('default', 'Error Occurred')
    @Response<ITaskResponse>('200', 'Success')
    @Tags('Task')
    @Security('JWT')
    @Get('{slug}')
    public async getSingleTask(@Path() slug: string, @Request() request: eRequest): Promise<ITaskResponse> {
        const currentUser: IUser = request.user;
        if (currentUser instanceof MongoError)
            throw TaskController.resolveErrorResponse(currentUser, 'Error getting current User');

        if (!currentUser || currentUser === null)
            throw TaskController.resolveErrorResponse(null, 'No current User');

        const result = await this._taskRepository.getTaskBySlug(slug);

        if (result instanceof MongoError)
            throw TaskController.resolveErrorResponse(result, 'Error fetching Task');

        return result;
    }

    @Response<IErrorResponse>('default', 'Error Occurred')
    @Response<ITaskResponse>('200', 'Success')
    @Tags('Task')
    @Security('JWT')
    @Put('{slug}')
    public async updateTask(@Path() slug: string,
                            @Body() updatedTask: IUpdateTaskParams,
                            @Request() request: eRequest): Promise<ITaskResponse> {
        const currentUser: IUser = request.user;
        if (currentUser instanceof MongoError)
            throw TaskController.resolveErrorResponse(currentUser, 'Error getting current User');

        if (!currentUser || currentUser === null)
            throw TaskController.resolveErrorResponse(null, 'No current User');

        const currentTask: ITask | MongoError = await this._taskRepository.getTaskBySlug(slug);

        if (currentTask instanceof MongoError)
            throw TaskController.resolveErrorResponse(currentTask, 'Error fetching Task');

        currentTask.title = updatedTask.title;
        currentTask.content = updatedTask.content;
        currentTask.slug = this.generateSlug(currentTask._id, updatedTask.title);

        if (updatedTask.completed) {
            currentTask.isCompleted = true;
        }

        currentTask.updatedOn = moment().toDate();
        const result = await this._taskRepository.updateTask(slug, currentTask);

        if (result instanceof MongoError)
            throw TaskController.resolveErrorResponse(result, 'Error updating Task');

        return result;
    }

    @Response<IErrorResponse>('default', 'Error Occurred')
    @Response<ITaskResponse>('200', 'Success')
    @Tags('Task')
    @Security('JWT')
    @Delete('{slug}')
    public async removeTask(@Path() slug: string,
                            @Request() request: eRequest): Promise<ITaskResponse> {
        const currentUser: IUser = request.user;
        if (currentUser instanceof MongoError)
            throw TaskController.resolveErrorResponse(currentUser, 'Error getting current User');

        if (!currentUser || currentUser === null)
            throw TaskController.resolveErrorResponse(null, 'No current User');

        const result = await this._taskRepository.deleteTask(slug);

        if (result instanceof MongoError)
            throw TaskController.resolveErrorResponse(result, 'Error removing Task');

        return result;
    }

    private generateSlug(id: string, title: string) {
        const lastEight = id.toString().slice(-8);
        return title.replace(/\s+/g, '-').toLowerCase().concat(lastEight);
    }
}
