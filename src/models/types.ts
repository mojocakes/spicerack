export interface IModel<T> {
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
