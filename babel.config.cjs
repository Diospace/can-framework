/**
 * Root Babel Configuration
 * This file is used by external tools like Jest, ESLint, and Webpack.
 * It aligns with the framework's internal transpilation logic.
 */
module.exports = function (api) {
    // Determine target environment
    // Calling api.env() automatically configures environment-based caching.
    const env = api.env();
    const isNode = env === 'test' || process.env.BABEL_ENV === 'node';

    return {
        presets: [
            [
                '@babel/preset-env',
                {
                    targets: isNode ? { node: 'current' } : '> 0.25%, not dead'
                }
            ],
            '@babel/preset-typescript'
        ],
        sourceType: 'module',
        sourceMaps: true
    };
};