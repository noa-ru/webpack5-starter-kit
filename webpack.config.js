const entry = require('./webpack.fn.entry');
const Hashmap = require('./webpack.plugin.hashmap');
const path = require('path');

const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const hash = '.[contenthash:6]';
const CopyWebpackPlugin = require("copy-webpack-plugin");
const {VueLoaderPlugin} = require('vue-loader');

const ROOT_PATH = path.resolve(__dirname);
const OUT_PATH_PART = 'dist';
const OUT_PATH = `${ROOT_PATH}${path.sep}${OUT_PATH_PART}`;

console.log(JSON.stringify({
    ROOT_PATH: ROOT_PATH,
    OUT_PATH_PART: OUT_PATH_PART,
    OUT_PATH: OUT_PATH
}, null, 4))

/**
 * webpack --env flag1 flag2
 * console.log(env.flag1) //true
 * console.log(env.flag2) //true
 * console.log(env.flag3) //undefined
 * */
module.exports = (env) => {
    let mode = 'development';
    if (env.prod) {
        mode = 'production';
    }
    console.log(`\nENV: ${mode}\n`);

    return {
        mode: mode,
        devtool: 'source-map',
        entry: entry([
            {
                input: './src/js/**/entry*.js',
                output: 'js'
            },
            {
                input: './src/css/**/entry*.scss',
                output: 'css'
            }
        ]),
        output: {
            path: OUT_PATH,
            filename: `[name]${hash}.js`,
            clean: true,
            // assetModuleFilename: `assets/[name]${hash}[ext]`
        },
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    use: 'vue-loader',
                },
                {
                    test: /\.vue\.(s?[ac]ss)$/, //vue scss
                    use: [
                        'vue-style-loader',
                        'css-loader',
                        'sass-loader'
                    ]
                },
                {
                    test: /\.js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                },
                {
                    test: /(?<!\.vue)\.(s?[ac]ss)$/, //standalone scss
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'postcss-loader',
                        'resolve-url-loader',
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true,
                            }
                        },

                    ],
                },
                {
                    test: /\.(woff(2)?|eot|ttf|otf|svg)$/,
                    type: 'asset/resource',
                    generator: {
                        filename: `fonts/[name]/[name]${hash}[ext]`
                    }
                },
                {
                    test: /\.(jpe?g|png|svg|gif)$/i,
                    type: 'asset',
                    exclude: /fonts/,
                    parser: {
                        dataUrlCondition: {
                            maxSize: 8 * 1024 // inline if less than 8kb
                        }
                    },
                    generator: {
                        filename: `img/[name]${hash}[ext]`
                    }
                },
            ],
        },
        plugins: [
            new VueLoaderPlugin(),
            new Hashmap({hashMapPath: OUT_PATH_PART, assetsRegex: /\.(png|svg|jpe?g|gif|woff2?|eot|ttf)$/i}),
            /** fix empty output entry.js by MiniCssExtractPlugin */
            new RemoveEmptyScriptsPlugin(),
            new MiniCssExtractPlugin({
                filename: `[name]${hash}.css`
            }),
            /** custom sourceMappingURL **/
            // new webpack.SourceMapDevToolPlugin({
            //     append: '\n//# sourceMappingURL=[file].map',
            //     filename: '[file].map',
            // }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: `${ROOT_PATH}/src/static/`,
                        to ({context, absoluteFilename}) {
                            let output = `${OUT_PATH}/static/`;
                            let filepath = absoluteFilename.replace(context, '');
                            let ext = path.extname(absoluteFilename);
                            filepath = filepath.replace(ext, `${hash}${ext}`);
                            return `${output}${filepath}`;
                        }
                    },
                ],
            }),
        ],
        optimization: {
            minimizer: [
                "...",
                new ImageMinimizerPlugin({
                    minimizer: {
                        implementation: ImageMinimizerPlugin.imageminMinify,
                        options: {
                            // Lossless optimization with custom option
                            // Feel free to experiment with options for better result for you
                            plugins: [
                                ["gifsicle", {interlaced: true}],
                                ["jpegtran", {progressive: true}],
                                ["optipng", {optimizationLevel: 5}],
                                // Svgo configuration here https://github.com/svg/svgo#configuration
                                [
                                    "svgo",
                                    {
                                        name: 'preset-default',
                                        params: {
                                            overrides: {
                                                // customize plugin options
                                                convertShapeToPath: {
                                                    convertArcs: true
                                                },
                                                // disable plugins
                                                convertPathData: false
                                            }
                                        }
                                    },
                                ],
                            ],
                        },
                    },
                }),
            ],
        },
    };
}
