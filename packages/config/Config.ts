require('dotenv').config();

import { Service } from '@spicerack/core/Service';
import { injectable } from '@spicerack/core/container';
import { IConfigService } from '@spicerack/core/interfaces/config';
import { TConfig } from '@spicerack/core/types/config';

@injectable()
export class Config<T = TConfig> extends Service implements IConfigService<T> {
    /**
     * The config object.
     * 
     * @var {T}
     */
    readonly config: T = (process.env as any);

    /**
     * Retrieves a single item from the config store.
     * 
     * @param {keyof T} key 
     * @param {any=} defaultValue 
     * @returns {Promise<null | T[keyof T]}
     */
    public async get(key: keyof T, defaultValue: any = null): Promise<null | T[keyof T]> {
        return this.config[key] || defaultValue;
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
