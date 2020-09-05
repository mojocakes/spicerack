export namespace Config {
    export type TConfig = Record<string, any>;
    
    export interface IConfig<
        T extends Record<string, any> = TConfig
    > {
        /**
         * Retrieves all config values.
         * 
         * @returns {Promise<T>}
         */
        all(): Promise<T>;

        /**
         * Retrieves a single item from the config store.
         * 
         * @param {keyof T} key 
         * @param {any=} defaultValue 
         * @returns {Promise<null | T[keyof T]}
         */
        get(key: keyof T, defaultValue?: any): Promise<null | T[keyof T]>;
    
        /**
         * Adds or updates a single config value.
         * 
         * @param {keyof T} key 
         * @param {any} value 
         * @returns {Promise<void>}
         */
        set(key: keyof T, value: any): Promise<void>;
    }
}
