import { Generic } from '@/types';
import {
    container,
    inject,
    injectable,
    // make,
} from './Botox';

type TService = {
    name: string;
};

describe('Botox', () => {
    describe('injectable/inject', () => {
        it('should inject undeclared constructor arguments', () => {
            @injectable()
            class Service {
                constructor(
                    @inject('A') public serviceA: TService,
                    @inject('B') public serviceB?: TService,
                ) {}
            }

            const serviceA = class { name: 'Service A' };
            const serviceB = class { name: 'Service B' };
            container.register('B', serviceB);

            const example = new Service(new serviceA());
            expect(example.serviceA).toBeInstanceOf(serviceA);
            expect(example.serviceB).toBeInstanceOf(serviceB);
        });

        it('should allow injected constructor arguments to be overridden', () => {
            @injectable()
            class Service {
                constructor(
                    @inject('A') public serviceA: TService,
                    @inject('B') public serviceB?: TService,
                ) {}
            }

            const serviceA = class { name: 'Service A' };
            const serviceC = class { name: 'Service C' };

            const example = new Service(serviceA, serviceC);
            expect(example.serviceA).toBe(serviceA);
            expect(example.serviceB).toBe(serviceC);
        });

        it('should allow classes to be injected unconstructed', () => {
            class Service1 {
                name: 'Service 1';
            }
            container.register('Service1', Service1, { construct: false });

            @injectable()
            class Service2 {
                constructor(@inject('Service1') public service1?: Service1) {}
            }


            const example = new Service2();
            expect(example.service1).toEqual(Service1);
        });
    });

    describe('make', () => {
        it('should resolve dependencies and return a class instance', () => {
            @injectable()
            class Dependency1 {}

            @injectable()
            class Dependency2 {
                constructor(
                    @inject('1') public dependency1?: Generic.TConstructor<Dependency1>,
                ) {}
            }

            @injectable()
            class Service {
                constructor(
                    @inject('2') public dependency2?: Dependency2,
                ) {}
            }

            container.register('1', Dependency1);
            container.register('2', Dependency2);

            const service = new Service();
            expect(service.dependency2).toBeInstanceOf(Dependency2);
            expect(service.dependency2?.dependency1).toBeInstanceOf(Dependency1);
        });
    });
});