const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");

module.exports = {
  mode: "development",
  // The application entry point
  entry: "./src/main.js",

  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: [".vue", ".ts", ".tsx", ".js", ".css", ".scss"],
    alias: {
      react_ui: path.resolve(__dirname, "src/react_ui"),
    },
  },

  module: {
    rules: [
      {
        test: /\.vue$/,
        use: "vue-loader",
        exclude: /node_modules/,
      },

      //use babel-loader to transpile js files
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },

      {
        test: /\.(jsx|tsx)?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.ts?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        // options: {
        //   // Tell to ts-loader: if you check .vue file extension, handle it like a ts file (vue3 TS)
        //   appendTsSuffixTo: [/\.vue$/],
        // },
      },

      // CSS
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },

      // ASSETS
      // https://stackoverflow.com/a/37673142/5954864
      {
        test: /\.(eot|ttf|woff|woff2|jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              esModule: false,
            },
          },
        ],
      },
    ],
  },
  // Where to compile the bundle
  // By default the output directory is `dist`
  output: {
    path: path.join(__dirname, "../dist"),
    filename: "bundle.js",
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "../public"),
    },
    compress: true,
    port: 3000,
    watchFiles: ["../src/*.html"],
    hot: true,
  },
  plugins: [
    // make sure to include the plugin for the magic
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "..", "public", "index.html"),
      filename: "index.html",
      BASE_URL: `${process.env.API_URL || "/"}`,
    }),
  ],
};
