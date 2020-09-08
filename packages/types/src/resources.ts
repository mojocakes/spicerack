import { Models } from './models';

export namespace Resources {
    export interface IResource<
        /**
         * The model type
         */
        T extends Models.IModel<any>,
        /**
         * Available query parameters
         */
        Q extends Record<string, any>,
        /**
         * Available config parameters
         */
        C extends Record<string, any>,
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
         * @param {C=} config
         * @returns {Promise<null | T>}
         */
        get(id: Models.TModelIdentifier, config?: C): Promise<null | T>;

        /**
         * Fetches multiple entities that match the given query.
         * TODO: This should return a collection instance
         * 
         * @param query 
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
        Q extends Object = {},
        C extends Object = {}
    > extends IResource<T, Q, C> {
        /**
         * Streams all entities found for the given query.
         * 
         * @param {Q=} query 
         * @param {Partial<C>=} config
         * @returns {AsyncIterable<T>}
         * 
         * @example
         * for await (let entity of resource.stream(query)) {
         *     console.log(entity);
         * }
         */
        stream(query?: Q, config?: Partial<C>,): AsyncIterable<T>;
    }
}
