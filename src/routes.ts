/* tslint:disable */
import { Controller, ValidateParam, FieldErrors, ValidateError, TsoaRoute } from 'tsoa';
import { UserController } from './controllers/UserController';
import * as passport from 'passport';
import { expressAuthentication } from './middleware/security/passport';

const models: TsoaRoute.Models = {
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
            "error": { "ref": "IMongoError" },
            "message": { "dataType": "string" },
        },
    },
    "IUserProfile": {
        "properties": {
            "firstName": { "dataType": "string" },
            "lastName": { "dataType": "string" },
            "fullName": { "dataType": "string" },
        },
    },
    "IUserVm": {
        "properties": {
            "username": { "dataType": "string", "required": true },
            "email": { "dataType": "string", "required": true },
            "password": { "dataType": "string" },
            "createdOn": { "dataType": "datetime" },
            "updatedOn": { "dataType": "datetime" },
            "role": { "dataType": "string" },
            "lastVisited": { "dataType": "datetime" },
            "profile": { "ref": "IUserProfile" },
            "tasks": { "dataType": "array", "array": { "dataType": "string" } },
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
            "username": { "dataType": "string" },
            "email": { "dataType": "string" },
            "createdOn": { "dataType": "datetime" },
            "updatedOn": { "dataType": "datetime" },
            "lastVisited": { "dataType": "datetime" },
            "role": { "dataType": "string" },
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
            .catch((error: any) => next(error));
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
