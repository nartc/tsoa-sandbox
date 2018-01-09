import { MongoError } from 'mongodb';

export interface IErrorResponse {
  error?: IMongoError;
  message?: string;
}

interface IMongoError {
  code?: number;
  message?: string;
  name?: string;
  stack?: string;
}
