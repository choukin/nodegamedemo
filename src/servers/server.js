// 引入模块
const express = require('express')
const socketio = require('socket.io')

const webpack = require('webpack')
const webpackDevMiddleWare = require('webpack-dev-middleware')
const webpackConfig = require('../../webpack.dev')

// 引入自定义模块
const Socket = require('./core/socket')
const Game = require('./core/game')

// 初始化app
const app = express();
const server = require('http').createServer(app)
// 前端静态文件
app.use(express.static('public'))

if(process.env.NODE_ENV === 'development') {
    const compiler = webpack(webpackConfig)
    app.use(webpackDevMiddleWare(compiler))
}else{
    app.use(express.static('dist'))
}





// 示例话游戏
const game = new Game()

// 监听socket服务
const io = socketio(server)

// 将游戏以及io传入创建的socket类来统一管理
const socket = new Socket(game, io)

// 监听链接进入游戏的回掉

io.on('connection',item=>{
    socket.listen(item)
})

// 启动服务
const  port = process.env.PORT || 4000
 server.listen(port, ()=>{
    console.log('服务器启动地址:', + port );
})


