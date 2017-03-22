const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const config = require('./build-config');

/**
 * Returns the Output file config based on
 * the run-time environment
 *
 * @return {Object} Webpack's config for `output`
 */
function getOutputFilesConfig() {
    let filename = '[name].js';

    if (config.ENV === 'production') {
        filename = '[name].[hash].js';
    }

    return {
        filename: filename,
        path: config.path.dist + '/bundles',
        publicPath: '/bundles'
    };
}


/**
 * Returns the set of webpack loaders config based
 * on the run-time environment
 *
 * @return {Array} Webpack's config for `modules.loaders`
 */
function getLoaders() {
    return [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            loaders: ['babel-loader']
        },
        {
            test: /\.scss$/,
            exclude: /node_modules/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: ['css-loader', 'postcss-loader', 'sass-loader']
            })
        },
        {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/],
            loader: 'url-loader',
            options: {
                limit: 10000,
                name: '/img/[name].[hash:8].[ext]'
            }
        }
    ];
}


/**
 * Returns the set of webpack plugins based on
 * the run-time environment
 *
 * @return {Array} Webpack's config for `plugins`
 */
function getPlugins() {
    let cssFilename = '[name]';

    if (config.ENV === 'production') {
        cssFilename = '[name].[contenthash]';
    }

    const plugins = [
        new ExtractTextPlugin({
            filename: cssFilename + '.css'
        }),

        new HtmlWebpackPlugin({
            filename: config.path.dist + '/index.html',
            template: config.path.src + '/index.html',
            inject: false
        }),

        new webpack.NamedModulesPlugin(),

        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(config.ENV),
            'process.env.API_URL': JSON.stringify(config.API_URL)
        }),

        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        })
    ];

    if (config.ENV !== 'development') {
        plugins.push(
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    sequences: true,
                    dead_code: true,
                    conditionals: true,
                    booleans: true,
                    unused: true,
                    if_return: true,
                    join_vars: true,
                    drop_console: true,
                    warnings: false
                },
                output: {
                    comments: false
                },
                sourceMap: true
            })
        );
    }

    return plugins;
}


console.log('Running Webpack in ' + config.ENV.toUpperCase() + ' mode \n');

module.exports = {
    devtool: 'source-map',

    entry: {
        app: [
            config.path.src + '/js/app.js'
        ]
    },

    output: getOutputFilesConfig(),

    module: {
        loaders: getLoaders()
    },

    plugins: getPlugins(),

    watch: config.isWatchEnabled,

    performance: {
        hints: false
    }
};
