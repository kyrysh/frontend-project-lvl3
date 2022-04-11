import HtmlWebpackPlugin from 'html-webpack-plugin';

const config = {
  mode: process.env.NODE_ENV || 'development',
  entry: './src/index.js',
  devServer: {
    open: true,
    host: 'localhost',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
      title: 'Development',
    }),
  ],
  output: {
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
};

export default (env, options) => {
  config.devtool = options.mode === 'production' ? false : 'inline-source-map';
  return config;
};
