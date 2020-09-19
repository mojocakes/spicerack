import { Models } from './models';
import { Requests } from './requests';

export namespace Resources {
    export interface IResource<
        /**
         * The model type this resource handles.
         */
        T extends Models.IModel<any>,

        /**
         * Available query parameters.
         */
        Q extends Record<string, any>,
    > {
        /**
         * Deletes an entity.
         * 
         * @param {TModelIdentifier} id 
         * @returns {Promise<void>}
         */
        delete(id: Models.TModelIdentifier): Promise<void>;

        /**
         * Fetches a single entity by its identitifer.
         * 
         * @param {TModelIdentifier} id
         * @returns {Promise<null | T>}
         */
        get(id: Models.TModelIdentifier): Promise<null | T>;

        /**
         * Fetches multiple entities that match the given query.
         * TODO: This should return a collection instance
         * 
         * @param query
         * @returns {Promise<null[] | T[]>}
         */
        query(query: Q): Promise<null[] | T[]>;

        /**
         * Saves a new or existing entity.
         * 
         * @param {T} entity
         * @returns {Promise<T>}
         */
        save(entity: T): Promise<T>;
    }

    export interface IStreamableResource<
        T extends Models.IModel<any>,
        Q extends Record<string, any> = {},
        RC extends Record<string, any> = Requests.TApiRequestConfig,
    > extends IResource<T, Q> {
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
