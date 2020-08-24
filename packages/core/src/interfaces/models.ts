import { IResource } from './resources';

export interface IModel<T extends Object> {
    /**
     * Updates a single value.
     * 
     * @param {keyof T} key
     * @param {T[keyof T]} value 
     * @returns {void}
     */
    set(key: keyof T, value: T[keyof T]): void;

    /**
     * Saves any changes to this model.
     */
    save(): Promise<void>;

    /**
     * Gets the model data as an object.
     * 
     * @returns {T}
     */
    serialize(): T;
}

export interface IModelCollection<T extends IModel<any>> {
    each(callback: (model: T) => any): void;

    filter(criteria: object): IModelCollection<T>;
}

export interface IModelRepository<
    /**
     * The model type
     */
    T extends IModel<any>,
    /**
     * Available query parameters
     */
    Q extends Record<string, any>,
    /**
     * Available config parameters
     */
    C extends Record<string, any>,
> extends IResource<T, Q, C> {
    //
}
