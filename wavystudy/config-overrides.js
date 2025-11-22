const webpack = require("webpack")

module.exports = function override(config, env) {
    //do stuff with the webpack config...
    config.resolve.fallback = {
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        "fs": false,
        "tls": false,
        "net": false,
        "path": false,
        "zlib": false,
        "os": false,
       'browser.js': require.resolve('process/browser'),
       'process/browser': require.resolve('process/browser'),
        "assert": require.resolve("assert"),
        "os-browserify": require.resolve('os-browserify'), //if you want to use this module also don't forget npm i crypto-browserify 
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer'),
    }
    config.resolve.extensions = [...config.resolve.extensions, ".ts", ".js",".mjs"]
    config.plugins = [
        ...config.plugins,
        new webpack.ProvidePlugin({
            process: "browser.js",
            Buffer: ["buffer", "Buffer"],
        }),
    ]
    return config
}