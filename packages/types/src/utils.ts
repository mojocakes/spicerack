export namespace Utils {
    export interface IClassFactory<T> {
        /**
         * Makes a new class.
         * 
         * @param {...any[]} args
         * @returns {T}
         */
        make(...args: any[]): T;
    }

    export interface INamespace {
        append(value: string): INamespace;
        value: string;
    }
}
