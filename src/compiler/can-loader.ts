import { transpile } from './codegen';
import { defaultPlugins } from '../cli/build';

/**
 * Webpack loader for .can Single File Components
 */
export default async function canLoader(this: any, source: string) {
    // Webpack loaders are often synchronous by default; 
    // calling this.async() makes it compatible with your async transpile function.
    const callback = this.async();

    try {
        const { code, map } = await transpile(source, defaultPlugins, this.resourcePath);
        callback(null, code, map);
    } catch (error) {
        callback(error as Error);
    }
}