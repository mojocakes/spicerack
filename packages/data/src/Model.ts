import { IModel } from '@spicerack/core/interfaces/models';

export type IModelConstructor<D, M = IModel<any>> = {
    new(data: D): M;
}

/**
 * A simple model that holds some data.
 */
export abstract class Model<T extends Record<string, any>> implements IModel<T> {
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
     * @returns {void}
     */
    public set(key: keyof T, value: T[keyof T]): void {
        this.data[key] = value;
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

    /**
     * Makes a proxy handler for this class.
     * This allows us to override the default behaviour whenever
     * a property on this class is accessed or updated.
     * 
     * @returns {ProxyHandler<Model<T>>}
     */
    protected get proxyHandler(): ProxyHandler<Model<T>> {
        return {
            get(receiver: Model<T>, name: string | number) {
                return receiver[name] || receiver.data[name];
            },
            set(target: Model<T>, property: string, value: any): boolean {
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

/**
 * Helper function that constructors a new model for you.
 * It sets the return type as Model & Data, removing the need for you to
 * define default properties on your model.
 * 
 * It's not recommended that you use this, but it might come in handy in certain scenarios.
 * 
 * @param {D} data 
 * @param {IModelConstructor<M, D>} ModelConstructor 
 * @returns {M & D}
 */
export function modelFactory<D, M extends IModel<D> = IModel<D>>(
    data: D,
    ModelConstructor?: IModelConstructor<D, M>
): M & D {
    return new (ModelConstructor || Model)(data) as M & D;
}
