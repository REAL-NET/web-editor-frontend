export {}

const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: './server/server.tsx',

    target: 'node',

    externals: [nodeExternals()],

    output: {
        path: path.resolve('server-build'),
        filename: 'index.ts'
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'babel-loader'
            }
        ]
    }
};