import {Request as eRequest} from 'express';
import * as moment from 'moment';
import {MongoError} from 'mongodb';
import {Body, Controller, Delete, Get, Path, Post, Put, Request, Response, Route, Security, Tags} from 'tsoa';
import {INewTaskParams, IUpdateTaskParams} from '../models/requests';
import {IErrorResponse, ITaskResponse} from '../models/responses';
import {ITask, Task} from '../models/Task';
import {IUser, User} from '../models/User';
import {ITaskRepository} from '../repositories/ITaskRepository';
import {TaskRepository} from '../repositories/TaskRepository';
import {IUserRepository} from '../repositories/IUserRepository';
import {UserRepository} from '../repositories/UserRepository';

@Route('tasks')
@Tags('Task')
export class TaskController extends Controller {
    private static resolveErrorResponse(error: MongoError | null, message: string): IErrorResponse {
        return {
            thrown: true,
            error,
            message
        };
    }

    private readonly _taskRepository: ITaskRepository = new TaskRepository(Task);
    private readonly _userRepository: IUserRepository = new UserRepository(User);

    /**
     * Get current authenticated user tasks
     *
     * @param {e.Request} request Authenticated User Payload
     * @returns {Promise<ITaskResponse[]>}
     */
    @Response<IErrorResponse>('default', 'Error Occurred')
    @Response<ITaskResponse[]>('200', 'Success')
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

        return <ITaskResponse[]>result;
    }

    /**
     * Create a new task
     *
     * @param {INewTaskParams} requestBody Parameters for a new task
     * @param {e.Request} request Authenticated User Payload
     * @returns {Promise<ITaskResponse>}
     */
    @Response<IErrorResponse>('default', 'Error Occurred')
    @Response<ITaskResponse>('200', 'Success')
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
        newTask.slug = TaskController.generateSlug(newTask._id, newTask.title);
        newTask.user = currentUser._id;
        const result = await this._taskRepository.createTask(newTask);

        if (result instanceof MongoError)
            throw TaskController.resolveErrorResponse(result, 'Error creating new Task');

        currentUser.tasks.push(result._id);
        try {
            await currentUser.save();
            return <ITaskResponse>result;
        } catch (error) {
            throw TaskController.resolveErrorResponse(error, 'Unexpected Error occurred');
        }
    }

    /**
     * Get detail of a single task
     *
     * @param {string} slug Task's slug from API route's path parameter
     * @param {e.Request} request
     * @returns {Promise<ITaskResponse>}
     */
    @Response<IErrorResponse>('default', 'Error Occurred')
    @Response<ITaskResponse>('200', 'Success')
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

        return <ITaskResponse>result;
    }

    /**
     * Update a single task
     *
     * @param {string} slug Task's slug from API route's path parameter
     * @param {IUpdateTaskParams} updatedTask Parameters to update an existed task
     * @param {e.Request} request
     * @returns {Promise<ITaskResponse>}
     */
    @Response<IErrorResponse>('default', 'Error Occurred')
    @Response<ITaskResponse>('200', 'Success')
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
        currentTask.slug = TaskController.generateSlug(currentTask._id, updatedTask.title);

        if (updatedTask.completed) {
            currentTask.isCompleted = true;
        }

        currentTask.updatedOn = moment().toDate();
        const result = await this._taskRepository.updateTask(slug, currentTask);

        if (result instanceof MongoError)
            throw TaskController.resolveErrorResponse(result, 'Error updating Task');

        return <ITaskResponse>result;
    }

    /**
     * Remove a single task
     *
     * @param {string} slug Task's slug from API's route path parameter
     * @param {e.Request} request
     * @returns {Promise<ITaskResponse>}
     */
    @Response<IErrorResponse>('default', 'Error Occurred')
    @Response<ITaskResponse>('200', 'Success')
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

        currentUser.tasks.splice(currentUser.tasks.indexOf(result._id), 1);
        await this._userRepository.updateUser(currentUser._id, currentUser);
        return <ITaskResponse>result;
    }

    private static generateSlug(id: string, title: string) {
        const lastEight = id.toString().slice(-8);
        return title.replace(/\s+/g, '-').toLowerCase().concat(`-${lastEight}`);
    }
}
