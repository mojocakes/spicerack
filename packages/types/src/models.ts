export namespace Models {
    export interface IModel<T extends Object> {
        /**
         * Model data.
         * 
         * @var {T}
         */
        readonly data: T;

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

    export type TModel<T> = IModel<T> & T;
    
    export interface IModelCollection<T extends IModel<any>> {
        each(callback: (model: T) => any): void;
    
        filter(criteria: object): IModelCollection<T>;
    }

    export type TDefaultModelProperties = {
        id?: number | string;
    }

    export type TModelData<T> = TDefaultModelProperties & T;

    export type TModelIdentifier =
        | string
        | number
    ;
}
