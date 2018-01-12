import {combineReducers} from 'redux';
import {IAppState} from '../IAppState';
import {AuthReducer} from './AuthReducer';
import {TaskReducer} from './TaskReducer';

export const RootReducer = combineReducers<IAppState>({
  authState: AuthReducer,
  taskState: TaskReducer
});
