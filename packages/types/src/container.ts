// TODO: write our own types for this.
// We shouldn't have to import inversify just to use their types,
// since we want to make more generic interfaces.
// 
// This will probably require mapping inversify to our own interface...
import { Container } from "inversify";

export type IDependencyContainer = Container;
