// "make" method is supposed to be static but it doesn't work
export namespace Generic {
    export interface IFactory<T extends Object> {
        /**
         * Makes a new instance of the class.
         * 
         * @returns {T}
         */
        make(): T;

        /**
         * Overwrites properties of the returned class.
         * 
         * @param {Object?} data 
         * @returns {IFactory<T>}
         */
        set(data?: Object): IFactory<T>;
    }

    export interface IService {
        /**
         * Resolves when the service can be utilised.
         * 
         * @var {Promise<any>}
         */
        readonly ready: Promise<any>;
    }

    export interface INewable<TInstance, TArgs extends Array<any> = any[]> {
        new(...args: TArgs): TInstance
    }
}
