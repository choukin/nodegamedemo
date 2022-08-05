import io from 'socket.io-client'
import Constants from '../shared/constants'
import {processGameUpdate} from './state'
import { $ } from './util'
// 根据网页的协议设置socket协议
const socketProtocal = (window.location.protocol.includes('https')?'wss':'ws')
// 不重新链接
const socket = io(`${socketProtocal}://${window.location.host}`, {reconnection: false})

const connectPromise = new Promise(resolve=>{
    socket.on('connect',()=>{
        console.log('链接到服务器');
        resolve()
    })
})

export const connect = onGameOver =>{
    connectPromise.then(()=>{
        socket.on(Constants.MSG_TYPES.UPDATE, processGameUpdate)
        socket.on(Constants.MSG_TYPES.GAME_OVER, onGameOver)
        socket.on('disconnect', ()=>{
            $('.disconnect').classList.remove('hidden')
            console.log('断开链接');
        })
    })
}

export const play = username =>{
    socket.emit(Constants.MSG_TYPES.JOIN_GAME, username)
}



// 发送用户移动数据给服务端
export const emitControl = data =>{
    socket.emit(Constants.MSG_TYPES.INPUT, data)
}