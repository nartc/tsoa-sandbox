/* tslint:disable */
import { Controller, ValidateParam, FieldErrors, ValidateError, TsoaRoute } from 'tsoa';
import { UserController } from './controllers/UserController';
import { TaskController } from './controllers/TaskController';
import * as passport from 'passport';
import { expressAuthentication } from './middleware/security/passport';

const models: TsoaRoute.Models = {
    "UserRole": {
        "enums": ["Admin", "User"],
    },
    "IUserProfile": {
        "properties": {
            "firstName": { "dataType": "string" },
            "lastName": { "dataType": "string" },
            "fullName": { "dataType": "string" },
        },
    },
    "ITaskVm": {
        "properties": {
            "_id": { "dataType": "string" },
            "title": { "dataType": "string" },
            "slug": { "dataType": "string" },
            "content": { "dataType": "string" },
            "createdOn": { "dataType": "datetime" },
            "updatedOn": { "dataType": "datetime" },
            "isCompleted": { "dataType": "boolean" },
        },
    },
    "IUserResponse": {
        "properties": {
            "_id": { "dataType": "string" },
            "username": { "dataType": "string" },
            "email": { "dataType": "string" },
            "password": { "dataType": "string" },
            "createdOn": { "dataType": "datetime" },
            "updatedOn": { "dataType": "datetime" },
            "lastVisited": { "dataType": "datetime" },
            "role": { "ref": "UserRole" },
            "profile": { "ref": "IUserProfile" },
            "tasks": { "dataType": "array", "array": { "ref": "ITaskVm" } },
        },
    },
    "IMongoError": {
        "properties": {
            "code": { "dataType": "double" },
            "message": { "dataType": "string" },
            "name": { "dataType": "string" },
            "stack": { "dataType": "string" },
        },
    },
    "IErrorResponse": {
        "properties": {
            "thrown": { "dataType": "boolean" },
            "error": { "ref": "IMongoError" },
            "message": { "dataType": "string" },
        },
    },
    "INewUserParams": {
        "properties": {
            "username": { "dataType": "string", "required": true },
            "email": { "dataType": "string", "required": true },
            "password": { "dataType": "string", "required": true },
        },
    },
    "ILoginResponse": {
        "properties": {
            "authToken": { "dataType": "string", "required": true },
            "_id": { "dataType": "string" },
            "username": { "dataType": "string" },
            "email": { "dataType": "string" },
            "createdOn": { "dataType": "datetime" },
            "updatedOn": { "dataType": "datetime" },
            "lastVisited": { "dataType": "datetime" },
            "role": { "ref": "UserRole" },
            "profile": { "ref": "IUserProfile" },
        },
    },
    "ILoginParams": {
        "properties": {
            "username": { "dataType": "string" },
            "email": { "dataType": "string" },
            "password": { "dataType": "string" },
        },
    },
    "IUserVm": {
        "properties": {
            "_id": { "dataType": "string" },
            "username": { "dataType": "string", "required": true },
            "email": { "dataType": "string", "required": true },
            "password": { "dataType": "string" },
            "createdOn": { "dataType": "datetime" },
            "updatedOn": { "dataType": "datetime" },
            "role": { "ref": "UserRole" },
            "lastVisited": { "dataType": "datetime" },
            "profile": { "ref": "IUserProfile" },
        },
    },
    "ITaskResponse": {
        "properties": {
            "_id": { "dataType": "string" },
            "title": { "dataType": "string" },
            "content": { "dataType": "string" },
            "slug": { "dataType": "string" },
            "createdOn": { "dataType": "datetime" },
            "updatedOn": { "dataType": "datetime" },
            "isCompleted": { "dataType": "boolean" },
            "user": { "ref": "IUserVm" },
        },
    },
    "INewTaskParams": {
        "properties": {
            "title": { "dataType": "string", "required": true },
            "content": { "dataType": "string", "required": true },
        },
    },
    "IUpdateTaskParams": {
        "properties": {
            "title": { "dataType": "string", "required": true },
            "content": { "dataType": "string", "required": true },
            "completed": { "dataType": "boolean", "required": true },
        },
    },
};

export function RegisterRoutes(app: any) {
    app.post('/api/users/register',
        function(request: any, response: any, next: any) {
            const args = {
                requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "INewUserParams" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new UserController();


            const promise = controller.registerUser.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.post('/api/users/login',
        function(request: any, response: any, next: any) {
            const args = {
                loginParams: { "in": "body", "name": "loginParams", "required": true, "ref": "ILoginParams" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new UserController();


            const promise = controller.login.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/users/profile',
        authenticateMiddleware('jwt'),
        function(request: any, response: any, next: any) {
            const args = {
                request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new UserController();


            const promise = controller.getCurrentUser.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/tasks',
        authenticateMiddleware('jwt'),
        function(request: any, response: any, next: any) {
            const args = {
                request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new TaskController();


            const promise = controller.getTasks.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.post('/api/tasks/create',
        authenticateMiddleware('jwt'),
        function(request: any, response: any, next: any) {
            const args = {
                requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "INewTaskParams" },
                request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new TaskController();


            const promise = controller.createTask.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/tasks/:slug',
        authenticateMiddleware('jwt'),
        function(request: any, response: any, next: any) {
            const args = {
                slug: { "in": "path", "name": "slug", "required": true, "dataType": "string" },
                request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new TaskController();


            const promise = controller.getSingleTask.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.put('/api/tasks/:slug',
        authenticateMiddleware('jwt'),
        function(request: any, response: any, next: any) {
            const args = {
                slug: { "in": "path", "name": "slug", "required": true, "dataType": "string" },
                updatedTask: { "in": "body", "name": "updatedTask", "required": true, "ref": "IUpdateTaskParams" },
                request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new TaskController();


            const promise = controller.updateTask.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.delete('/api/tasks/:slug',
        authenticateMiddleware('jwt'),
        function(request: any, response: any, next: any) {
            const args = {
                slug: { "in": "path", "name": "slug", "required": true, "dataType": "string" },
                request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new TaskController();


            const promise = controller.removeTask.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });

    function authenticateMiddleware(strategy: string) {
        return passport.authenticate(strategy, { session: false });
    }

    function promiseHandler(controllerObj: any, promise: any, response: any, next: any) {
        return Promise.resolve(promise)
            .then((data: any) => {
                let statusCode;
                if (controllerObj instanceof Controller) {
                    const controller = controllerObj as Controller
                    const headers = controller.getHeaders();
                    Object.keys(headers).forEach((name: string) => {
                        response.set(name, headers[name]);
                    });

                    statusCode = controller.getStatus();
                }

                if (data) {
                    response.status(statusCode || 200).json(data);
                } else {
                    response.status(statusCode || 204).end();
                }
            })
            .catch((error: any) => response.status(500).json(error));
    }

    function getValidatedArgs(args: any, request: any): any[] {
        const errorFields: FieldErrors = {};
        const values = Object.keys(args).map(function(key) {
            const name = args[key].name;
            switch (args[key].in) {
                case 'request':
                    return request;
                case 'query':
                    return ValidateParam(args[key], request.query[name], models, name, errorFields);
                case 'path':
                    return ValidateParam(args[key], request.params[name], models, name, errorFields);
                case 'header':
                    return ValidateParam(args[key], request.header(name), models, name, errorFields);
                case 'body':
                    return ValidateParam(args[key], request.body, models, name, errorFields);
                case 'body-prop':
                    return ValidateParam(args[key], request.body[name], models, name, errorFields);
            }
        });

        if (Object.keys(errorFields).length > 0) {
            throw new ValidateError(errorFields, '');
        }
        return values;
    }
}
