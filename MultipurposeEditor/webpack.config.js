const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack');

module.exports = {
    entry: "./src/app.ts",
    mode: 'development',
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
            },
            {
                test: /\.(svg|png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'url-loader',
                    },
                ],
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(["wwwroot/*.html", "wwwroot/*.css", "wwwroot/*.js"]),
        new HtmlWebpackPlugin({
            template: "./src/index.html"
        }),
        new MiniCssExtractPlugin({
            filename: "main.css"
        }),
        // new webpack.ProvidePlugin({
        //    mxgraph: 'mxgraph/javascript/mxClient.min.js',
        // }),
    ],
    //externals: {
    //    jquery: 'jQuery'
    //}
    devtool: 'cheap-module-eval-source-map'
};
