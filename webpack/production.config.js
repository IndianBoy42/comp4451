const config = require("../webpack.config.js");
const path = require("path")

//config.mode = "production";
config.output.path = path.resolve(__dirname, "..");
module.exports = config;
