import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  mode: 'development',
  devtool: 'source-map',
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'can.js',
    library: {
      name: 'Can',
      type: 'umd',
    },
    globalObject: 'this',
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.can$/,
        use: [
          'babel-loader',
          path.resolve(__dirname, 'dist/compiler/can-loader.mjs'),
        ],
      },
    ],
  },
};