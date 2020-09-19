import { boot } from './boot';
import { App } from './App';
import { inject, registerInjectable } from '@spicerack/inject';
import * as Types from '@spicerack/types';

// -- mocks
const mockMethodCall = jest.fn();
interface IMockDependency {
    send: () => any;
}
class MockDependency implements IMockDependency {
    send = mockMethodCall;
}

describe('core/boot', () => {
    it('resolves app dependencies', async () => {
        // create a mock app that relies on an injected dependency
        class MockApp extends App {
            public static registerDependencies = jest.fn(async (container: Types.Inject.IContainer) => {
                registerInjectable(MockDependency);
                container.register('MOCK_DEPENDENCY', MockDependency);
            });

            constructor(@inject('MOCK_DEPENDENCY') public service: IMockDependency) {
                super();

                // call method on injected service to ensure it exists
                this.service.send();
            }
        }
        registerInjectable(MockApp);

        await boot(MockApp);
        expect(MockApp.registerDependencies).toHaveBeenCalled();
        expect(mockMethodCall).toHaveBeenCalled();
    });

    it('makes a new instance of the app', async () => {
        const constructorCall = jest.fn();
        class MockApp extends App {
            constructor() {
                super();
                constructorCall();
            }
        }
        registerInjectable(MockApp);
        
        await boot(MockApp);
        expect(constructorCall).toHaveBeenCalled();
    });
});
