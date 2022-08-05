const path = require('node:path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
module.exports = {
    // 入口文件
    entry:{
        game:'./src/client/index.js'
    },
    // 打包文件输出到dist文件中
    output:{
        filename:'[name].[contenthash].js',
        path:path.resolve(__dirname, 'dist'),

    },
    module:{
        rules:[
            // babel 解析js
            {
                test:/\.js$/,
                exclude:/node_modules/,
                use:{
                    loader:"babel-loader",
                    options:{
                        presets:['@babel/preset-env']
                    }
                }
            },
         // 解析css
            {
                test:/\.css$/,
                use:[
                    {
                        loader:MiniCssExtractPlugin.loader,
                    },
                    'css-loader'
                ]
            }
        ]
    },
    optimization:{
        minimizer:[
            new CssMinimizerPlugin()
        ]
    },
    plugins:[
        new MiniCssExtractPlugin({
            filename:'[name].[contenthash].css'
        }),
        // 处理后的js和css植入html
        new HtmlWebpackPlugin({
            filename:'index.html',
            template:'src/client/html/index.html'
        }),
    ]
}
