const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin }  = require('clean-webpack-plugin');

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  entry: './src/extension.ts',
  target: 'node',
  externals: {
    vscode: 'commonjs vscode'
  },
  output: {
    filename: 'extension.js',
    path: path.resolve(__dirname, 'out'),
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
        test: /\.svg$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'resources',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
        "@": path.resolve(__dirname, "src"),
        "@provider": path.resolve(__dirname, "src/provider"),
        "@service": path.resolve(__dirname, "src/service")
    }
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
};
