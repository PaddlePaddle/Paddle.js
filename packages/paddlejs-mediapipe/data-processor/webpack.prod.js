const path = require('path');

module.exports = {
    mode: 'production',
    entry: {
        index: ['./src/index']
    },
    resolve: {
        // Add ".ts" and ".tsx" as resolvable extensions.
        extensions: ['.ts', '.js'],
        fallback: {
            path: require.resolve('path-browserify')
        }
    },
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
        libraryTarget: 'umd',
        library: 'paddlejsDataProcessor',
        publicPath: '/',
        globalObject: 'this'
    }
};
