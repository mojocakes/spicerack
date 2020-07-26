import { IResource } from './Resource';
import { IModel } from '@/types';

export interface IRepository<T extends IModel<T>, Q> extends IResource<T, Q> {
    //
}
