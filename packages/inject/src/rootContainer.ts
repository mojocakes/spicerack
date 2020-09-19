import { Container as InversifyContainer } from 'inversify';
import { Container } from './Container';

// Make the root dependency container and export it.
const inversifyContainer = new InversifyContainer();
const container = new Container(inversifyContainer);
export default container;
