import { Data, Models } from '@spicerack/types';
import { registerInjectable } from '@spicerack/inject';

export abstract class ModelRepository<
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
> implements Data.IRepository<T, Q> {
    /**
     * Deletes an entity.
     * 
     * @param {number | string} id 
     * @returns {Promise<void>}
     */
    public abstract delete(id: number | string): Promise<void>;

    /**
     * Fetches a single entity by its identitifer.
     * 
     * @param {number | string} id 
     * @param {C=} config
     * @returns {Promise<null | T>}
     */
    public abstract get(id: number | string, config?: C): Promise<null | T>;

    /**
     * Fetches multiple entities that match the given query.
     * TODO: This should return a collection instance
     * 
     * @param query 
     */
    public abstract query(query: Q): Promise<T[]>;

    /**
     * Saves a new or existing entity.
     * 
     * @param {T} entity
     * @returns {Promise<T>}
     */
    public abstract save(entity: T): Promise<T>;
}

registerInjectable(ModelRepository);
