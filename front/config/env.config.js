const path = require('path')

module.exports = function (webpackEnv) {
    if (webpackEnv === 'development') {
        return {
            port: 7777,
            host: 'localhost',
            publicPath: '/drawing-board/web/',
            useSourceMap: true
        }
    } else if (webpackEnv === 'production') {
        return {
            outputPath: path.resolve('web'),
            publicPath: '/drawing-board/web/',
            useSourceMap: false,
        }
    }
}
