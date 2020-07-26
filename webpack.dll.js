const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        library: ["vue", "moment"]
    },

    output: {
        filename: '[name].dll.js',
        path: path.resolve(__dirname, 'json-dll'),
        library: '[name]'
    },

    plugins: [
        new webpack.DllPlugin({
            path: './json-dll/library.json',
            name: '[name].json'
        })
    ]
}