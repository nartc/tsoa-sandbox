export * from './auth.service';
import { AuthService } from './auth.service';
export * from './task.service';
import { TaskService } from './task.service';
export const APIS = [AuthService, TaskService];
