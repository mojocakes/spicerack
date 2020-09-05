import inversify from 'inversify';
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
     * Registers a service or value with the container.
     * 
     * @param {Types.Inject.TServiceIdentifier} identifier
     * @param {TInjectable} injectable
     * @returns {void}
     */
    register(identifier: Types.Inject.TServiceIdentifier, injectable: Types.Inject.TInjectable): void {
        // TODO: don't assume "inSingletonScope"
        this.container.bind(identifier).to(injectable).inSingletonScope();
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
