const { config, environment, Environment } = require("@rails/webpacker");
// Preventing Babel from transpiling NodeModules packages
environment.loaders.delete('nodeModules');
const { resolve } = require("path");
const WebpackerPwa = require("webpacker-pwa");
new WebpackerPwa(config, environment);
module.exports = environment
