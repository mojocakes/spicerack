require('dotenv').config();
import { iConfigClass } from '@framework/types/config';
import { injectable } from './container';

@injectable()
export class Config<iConfigShape extends Record<string, any>> implements iConfigClass<iConfigShape> {
    protected config: iConfigShape;

    constructor() {
        // TODO: put this in boot(), but extending Service throws an error?
        this.config = process.env as iConfigShape;
    }

    public get(key: keyof iConfigShape, defaultValue: any = null): iConfigShape[keyof iConfigShape] {
        if (this.config && this.config[key]) {
            return this.config[key];
        }

        return defaultValue;
    }
}
