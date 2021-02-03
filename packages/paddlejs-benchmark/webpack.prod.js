const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: {
        index: './src/index.ts'
    },
    resolve: {
        extensions: ['.ts', '.js', '.vue', '.json'],
        alias: {
            '@paddlejs/paddlejs-core': path.resolve(__dirname, '../paddlejs-core/src/'),
            '@paddlejs/paddlejs-backend-webgl': path.resolve(__dirname, '../paddlejs-backend-webgl/src')
        }
    },
    plugins: [
        new CleanWebpackPlugin({
            dangerouslyAllowCleanPatternsOutsideProject: true
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            chunks: ['index'],
            template: './index.html'
        }),
        new VueLoaderPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                  appendTsSuffixTo: [/\.vue$/],
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
            },
            {
                test: /\.pug$/,
                loader: 'pug-plain-loader',
            },
            {
                test: /\.less$/i,
                use: [{
                        loader: "vue-style-loader",
                    },
                    {
                        loader: "css-loader",
                    },
                    {
                        loader: "less-loader"
                    },
                ],
            },
            {
                test: /\.css$/i,
                use: [{
                        loader: "style-loader",
                    },
                    {
                        loader: "css-loader",
                    }
                ],
            },
            {
                test: /\.(png|jpg|svg)$/,
                use: {
                    loader: 'url-loader'
                }
            },
            {
                test: /\.(ttf|eot|woff|woff2)$/,
                loader: 'file-loader',
                options: {
                    name: 'fonts/[name].[ext]'
                }
            }
        ]
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'umd'
    }
};
