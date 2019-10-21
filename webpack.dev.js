const HtmlWebpackPlugin = require("html-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "bundle.js"
  },
  devServer: {
    port: 9000,
    proxy: {
      "/api": {
        target: "http://localhost:8000"
      }
    }
  },
  devtool: "source-map",
  resolve: {
    alias: {
      vue: "vue/dist/vue",
      "@": path.resolve("src"),
      Components: path.resolve("src/components")
    },
    extensions: [".js", ".vue"]
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"]
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
        use: "file-loader"
      },
      {
        test: /\.(jpg|jpeg|gif|png)/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8000
          }
        }
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
