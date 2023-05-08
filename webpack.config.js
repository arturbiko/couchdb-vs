const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = () => {

  return {
    mode: isDevelopment ? 'development' : 'production',
    entry: './src/extension.ts',
    target: 'node',
    externals: {
      vscode: 'commonjs vscode'
    },
    output: {
      filename: 'extension.js',
      path: path.resolve(__dirname, 'dist'),
      libraryTarget: "commonjs2",
      devtoolModuleFilenameTemplate: "../[resource-path]"
    },
    devtool: isDevelopment ? 'inline-source-map' : false,
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.png$/,
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'resources',
          },
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
      mainFields: ['module', 'main']
    },
    plugins: [
      new CleanWebpackPlugin(),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'resources',
            to: 'resources',
          },
        ],
      }),
    ],
    infrastructureLogging: {
      level: 'log',
    },
  }
};
