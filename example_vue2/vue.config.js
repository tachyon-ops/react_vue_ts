const path = require('path');

module.exports = {
  productionSourceMap: false,
  runtimeCompiler: true,
  configureWebpack: {
    devtool: 'source-map',
    performance: {
      hints: false,
    },

    resolve: {
      // Add `.ts` and `.tsx` as a resolvable extension.
      extensions: ['.vue', '.ts', '.tsx', '.js', '.css', '.scss'],
      alias: {
        "reactui": path.resolve(__dirname, 'src/reactui'),
      },
    },
    module: {
      rules: [
        {
          test: /\.(jsx|tsx)?$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.ts?$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
          options: {
            // Tell to ts-loader: if you check .vue file extension, handle it like a ts file (vue3 TS)
            appendTsSuffixTo: [/\.vue$/],
          },
        },
      ],
    },
  },
  pages: { index: { entry: './src/main.ts' } },
};
