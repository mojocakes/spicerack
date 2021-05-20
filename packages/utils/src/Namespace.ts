import { Utils } from '@/types';

export class Namespace implements Utils.INamespace {
    constructor(public value: string) {
        //
    }

    append(value: string): Utils.INamespace {
        return new Namespace(`${this.value}/${value}`);
    }
}
