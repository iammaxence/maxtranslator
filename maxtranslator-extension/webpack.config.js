const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const {readdirSync} = require("node:fs");

// The folder with my components
const htmlFolder = path.resolve(__dirname, 'src/component');

// Dynamically find all HTML files in the folder
const htmlFiles = readdirSync(htmlFolder).filter(file => file.endsWith('.html'));

// Generate a HtmlWebpackPlugin instance for each HTML file
const htmlPlugins = htmlFiles.map(file => {
    return new HtmlWebpackPlugin({
        template: path.join(htmlFolder, file),
        filename: file,
        inject: true,
    });
});

module.exports = {
    mode: 'development', // Replace by production in production build
    entry: './src/index.ts',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
        assetModuleFilename: 'assets/resource/[name][ext]', // Customize output folder
        clean: true,
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg)$/i,
                type: 'src/assets/resource',
            },
            {
                test: /\.html$/i,
                use: [
                    {
                        loader: 'html-loader',
                        options: {
                            sources: true,
                            minimize: true,
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        ...htmlPlugins,
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'assets/resource'),
                    to: 'assets/resource',
                },
            ],
        }),
    ],
    devtool: 'inline-source-map', // set to false in production
};
