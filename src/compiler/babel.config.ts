import { TransformOptions } from '@babel/core';

/**
 * Generates a consistent Babel configuration for the framework.
 * @param filename The name of the file being transpiled.
 * @param targetEnv The execution environment ('node' for CLI, 'browser' for components).
 */
export const getBabelConfig = (
    filename: string, 
    targetEnv: 'node' | 'browser' = 'browser'
): TransformOptions => ({
    filename,
    presets: [
        [
            '@babel/preset-env',
            { targets: targetEnv === 'node' ? { node: 'current' } : '> 0.25%, not dead' }
        ],
        '@babel/preset-typescript'
    ],
    sourceMaps: targetEnv === 'node' ? 'inline' : true,
    sourceType: 'module',
    configFile: false,
    babelrc: false
});