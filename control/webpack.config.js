const webpack = require('webpack')

/** @type {webpack.Configuration} */
const config = {
    devtool: 'source-map',
    target: ['web', 'es5'], // Keep it working in IE
}

module.exports = config