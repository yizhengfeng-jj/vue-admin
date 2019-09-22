const HtmlWebpackPlugin = require("html-webpack-plugin");
const VueLoaderPlugin = require('vue-loader/lib/plugin');
module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "bundle.js"
  },
  devServer: {
    port: 9000,
    proxy: {
        '/api': {
            target: 'http://localhost:8000'
        }
    }
  },
  devtool: "source-map",
  resolve: {
    alias: {
      vue: "vue/dist/vue"
    }
  },
  module: {
    rules: [
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        },
      {
        test: /\.js$/,
        use: "babel-loader"
      },
      {
        test: /\.vue$/,
        use: "vue-loader"
      },
      {
          test: /\.(woff|ttf|eot)$/,
          use: 'file-loader'
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html"
    }),
    new VueLoaderPlugin()
  ]
};
