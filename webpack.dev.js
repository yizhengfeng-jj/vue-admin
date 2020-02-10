const webpack = require('webpack');
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
      "/api2": {
        target: "https://data.jianshukeji.com",
        pathRewrite: {
          "^/api2": ""
        },
        changeOrigin: true
      },
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
          loader: "url-loader",
          options: {
            limit: 8000
          }
        }
      },
      // 将juqery, proj4定义在window上，这样第三方插件就可以直接用
      // proj4.js是从网上下载的UMD文件，es6模块化还不知道怎么做
      // 这个意思是有地方引入这个文件，就把这个文件的对象挂载到window.proj4上
      {
        test: require.resolve("./src/util/proj4.js"), 
        use: "expose-loader?proj4"
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html"
    }),
    new VueLoaderPlugin()
    // new webpack.ProvidePlugin({
    //   "window.proj4": path.resolve('./src/util/proj4.js')
    // })
  ]
};
