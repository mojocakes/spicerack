import * as types from '@spicerack/types';
import {
    inject as inversifyInject,
    injectable as inversifyInjectable,
} from 'inversify';

export const inject = inversifyInject as (identifier: types.Inject.TServiceIdentifier) => ((...args: any) => any);
export const injectable = inversifyInjectable;
