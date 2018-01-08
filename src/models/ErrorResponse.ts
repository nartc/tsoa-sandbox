import { MongoError } from 'mongodb';

export interface IErrorResponse {
  error?: MongoError;
  message?: string;
}
