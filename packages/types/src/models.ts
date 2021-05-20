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
        id: TDefaultModelProperties['id'];

        /**
         * Persists any changes to the configured storage method.
         * 
         * @returns {Promise<void>}
         */
        save(): Promise<void>;

        /**
         * Updates a one or more values.
         * 
         * @param {Partial<T>} values
         * @returns {IModel<T>}
         */
        set(values: Partial<T>): IModel<T>;
    
        /**
         * Gets the model data as an object.
         * Note! It should be possible to reconstruct the model from the data returned.
         * 
         * @returns {T}
         */
        serialize(): T;

        /**
         * (Write your own getters to access individual properties)
         */
    }

    export interface IModelCollection<T extends IModel<any>> {
        each(callback: (model: T) => any): void;
        
        filter(criteria: object): IModelCollection<T>;
    }
}
