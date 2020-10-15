import { Models } from './models';
import { Data } from './data';

export namespace Resources {
    export interface IStreamableResource<
        T extends Models.IModel<any>,
        Q extends Record<string, any> = {},
    > extends Data.IRepository<T, Q> {
        /**
         * Streams all entities found for the given query.
         * 
         * @param {Q} query
         * @returns {AsyncIterable<T>}
         * 
         * @example
         * for await (let entity of resource.stream(query)) {
         *     console.log(entity);
         * }
         */
        stream(query: Q): AsyncIterable<T>;
    }
}
