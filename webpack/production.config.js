const config = require("../webpack.config.js");

config.mode = "production";
config.output.clean = true;
module.exports = config;
