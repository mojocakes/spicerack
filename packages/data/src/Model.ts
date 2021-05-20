import { Models } from '@/types';

// export type IModelConstructor<D, M = Models.IModel<any>> = {
//     new(data: D): M;
// }

/**
 * A simple model that holds some data.
 */
export abstract class Model<T extends Models.TDefaultModelProperties> implements Models.IModel<T> {
    constructor(protected data: T) {
        //
    }

    public get id(): undefined | number | string {
        return this.data.id;
    }

    /**
     * Updates a one or more values.
     * 
     * @param {Partial<T>} values
     * @returns {IModel<T>}
     */
    public set(values: Partial<T>): Models.IModel<T> {
        Object.assign(this.data, values);
        return this;
    }

    /**
     * Saves any changes to this model.
     */
    public abstract save(): Promise<void>;

    /**
     * Gets the model data as an object.
     * 
     * @returns {T}
     */
    public serialize(): T {
        return this.data;
    }
}
