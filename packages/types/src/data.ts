import { Generic } from './generic';

export namespace Data {
    export interface IRepository<
        /**
         * The entity type this repository handles.
         */
        T = any,

        /**
         * Available query parameters.
         */
        Q extends Record<string, any> = any,
    > extends Generic.IService {
        /**
         * Deletes an entity.
         * 
         * @param {TEntityIdentifier} id 
         * @returns {Promise<void>}
         */
        delete(id: TEntityIdentifier): Promise<void>;

        /**
         * Fetches a single entity by its identitifer.
         * 
         * @param {TEntityIdentifier} id
         * @returns {Promise<null | T>}
         */
        get(id: TEntityIdentifier): Promise<null | T>;

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

    export type TEntityIdentifier = number | string;
}
