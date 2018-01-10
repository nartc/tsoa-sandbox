import { Controller, Route, Post, Body, SuccessResponse, Example, Response, Tags, Get, Request, Security } from 'tsoa';
import { ITask, Task } from '../models/Task';
import { MongoError } from 'mongodb';
import { ITaskRepository } from '../repositories/ITaskRepository';
import { TaskRepository } from '../repositories/TaskRepository';
import { INewTaskParams } from '../models/requests/index';
import { IErrorResponse, ITaskResponse } from '../models/responses/index';
import * as config from 'config';
import * as moment from 'moment';
import {Request as eRequest} from 'express';
import {IUser} from '../models/User';

@Route('tasks')
export class TaskController extends Controller {

    private static resolveErrorResponse(error: MongoError | null, message: string): IErrorResponse {
        const response: IErrorResponse = {
            thrown: true,
            error,
            message
        };

        return response;
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
}
