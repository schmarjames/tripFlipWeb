var path = require('path');
module.exports = {
  devtool: 'eval-source-map',
  entry: {
    bundle: [
      'bootstrap-loader',
      './resources/assets/js/main.js',
    ]
  },
  output: {
    filename: './public/dist/js/[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|vendor|bower_components)/,
        loader: 'babel-loader'
      },
      {
        test: /\.scss$/,
        include: path.join(__dirname, 'resources/assets/sass'),
        loader: 'style!css!sass'
      },
      // Bootstrap 3
      { test:/bootstrap-sass[\/\\]assets[\/\\]javascripts[\/\\]/, loader: 'imports?jQuery=jquery' },
      { test: /\.(woff2?|svg)$/, loader: 'url?limit=10000' },
      { test: /\.(ttf|eot)$/, loader: 'file' },
      {
        test: /masonry|imagesloaded|fizzy\-ui\-utils|desandro\-|outlayer|get\-size|doc\-ready|eventie|eventemitter/,
        loader: 'imports?define=>false&this=>window'
      }
    ]
  }
}
