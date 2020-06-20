import { IModel } from './types';

export class Model<T extends Object> implements IModel<T> {
    protected _proxy: any;

    constructor(protected data: Partial<T>) {
        // bind methods
        this.dataProxyHandler = this.dataProxyHandler.bind(this);
        
        this._proxy = new Proxy(this.data, this.dataProxyHandler());
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

    protected dataProxyHandler(): ProxyHandler<T> {
        const _this = this;

        return {
            get(receiver, name) {
                return receiver[name] || _this[name];
            }
        };
    }
}
