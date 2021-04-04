const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development",
    entry: {
        index: "./src/index.js",
    },
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist"),
        // clean: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Dungeon Mayhem Online",
        }),
    ],
    module: {
        rules: [
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
                        options: { esModule: false },
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
