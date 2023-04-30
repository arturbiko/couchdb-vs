const path = require('path');

module.exports = {
  mode: 'production',
  target: 'node',
  externals: {
    vscode: 'commonjs vscode'
  },
  entry: './src/extension.ts',
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  output: {
    filename: 'extension.js',
    path: path.resolve(__dirname, 'out')
  }
};
