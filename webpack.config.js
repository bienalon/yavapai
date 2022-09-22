'use strict';

const HtmlWebPackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CopyPlugin = require('copy-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');
//const dotenv = require('dotenv');
const Dotenv = require('dotenv-webpack');

const paths = require('./config/paths');

const path = require('path');
const webpack = require('webpack');
const resolve = require('resolve');

const appPackageJson = require(paths.appPackageJson);

// In order to bundle an app with ArcGIS API in wepback
// first you have to turn your bundle target to AMD, so

function isExternal(module) {
    var context = module.context;

    if (typeof context !== 'string') {
        return false;
    }

    return context.indexOf('node_modules') !== -1;
}

module.exports = function (_, arg) {
    const isEnvDevelopment = arg.mode === 'development';
    const isEnvProduction = arg.mode === 'production';

    // const env = dotenv.config().parsed;
    // const envKeys = Object.keys(env).reduce((prev, next) => {
    //     prev[`process.env.${next}`] = JSON.stringify(env[next]);
    //     return prev;
    // }, {});
    // // Overwrite environment var
    // envKeys['process.env.NODE_ENV'] = JSON.stringify(arg.mode);
    // console.log(envKeys);

    const publicPath = isEnvProduction
        ? paths.servedPath
        : isEnvDevelopment && '/';

    const config = {
        entry: {
            index: ['./src/registerServiceWorker.js', './src/contexts/App.js', './src/data/map.js', './src/index.js'], //'./src/esriWorkers.js', ,'./src/registerServiceWorker.js',
        },
        output: {
            filename: arg.mode === 'development' ? '[name].[hash].bundle.js' : 'static/js/[name].[hash:12].bundle.js', // wierd hash error in dev
            // TODO: remove this when upgrading to webpack 5
            futureEmitAssets: true,
            path: path.resolve(__dirname, 'dist'),
            publicPath: '',
            // Prevents conflicts when multiple webpack runtimes (from different apps)
            // are used on the same page.
            //jsonpFunction: `webpackJsonp${appPackageJson.name}`,
            globalObject: 'this',
            libraryTarget: 'amd' // <-- There we go
        },
        optimization: {
            //moduleIds: 'hashed',
            providedExports: true,
            runtimeChunk: 'single',
            splitChunks: {
                chunks: 'all',
                maxInitialRequests: Infinity,
                minSize: 0,
                cacheGroups: {
                    defaultVendors: {
                        test: /[\\/]node_modules[\\/]/,
                        filename: 'static/js/vendor.[hash:12].bundle.js'
                    },
                    // storeVendor: {
                    //     test: /[\\/]node_modules[\\/](react-sweet-state)[\\/]/,
                    //     filename: 'vendor-store.bundle.js'
                    // },
                    reactVendor: {
                        //filename: 'vendors.bundle.js',
                        test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/, // TO DO: other react dependencies
                        filename: 'static/js/vendor-react.[hash:12].bundle.js'
                    },
                    materialVendor: {
                        test: /[\\/]node_modules[\\/](@material-ui)[\\/]/,
                        filename: 'static/js/vendor-material.[hash:12].bundle.js'
                    },
                },
            },
        },
        module: {
            strictExportPresence: true,
            rules: [
                // Disable require.ensure as it's not a standard language feature.
                { parser: { requireEnsure: false } },
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    include: path.resolve(__dirname, 'src'),
                    use: {
                        loader: 'babel-loader'
                    }
                },
                {
                    test: /\.html$/,
                    use: [
                        {
                            loader: 'html-loader',
                            options: { minimize: false },
                        }
                    ],
                    exclude: /node_modules/,
                },
                {
                    test: /\.css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        {
                            loader: 'resolve-url-loader',
                            // options: { includeRoot: true },
                        },
                    ],
                },
                {
                    test: /\.(png|jpe?g|gif|svg|webp)$/i,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                // Inline files smaller than 10 kB (10240 bytes)
                                limit: 10 * 1024,
                                name: 'static/media/[name].[hash:12].[ext]',
                            },
                        }
                    ]
                },
                {
                    test: /\.(wsv|ttf|otf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: 'static/fonts/[name].[ext]'
                            }
                        }
                    ]
                },
            ]
        },
        // Also we have to tell webpack to skip all the JSAPI libraries from being bundled
        // So they will become externals (all dojo and esri libs)
        externals: [
            function (context, request, callback) {
                if (/^dojo/.test(request) ||
                    /^dojox/.test(request) ||
                    /^dijit/.test(request) ||
                    /^dstore/.test(request) ||
                    /^esri/.test(request) ||
                    /pe-wasm$/.test(request)
                ) {
                    return callback(null, 'amd ' + request);
                }
                callback();
            }
        ],
        devServer: {
            inline: true,
            hot: true,
            contentBase: path.join(__dirname, 'dist'),
            compress: true,
            port: 9000,
            historyApiFallback: true,
            progress: true,
            watchOptions: {
                index: 'index.html',
                open: true,
                poll: true,
                watchContentBase: true
            }
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(arg.mode || 'production')
            }),
            new Dotenv(),
            new CleanWebpackPlugin(),
            // Now exlude bundles from being injected into index.html page (ex. for html-webpack-plugin)
            new HtmlWebPackPlugin({
                title: 'YPIT Utilities',
                template: './public/index.ejs',   // <-- Your template
                favicon: './public/favicon.ico',
                chunksSortMode: 'auto', // <-- Important if you want to refer to your bundles after they are built
                inject: false,                // <-- This is exclusion
                mode: arg.mode
            }),
            new CopyPlugin({
                patterns: [
                    { from: 'public/images', to: 'images' },
                    { from: 'public/keycloak.json', to: './' },
                    { from: 'public/manifest.json', to: './' },
                    { from: 'public/.htaccess', to: './' },
                    { from: 'public/oauth-callback.html', to: './' },
                ]
            }),
            new MiniCssExtractPlugin({
                filename: 'static/css/[name].[hash:12].css',
                //chunkFilename: '[id].css'
            }),
            new ManifestPlugin({
                fileName: 'asset-manifest.json',
                publicPath: paths.publicUrl,
                generate: (seed, files, entrypoints) => {
                    const manifestFiles = files.reduce((manifest, file) => {
                        manifest[file.name] = file.path;
                        return manifest;
                    }, seed);

                    const entrypointFiles = entrypoints.index.filter(
                        fileName => !fileName.endsWith('.map')
                    );

                    return {
                        files: manifestFiles,
                        entrypoints: entrypointFiles,
                    };
                },
            }),
            // Moment.js is an extremely popular library that bundles large locale files
            // by default due to how webpack interprets its code. This is a practical
            // solution that requires the user to opt into importing specific locales.
            // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
            // You can remove this if you don't use Moment.js:
            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        ],
        resolve: {
            modules: [
                path.resolve(__dirname, '/src'),
                path.resolve(__dirname, 'node_modules/')
            ],
            extensions: ['.js', '.scss', '.css']
        },
        node: {
            process: false,
            global: false,
            Buffer: false,
            setImmediate: false,
            fs: 'empty'
        }
    };

    if (arg.mode === 'development') {
        config.devtool = 'cheap-module-source-map';
    }
    if (arg.mode === 'production') {
        config.optimization.usedExports = true;
        config.optimization.minimize = true;
        config.optimization.minimizer = [
            new TerserPlugin({
                cache: true,
                parallel: true,
                sourceMap: false,
                terserOptions: {
                    parse: {
                        ecma: 8,
                    },
                    compress: {
                        ecma: 5,
                        warnings: false,
                        comparisons: false,
                        inline: 2,
                    },
                    mangle: {
                        safari10: true,
                    },
                    output: {
                        ecma: 5,
                        comments: false,
                        ascii_only: true,
                    },
                },
            }),
        ];
        config.plugins.push(
            new BundleAnalyzerPlugin()
        );
        config.plugins.push(
            new GenerateSW({
                clientsClaim: true,
                skipWaiting: true,
                // Exclude images from the precache
                exclude: [/\.(?:png|jpg|jpeg|svg|gif|htaccess)$/, /\.map$/, /asset-manifest\.json$/],
                navigateFallback: './index.html',
                navigateFallbackDenylist: [
                    new RegExp('^/_'),
                    new RegExp('/[^/?]+\\.[^/]+$'),
                ],
                // Define runtime caching rules.
                runtimeCaching: [
                    {
                        // Match any request ends with .png, .jpg, .jpeg or .svg.
                        urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
                        // Apply a cache-first strategy.
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'image-cache',
                            expiration: {
                                maxAgeSeconds: 90 * 24 * 60 * 60, // days * hour * min * sec
                                // maxEntries: 50,
                            },
                        },
                    },
                    {
                        // Match any fonts
                        urlPattern: /\.(?:eot|ttf|jpeg|woff|woff2)$/,
                        handler: 'CacheFirst',
                    },
                    {
                        urlPattern: new RegExp('https://js.arcgis.com'),
                        handler: 'StaleWhileRevalidate',
                        options: {
                            cacheName: 'image-cache',
                            expiration: {
                                maxAgeSeconds: 90 * 24 * 60 * 60, // days * hour * min * sec
                                // maxEntries: 50,
                            },
                        },
                    },
                    {
                        urlPattern: new RegExp('^https://fonts.gstatic.com/'),
                        handler: 'StaleWhileRevalidate',
                    },
                    {
                        urlPattern: new RegExp('https://portal2.rickengineering.com'),
                        handler: 'StaleWhileRevalidate',
                        options: {
                            cacheName: 'image-cache',
                            expiration: {
                                maxAgeSeconds: 90 * 24 * 60 * 60, // days * hour * min * sec
                                // maxEntries: 50,
                            },
                        },
                    },
                    {
                        urlPattern: new RegExp('https://cdn.argis.com'),
                        handler: 'StaleWhileRevalidate',
                        options: {
                            cacheName: 'image-cache',
                            expiration: {
                                maxAgeSeconds: 90 * 24 * 60 * 60, // days * hour * min * sec
                                // maxEntries: 50,
                            },
                        },
                    },
                    {
                        urlPattern: new RegExp('https://services.arcgisonline.com'),
                        handler: 'StaleWhileRevalidate',
                        options: {
                            cacheName: 'image-cache',
                            expiration: {
                                maxAgeSeconds: 30 * 24 * 60 * 60, // days * hour * min * sec
                                // maxEntries: 50,
                            },
                        },
                    },
                    {
                        urlPattern: new RegExp('https://utility.arcgisonline.com'),
                        handler: 'StaleWhileRevalidate',
                        options: {
                            cacheName: 'image-cache',
                            expiration: {
                                maxAgeSeconds: 90 * 24 * 60 * 60, // days * hour * min * sec
                                // maxEntries: 50,
                            },
                        },
                    },
                ]
            }),
        );

    }

    return config;
};
  // ...
  // For most of the cases this might be enough in webpack configuration
  // and depending on your bundles config you just have to `require` them in your index.html
  // See index.html file above