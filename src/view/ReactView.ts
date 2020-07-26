import * as React from 'react';
import ReactDOMServer from 'react-dom/server';

import { injectable } from '../../packages/core/container';
import { View } from "./View";

@injectable()
export class ReactView extends View {
    public async render(component: React.ReactElement): Promise<string> {
        return ReactDOMServer.renderToString(component);
    }
}
