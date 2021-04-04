const config = require("../webpack.config.js");

const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");

config.mode = "production";
config.output.clean = true;
module.exports = config;
