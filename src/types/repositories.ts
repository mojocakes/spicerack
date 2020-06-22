import { IModel, IModelCollection } from "../models/types";

export interface IRepository<T extends IModel<any>> {
    /**
     * Finds models.
     * 
     * @param {Object?} query 
     * @returns {Promise<IModelCollection<T>>}
     */
    find(query?: Object): Promise<IModelCollection<T>>;
}
