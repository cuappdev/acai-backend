const fs = require('fs');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const CreateFileWebpack = require('create-file-webpack')

const flowTypeExport = {
  path: './build',
  fileName: 'bundle.js.flow',
  content: '// @flow\nexport * from \'../src\';'
}

const config = {
  target: 'node',
  context: __dirname,
  externals: [nodeExternals()],
  devtool: 'source-map',
  entry: [path.resolve(__dirname, 'src/index.js')],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    library: 'appdev',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new CreateFileWebpack(flowTypeExport)
  ]
};

module.exports = config;
