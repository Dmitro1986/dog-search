// next-intl-wrapper.cjs
const withNextIntl = require('next-intl/plugin');
const config = require('./next-intl.config.js');

module.exports = withNextIntl(config);
