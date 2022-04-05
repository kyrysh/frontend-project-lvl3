// Generated using webpack-cli https://github.com/webpack/webpack-cli


//const path = require('path');
//import path from 'path';

//const HtmlWebpackPlugin = require('html-webpack-plugin');
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default {
    mode: 'development',

    entry: './src/index.js',
    devtool: 'inline-source-map',

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
        //path: path.resolve(__dirname, 'dist'),
        //clean: true,
    },
    module: {
        rules: [
            /*{
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset',
            },*/
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },


            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    },
};