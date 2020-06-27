const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // 开启css提取
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin"); // 提取的css代码压缩
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin"); // 清除dist目录  clean-webpack-plugin最新更改必须是解构f
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const path = require("path");

const speed = new SpeedMeasurePlugin();

module.exports = speed.wrap({
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),

    // 解决报错
    // Cannot use [chunkhash] or [contenthash] for chunk in '[name].[chunkhash].js' (use [hash] instead)
    filename: `bundle-[hash].js`
  },
  devServer: {
    stats: "errors-only", // 打包时候的日志优化,配合下面的插件使用
    port: 9000,
    hotOnly: true, // 因为是vue项目，有了vue-loader之后，只需要设置hotOnly就能热
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
        use: "babel-loader",
        exclude: /node_modules/
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
    new OptimizeCssAssetsWebpackPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require("cssnano")
    }),

    new HtmlWebpackPlugin({
      template: "index.html",
      minify: {
        removeComments: true,
        minifyCSS: true,
        minifyJS: true,
        collapseWhitespace: true
      }
    }),
    new CleanWebpackPlugin(),
    new VueLoaderPlugin(),

    // scope hoisting减少webpack打包后的包裹
    new webpack.optimize.ModuleConcatenationPlugin(),
    new FriendlyErrorsWebpackPlugin(), // webpack打包日志优化
    new BundleAnalyzerPlugin() // 打包体积插件
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
        vander: {
          test: /[\\/]node_modules[\\/]/,
          name: "vue-vander",
          chunks: "all",
          priority: -10
        },
        common: {
          name: "common",
          chunks: "all",
          minChunks: 2,
          priority: -20
        }
      }
    }
  }
});
