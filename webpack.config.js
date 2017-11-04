var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './src/js/app.js',
  output: {
    path: path.resolve(__dirname, 'public/js'),
    filename: 'app.bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
	loader: 'babel-loader',
	query: {
	  presets: ['es2017']
	}
      }
    ]
  },
  stats: {
    colors: true
  },
  devtool: 'source-map'
};
