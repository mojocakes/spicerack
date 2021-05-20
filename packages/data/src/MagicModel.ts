import { Models } from '@/types';

export type IModelConstructor<D, M = Models.IModel<any>> = {
    new(data: D): M;
}

/**
 * A simple model that holds some data.
 */
export abstract class MagicModel<T extends Models.TDefaultModelProperties> implements Models.IModel<T> {
    protected _proxy: any;

    public fillable: string[] = [];

    constructor(protected data: T) {
        // Use a proxy to handle requests for any properties
        return new Proxy(this, this.proxyHandler);
    }

    /**
     * Updates a single value.
     * 
     * @param {keyof T} key
     * @param {T[keyof T]} value 
     * @returns {Models.IModel<T>}
     */
    public set(values: Partial<T>): Models.IModel<T> {
        this.data = {
            ...this.data,
            ...values,
        };
        return this;
    }

    /**
     * Saves any changes to this model.
     */
    public async save(): Promise<void> {
        //
    }

    /**
     * Gets the model data as an object.
     * 
     * @returns {T}
     */
    public serialize(): T {
        return this.data;
    }

    public get id(): undefined | number | string {
        return this.data.id;
    }

    /**
     * Makes a proxy handler for this class.
     * This allows us to override the default behaviour whenever
     * a property on this class is accessed or updated.
     * 
     * @returns {ProxyHandler<MagicModel<T>>}
     */
    protected get proxyHandler(): ProxyHandler<MagicModel<T>> {
        return {
            get(receiver: MagicModel<T>, name: string | symbol) {
                return receiver[name] || receiver.data[name.toString()];
            },
            set(target: MagicModel<T>, property: string, value: any): boolean {
                if (target.fillable.includes(property)) {
                    (target.data as any)[property] = value;
                    return true;
                }

                target[property] = value;
                return true;
            }
        };
    }
}
