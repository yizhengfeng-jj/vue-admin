const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const optimizeCssAssetsWebpakPlugin = require("optimize-css-assets-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin"); // clean-webpack-plugin最新更改必须是解构f
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js"
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
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "less-loader",
          {
            loader: "postcss-loader",
            options: {
              plugins: () => [require("autoprefixer")()] // 必须指定bowserslist才会生效，我是在package.json里面指定的
            }
          }
        ]
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
    new MiniCssExtractPlugin({
      filename: "vue.css"
    }),
    new optimizeCssAssetsWebpakPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require("cssnano")
    }),
    new HtmlWebpackPlugin({
      template: "index.html",
      minify: {
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
        removeComments: true
      }
    }),
    new CleanWebpackPlugin(),
    new VueLoaderPlugin()
    // new webpack.HotModuleReplacementPlugin() // 热跟新
    // new webpack.ProvidePlugin({
    //   "window.proj4": path.resolve('./src/util/proj4.js')
    // })
  ]
};
