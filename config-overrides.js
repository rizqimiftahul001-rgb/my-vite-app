const path = require(`path`);
const alias = require(`./aliases`);
const { aliasWebpack } = require("react-app-alias");

const SRC = `./src`;
const aliases = alias(SRC);

const resolvedAliases = Object.fromEntries(
  Object.entries(aliases).map(([key, value]) => [
    key,
    path.resolve(__dirname, value),
  ])
);

const options = {
  alias: resolvedAliases,
};

module.exports = function override(config) {
  config.output.filename = "static/js/[name].[contenthash:8].js";
  config.output.chunkFilename = "static/js/[name].[contenthash:8].chunk.js";
  config.ignoreWarnings = [{ message: /Failed to parse source map/ }];

  return aliasWebpack(options)(config);
};
