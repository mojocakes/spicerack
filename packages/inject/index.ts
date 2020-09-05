import { Container as InversifyContainer } from 'inversify';
import { Container } from './src/Container';

// Make the root dependency container.
const inversifyContainer = new InversifyContainer();
export const container = new Container(inversifyContainer);

export default container;
export { Container } from './src/Container';
export * from './src/helpers';
export { decorate } from 'inversify';
