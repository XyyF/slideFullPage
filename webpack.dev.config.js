const path = require('path')

module.exports = {
    context: path.join(__dirname, 'test'),
    entry: './test.js',
    devtool: 'source-map',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'slideFullPage.dev.js',
        publicPath: '/dist/',
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /^node_mocules/,
                loaders: ['babel-loader'],
            },
        ],
    },
    devServer: {
        port: 3000,
        contentBase: './',
    },
}