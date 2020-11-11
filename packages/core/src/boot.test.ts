import { boot } from './boot';
import { App } from './App';
import { container, inject } from '@spicerack/inject';
import { Inject } from '@spicerack/types';
// import * as Types from '@spicerack/types';

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
        const registerDependencies = jest.fn(async (container: Inject.IContainer) => {
            container.register(MockDependency, 'MOCK_DEPENDENCY');
        });

        // create a mock app that relies on an injected dependency
        class MockApp extends App {
            constructor(@inject('MOCK_DEPENDENCY') public service: IMockDependency) {
                super();

                // call method on injected service to ensure it exists
                this.service.send();
            }
        }
        container.register(MockApp);

        await boot(MockApp, registerDependencies);
        expect(registerDependencies).toHaveBeenCalled();
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
        container.register(MockApp);
        
        await boot(MockApp);
        expect(constructorCall).toHaveBeenCalled();
    });
});
