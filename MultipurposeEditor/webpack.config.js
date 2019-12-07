//const path = require("path");

//module.exports = {
//    entry: "./scripts/app.ts",

//    //output: {
//    //    path: "./",
//    //},

//    resolve: {
//        extensions: [".js", ".ts"]
//    },

//    module: {
//        rules: [
//            {
//                use: 'ts-loader',
//                exclude: /node_modules/
//            },
//        ],
//    },
//};

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack');

module.exports = {
    entry: "./scripts/app.ts",
    output: {
        path: path.resolve(__dirname, "wwwroot"),
        filename: "main.js",
        publicPath: "/"
    },
    resolve: {
        extensions: [".js", ".ts"]
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader"
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(["wwwroot/*"]),
        new HtmlWebpackPlugin({
            template: "./scripts/index.html"
        }),
        new MiniCssExtractPlugin({
            filename: "main.css"
        }),
    ],
    //externals: {
    //    jquery: 'jQuery'
    //}
};