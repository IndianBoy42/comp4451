const webpack = require("webpack");
const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development",
    entry: {
        index: "./src/index.js",
        peertest: "./src/peertest.js",
    },
    output: {
        // filename: "main.js",
        path: path.resolve(__dirname, "dist"),
        // assetModuleFilename: "[name][ext]",
        // clean: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Dungeon Mayhem Online",
            chunks: ["index"],
        }),
        new HtmlWebpackPlugin({
            title: "Simple Peer Testing",
            chunks: ["peertest"],
            filename: "peertest.html",
        }),
        new webpack.ProvidePlugin({
            process: "process/browser",
            // Promise: "es6-promise", // Thanks Aaron (https://gist.github.com/Couto/b29676dd1ab8714a818f#gistcomment-1584602)
            // fetch: "imports?this=>global!exports?global.fetch!whatwg-fetch",
        }),
    ],
    module: {
        rules: [
            // {
            //     test: /\.html$/,
            //     type: "asset/resource",
            //     generator: {
            //         filename: "[name][ext]",
            //     },
            // },
            // {
            //     test: /\.html$/,
            //     use: [
            //         // {
            //         //     loader: "file-loader",
            //         //     options: {
            //         //         esModule: true,
            //         //     },
            //         // },
            //         {
            //             loader: "extract-loader",
            //             options: {
            //                 esModule: false,
            //             },
            //         },
            //         {
            //             loader: "html-loader",
            //             options: {
            //                 esModule: false,
            //             },
            //         },
            //     ],
            // },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(glb|gltf)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            outputPath: "assets/models/",
                        },
                    },
                ],
            },
            {
                test: /\.(bin|jpe?g|png|svg|gif)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            outputPath: "assets/images/",
                        },
                        // options: { esModule: false },
                    },
                ],
            },
            {
                test: /\.(csv|tsv)$/i,
                use: ["csv-loader"],
            },
            {
                test: /\.xml$/i,
                use: ["xml-loader"],
            },
        ],
    },
};
