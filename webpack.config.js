const path = require('path');
const MinCssPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const fs = require('fs');
const PATHS = {
    src: path.join(__dirname, './src'),
    dist: path.join(__dirname, './dist'),
};
const PAGES_DIR = `${PATHS.src}/pug/pages/`;
const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.pug'));


module.exports = {
    devServer: {
        index: 'headersAndFooters.html'
    },
    entry: {
        'index': './src/index.js',
        'headersAndFooters': './src/headersAndFooters.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),

        filename: () => '[name].[hash].js'

    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.resolve(__dirname, 'src/js'),
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            "@babel/preset-env"
                        ]
                    }
                }
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    MinCssPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {sourceMap: true}
                    },
                    {
                        loader: "sass-loader",
                        options: {sourceMap: true}
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    MinCssPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {sourceMap: true}
                    },

                ]
            },
            {
                test: /\.pug$/,
                loader: 'pug-loader'
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader',
                ],
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                use: ["file-loader?name=[name].[ext]&outputPath=images/",
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            bypassOnDebug: true,
                        }
                    }
                ]
            },

        ]
    },
    plugins: [
        new MinCssPlugin({filename: '[name].[hash].css'}),
        ...PAGES.map(page => new HtmlWebpackPlugin({
            template: `${PAGES_DIR}/${page}`,
            filename: `./${page.replace(/\.pug/, '.html')}`,
            chunks: [`${page.split(".")[0]}`]
        })),
        new CleanWebpackPlugin(),
    ]
};