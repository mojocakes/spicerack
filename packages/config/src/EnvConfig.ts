// # vendor
const dotenv = require('dotenv');
// # framework
import { Config } from '@/types';
import { Service } from '@/core';

/**
 * Loads config values from a .env file
 */
export class EnvConfig<T = Config.TConfig> extends Service implements Config.IConfig<T> {
    public ready = Promise.resolve();

    private config: T;

    public constructor(path?: string) {
        super();

        dotenv.config({ path });
        this.config = (process.env as any);
    }

    /**
     * Retrieves all config values.
     * 
     * @returns {Promise<T>}
     */
    public async all(): Promise<T> {
        return this.config;
    }

    /**
     * Retrieves a single item from the config store.
     * 
     * @param {keyof T} key 
     * @param {any=null} defaultValue 
     * @returns {Promise<null | T[keyof T]}
     */
    public async get(key: keyof T, defaultValue: any = null): Promise<null | T[keyof T]> {
        if (!this.config[key]) {
            return defaultValue;
        }

        return this.config[key];
    }

    /**
     * Adds or updates a single config value.
     * 
     * @param {keyof T} key 
     * @param {any} value 
     * @returns {Promise<void>}
     */
    public async set(key: keyof T, value: any): Promise<void> {
        this.config[key] = value;
    }
}
