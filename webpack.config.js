const path = require('path')

module.exports = {
    context: path.join(__dirname, 'src'),
    entry: './slideFullPage.js',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'slideFullPage.min.js'
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
}