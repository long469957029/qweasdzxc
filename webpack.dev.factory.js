var _ = require('underscore');

module.exports = function(config) {
  return require('./webpack-config-factory')(_(config).extend({
    hotComponents: true,
    devtool: "eval-source-map",
    debug: true
  }));
};
