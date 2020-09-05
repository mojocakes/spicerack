export namespace Utilities {
    export interface IClassFactory<T> {
        /**
         * Makes a new class.
         * 
         * @param {...any[]} args
         * @returns {T}
         */
        make(...args: any[]): T;
    }
}
