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
      //{test: /\.less$/, loader: 'style-loader!css-loader!less-loader'},
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff&name=/[name]-[hash].[ext]" },
      { test: /\.(ttf|eot|svg|gif)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      {
        test: /masonry|imagesloaded|fizzy\-ui\-utils|desandro\-|outlayer|get\-size|doc\-ready|eventie|eventemitter/,
        loader: 'imports?define=>false&this=>window'
      }
    ]
  }
}
