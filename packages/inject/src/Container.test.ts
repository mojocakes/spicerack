import { Container as InversifyContainer, inject } from 'inversify';
import { Container } from './Container';
import { registerInjectable } from '../';

// -- mocks
const inversifyContainer = new InversifyContainer();

// -- testables
const container = new Container(inversifyContainer);

describe('inject/Container', () => {
    describe('get()', () => {
        it('retrieves a dependency', () => {
            // create a mock dependency
            const mockDependencyID = Symbol('MOCK_DEPENDENCY_ID');
            class MockDependency {}
            registerInjectable(MockDependency);
            
            // register mock dependency directly with inversify
            inversifyContainer.bind(mockDependencyID).to(MockDependency).inSingletonScope();

            // resolve from our container
            const resolvedDependency = container.get(mockDependencyID);
            expect(resolvedDependency instanceof MockDependency).toBeTruthy();
        });
    });

    describe('register()', () => {
        it('registers a dependency', async () => {
            // create a mock dependency
            const mockDependencyID = Symbol('MOCK_DEPENDENCY_ID');
            class MockDependency {}
            
            // register mock dependency with our container
            registerInjectable(MockDependency);
            container.register(mockDependencyID, MockDependency);

            // resolve from our container
            const resolvedDependency = container.get(mockDependencyID);
            expect(resolvedDependency instanceof MockDependency).toBeTruthy();
        });
    });

    describe('resolve()', () => {
        it('resolves all dependencies on the provided class', () => {
            // create two mock dependencies
            const mockDependencyIDs = [Symbol('MOCK_DEPENDENCY_ID_ONE'), Symbol('MOCK_DEPENDENCY_ID_TWO')];
            const mockDependencyOneCall = jest.fn();

            class MockDependencyOne {
                call(): void {
                    mockDependencyOneCall();
                }
            }
            
            class MockDependencyTwo {
                constructor(@inject(mockDependencyIDs[0]) public dependencyOne: MockDependencyOne) {
                    // 
                }
            }

            // register mock dependencies with our container
            registerInjectable(MockDependencyOne);
            registerInjectable(MockDependencyTwo);
            container.register(mockDependencyIDs[0], MockDependencyOne);
            container.register(mockDependencyIDs[1], MockDependencyTwo);

            // resolve  from our container
            const resolvedDependency: MockDependencyTwo = container.get(mockDependencyIDs[1]);
            resolvedDependency.dependencyOne.call();
            expect(mockDependencyOneCall).toHaveBeenCalled();
        });
    });
});
