const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    mode: 'production',
    entry: {
        index: [path.resolve(__dirname, './src/index')]
    },
    resolve: {
        // Add ".ts" and ".tsx" as resolvable extensions.
        extensions: ['.ts', '.js']
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: [path.join(__dirname, 'lib/**/*')]
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: 'disabled',
            generateStatsFile: true,
            statsFilename: './stats.json'
        })
    ],
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'lib'),
        globalObject: 'this',
        libraryTarget: 'umd',
        library: ['paddlejs', 'core'],
        publicPath: '/'
    }
};
