import { IModel } from '@/types/models';

export interface IResource<T extends IModel<T>, Q extends Object, C extends Object = {}> {
    /**
     * Deletes an entity.
     * 
     * @param {number | string} id 
     * @returns {Promise<void>}
     */
    delete(id: number | string): Promise<void>;

    /**
     * Fetches a single entity by its identitifer.
     * 
     * @param {number | string} id 
     * @param {C=} config
     * @returns {Promise<T>}
     */
    get(id: number | string, config?: C): Promise<T>;

    /**
     * Fetches multiple entities that match the given query.
     * TODO: This should return a collection instance
     * 
     * @param query 
     */
    query(query: Q): Promise<T[]>;

    /**
     * Saves a new or existing entity.
     * 
     * @param {T} entity
     * @returns {Promise<T>}
     */
    save(entity: T): Promise<T>;
}
