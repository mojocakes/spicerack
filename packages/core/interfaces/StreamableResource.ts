import { IResource } from './Resource';
import { IModel } from '@/types';

export interface IStreamableResource<
    T extends IModel<T>,
    Q extends Object = {},
    C extends Object = {}
> extends IResource<T, Q> {
    /**
     * Streams all entities found for the given query.
     * 
     * @param {Q} query 
     * @param {Partial<IApiRequestConfig>=} config
     * @returns {AsyncIterable<T>}
     * 
     * @example
     * for await (let entity of resource.stream(query)) {
     *     console.log(entity);
     * }
     */
    stream(query?: Q, config?: C): AsyncIterable<T>;
}
