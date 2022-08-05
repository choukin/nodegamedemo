const {merge} = require('webpack-merge')

const common = require('./webpack.common')
// 压缩js
const terserJSPlugin = require('terser-webpack-plugin')
// 要缩css
// const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = merge(common, {
    mode:'production',
    optimization:{
        minimizer:[new terserJSPlugin({}), new MiniCssExtractPlugin({})]
    }
})