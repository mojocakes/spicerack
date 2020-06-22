import { IRepository } from "./types/repositories";
import { IModel, IModelCollection } from "./types";

export abstract class Repository<T extends IModel<any>> implements IRepository<T> {
    /**
     * Finds models.
     * 
     * @param {Object?} query 
     * @returns {Promise<IModelCollection<T>>}
     */
    abstract find(query?: Object): Promise<IModelCollection<T>>;
}