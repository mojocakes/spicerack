/**
 * Using inversify as our container.
 * 
 * @see https://github.com/inversify/InversifyJS
 */
import { Container } from "inversify";
export * from "inversify";

enum IInjectToken {
    router = 'router',
}
export function injectToken<T extends IInjectToken = IInjectToken>(name: keyof T): string {
    return `framework__${name}`;
};

export default new Container();
