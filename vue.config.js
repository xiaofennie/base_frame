const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
    publicPath: '/',
    outputDir: 'dist',
    devServer: {
        host: '0.0.0.0',
        port: 8888
    },
    // transpileDependencies: ['view-design'],
    chainWebpack: (config) => {
        config.resolve.alias
            .set('@', resolve('src'))
            .set('#', resolve('src/components'))
            .set('~', resolve('src/views'))
            .set('*', resolve('src/assets'));
        config.module
            .rule('js')
            .test(/\.jsx?$/)
            .exclude
            .add(resolve('src/libs/iview-pro'))
            .end();

    },
    // configureWebpack: config => {
    //     plugins: [
    //         new webpack.DefinePlugin({
    //             'process.env': config.dev.env
    //         })
    //     ]
    // }
}
