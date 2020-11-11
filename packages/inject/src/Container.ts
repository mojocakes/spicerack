import inversify, {
    injectable as inversifyInjectable,
    decorate,
} from 'inversify';
import * as Types from '@spicerack/types';

export class Container implements Types.Inject.IContainer {
    constructor(protected container: inversify.interfaces.Container) {
        //
    }

    /**
     * Retrieves a service or value from the container.
     * 
     * @param {Types.Inject.TServiceIdentifier} identifier
     * @returns {T = any}
     */
    get<T = any>(identifier: Types.Inject.TServiceIdentifier): T {
        return this.container.get(identifier);
    }
    
    /**
     * @inheritdoc
     */
    register(injectable: Types.Inject.TInjectable, identifier?: Types.Inject.TServiceIdentifier): void {
        decorate(inversifyInjectable(), injectable);

        // TODO: don't assume "inSingletonScope"
        if (identifier) {
            this.container.bind(identifier).to(injectable).inSingletonScope();
        }
    }

    /**
     * Resolves a service's dependencies from the container.
     * 
     * @param {TInjectable} injectable
     * @returns {T = any}
     */
    resolve<T = any>(injectable: Types.Inject.TInjectable): T {
        return this.container.resolve(injectable);
    }
}
