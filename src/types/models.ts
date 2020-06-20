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
}
