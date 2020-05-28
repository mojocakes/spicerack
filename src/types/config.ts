export interface iConfigClass<iConfigShape extends Record<string, any>> {
    get(key: keyof iConfigShape, defaultValue?: any): iConfigShape[keyof iConfigShape];
}
