export namespace Models {
    export type TModel<T> = IModel<T> & T;

    export type TDefaultModelProperties = {
        id?: number | string;
    }

    export type TModelData<T> = TDefaultModelProperties & T;

    export type TModelIdentifier =
        | string
        | number
    ;
    export interface IModel<T extends TDefaultModelProperties> {
        /**
         * Model data.
         * 
         * @var {T}
         */
        // readonly data: T;

        /**
         * Updates a one or more values.
         * 
         * @param {Partial<T>} values
         * @returns {IModel<T>}
         */
        set(values: Partial<T>): IModel<T>;
    
        /**
         * Persists any changes to the configured storage method.
         */
        save(): Promise<void>;
    
        /**
         * Gets the model data as an object.
         * Note! It should be possible to reconstruct the model from the data returned.
         * 
         * @returns {T}
         */
        serialize(): T;
    }

    export interface IModelCollection<T extends IModel<any>> {
        each(callback: (model: T) => any): void;
        
        filter(criteria: object): IModelCollection<T>;
    }
}
