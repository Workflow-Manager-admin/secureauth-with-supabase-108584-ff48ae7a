const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, '../src/index.js'),
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'bundle.js',
    publicPath: '/',
    clean: true,
  },
  mode: 'development',
  devtool: 'cheap-module-source-map',
  devServer: {
    static: {
      directory: path.resolve(__dirname, '../public'),
    },
    historyApiFallback: true,
    hot: true,
    compress: true,
    port: 3000,
    host: '0.0.0.0',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      // Babel loader for .js and .jsx
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            // Make sure both presets are included, particularly preset-react
            presets: [
              '@babel/preset-env',
              '@babel/preset-react'
            ],
            // You can also have plugins from package.json if needed
          },
        },
      },
      // Styles: CSS loader and style-loader
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      // Asset/resource (e.g. images, fonts)
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff2?)$/,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    // Only add HtmlWebpackPlugin if it exists
    (() => {
      try {
        const HtmlWebpackPlugin = require('html-webpack-plugin');
        return new HtmlWebpackPlugin({
          template: path.resolve(__dirname, '../public/index.html'),
          filename: 'index.html',
          inject: true,
        });
      } catch (err) {
        return undefined;
      }
    })(),
  ].filter(Boolean),
};
