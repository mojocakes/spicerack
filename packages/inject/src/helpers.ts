import * as Types from '@spicerack/types';
import {
    inject as inversifyInject,
    optional as inversifyOptional,
    injectable as inversifyInjectable,
    decorate,
} from 'inversify';
import rootContainer from './rootContainer';

// inversify decorator function that injects a service into a class constructor argument
export const inject = inversifyInject as (identifier: Types.Inject.TServiceIdentifier) => ((...args: any) => any);
// inversify decorator function that registers a class with the container
// export const injectable = inversifyInjectable;

export const optional = inversifyOptional;

/**
 * Decorates a class allowing inversify to inject constuctor dependencies,
 * and optionally registers it with the constructor as a retrievable service.
 * 
 * @param {inversify.Interfaces.Newable<any>} constructor 
 * @param {Types.Inject.TServiceIdentifier=} identifier
 * @returns {void}
 */
export const registerInjectable = (constructor: any, identifier?: Types.Inject.TServiceIdentifier): void => {
    decorate(inversifyInjectable(), constructor);

    if (identifier) {
        rootContainer.register(identifier, constructor);
    }
}
