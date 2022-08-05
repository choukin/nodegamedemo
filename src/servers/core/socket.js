const constants = require('../../shared/constants')
/**
 * 玩家输入名称加入游戏后生成一个Player对象
 */
class Socket {
    constructor(game, io){
        this.game = game
        this.io = io 
    }
    listen(socket){
        console.log(`玩家成功链接，Socket ID:${socket.id}`);

        // 加入游戏
        socket.on(constants.MSG_TYPES.JOIN_GAME, this.game.joinGame.bind(this.game,socket))

        socket.on(constants.MSG_TYPES.INPUT, this.game.handleInput.bind(this.game, socket))

        // 断开游戏
        socket.on('disconect', this.game.disconnect.bind(this.game, socket))
    }
}

module.exports = Socket