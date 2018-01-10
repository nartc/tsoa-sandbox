export interface IErrorResponse {
    thrown?: boolean,
    error?: IMongoError;
    message?: string;
}

interface IMongoError {
    code?: number;
    message?: string;
    name?: string;
    stack?: string;
}
