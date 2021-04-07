const config = require("../webpack.config.js");

config.watch = true;
config.devtool = "inline-source-map";
config.devServer = {
    contentBase: "./dist",
};
module.exports = config;
