const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: {
        index: 'assembly/index.ts',
        enc: './src/index'
    },
    resolve: {
        // Add ".ts" and ".tsx" as resolvable extensions.
        extensions: ['.ts', '.js'],
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: [path.join(__dirname, 'lib/**/*')]
        })
    ],
    module: {
        rules: [
            {
                test: /\.ts?$/,
                loader: 'assemblyscript-typescript-loader',
                include:/assemblyscript/,//to avoid a conflict with other ts file who use 'ts-load',so you can division them with prop 'include'
                options: {
                    limit: 1000,
                    name: `build/[name].[hash:8].wasm`,
                    sourceMap: true
                },
                inclue: /assembly/
            },
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
        libraryTarget: 'umd'
    }
};
