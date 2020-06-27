const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const optimizeCssAssetsWebpakPlugin = require("optimize-css-assets-webpack-plugin");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin"); // clean-webpack-plugin最新更改必须是解构f
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const path = require("path");

const speed = new SpeedMeasurePlugin();
module.exports = speed.wrap({
  mode: "production",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),

    // 解决报错
    // Cannot use [chunkhash] or [contenthash] for chunk in '[name].[chunkhash].js' (use [hash] instead)
    filename: "bundle-[contenthash].js"
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
    new FriendlyErrorsWebpackPlugin(), // webpakck打包日志优化
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
    new VueLoaderPlugin(),
    new BundleAnalyzerPlugin()
    // new webpack.HotModuleReplacementPlugin() // 热跟新
    // new webpack.ProvidePlugin({
    //   "window.proj4": path.resolve('./src/util/proj4.js')
    // })
  ],

  // 提取公共函数和分离模块,为了让第三方的模块走缓存
  // 这里有一个问题如果走cdn打包会更快一点
  optimization: {
    splitChunks: {
      minSize: 0,
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vue-vander",
          chunks: "all"
        }
      }
    }
  },
  stats: "errors-only" // 打包时候的日志优化,配合下面的插件使用
});
