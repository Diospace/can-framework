const path = require('path');

module.exports = {
  mode: 'production',
  entry: './scripts/cdn/cdn.ts',
  output: {
    path: path.resolve(__dirname, './build/cdn'),
    filename: 'can.prod.min.js',
    library: {
      name: 'Can',
      type: 'umd',
      export: 'default',
    },
    globalObject: 'self',
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  }
};