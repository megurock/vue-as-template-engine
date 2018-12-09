var path = require('path')
var webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = (env = {}, args = {}) => {
  const MODE_DEVELOPMENT = 'development'
  const MODE_PRODUCTION = 'production'
  const mode = args.mode || MODE_DEVELOPMENT
  //
  return {
    entry: {
      components: './src/components/index.ts',
    },
    output: {
      path: path.resolve(__dirname, './dist'),
      publicPath: '/dist/',
      filename: '[name].bundle.js',
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
        },
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader'
          ]
        },
        {
          test: /\.ts$/,
          loader: 'ts-loader',
          options: { appendTsSuffixTo: [/\.vue$/] },
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/
        },
        {
          test: /\.pug$/,
          loader: 'pug-plain-loader'
        }
      ]
    },
    resolve: {
      extensions: ['.ts', '.js', '.json']
    },
    externals: {
      vue: 'Vue'
    },
    plugins: [
      new VueLoaderPlugin(),
      new MiniCssExtractPlugin({
        filename: './css/components.css'
      })
    ],
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      historyApiFallback: true,
      publicPath: 'http://localhost:8080/',
      noInfo: true,
      overlay: true,
    },
    performance: {
      hints: false
    },
    optimization: {
      minimize: (mode === MODE_PRODUCTION)
    },
    devtool: (mode === MODE_PRODUCTION) ? 'hidden-source-map' : 'eval-source-map'
  }
}

