import { customizeArray } from 'webpack-merge';
import { BULLET, MAP_SIZE, PLAYER, PROP } from '../shared/constants'
import { getAsset } from './asset'
import {getCurrentState} from './state'
import { $ } from "./util";


const stage = $('#stage')

const ctx = stage.getContext('2d')

function setCanvasSize() {
    stage.width = window.innerWidth
    stage.height = window.innerHeight
}

setCanvasSize();
window.addEventListener('resize', setCanvasSize)

// 绘制函数

function render() {
    const {me, others, bullets, props } = getCurrentState()||{}
    // console.log('render', me.x, me.y);
    if(!me){
        return
    }
    // 游戏中的地图是一个大地图，一个屏幕容纳不了，所以玩家运动需要一个参照物，这里使用一个渐变圆左参照
    renderBackground(me.x, me.y)

    // 绘制边界
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 1;
    // 默认边界左上角在屏幕中心， 减去人物的 x/y 计算出人物的偏移
    //TODO:
    ctx.strokeRect(stage.width/2-me.x, stage.height/2-me.y, MAP_SIZE, MAP_SIZE)
    // ctx.strokeRect(500, stage.height/2-me.y, MAP_SIZE, MAP_SIZE);

    renderPlayer(me, me)
    others.forEach(renderPlayer.bind(null,me));
    //画子弹
    bullets.map(renderBullet.bind(null, me));
    // 画道具
    props.map(renderProp.bind(null, me))


}

function renderBackground(x, y) {
    // 假设背景园的位置在屏幕左上角， 那么 stage.width/height / 2 就会将这个圆定位在屏幕中心 
    // MAP_SIZE / 2 - x/y 地图中心与玩家的距离，这段距离就是背景圆圆心正确的位置
    const backgroundX = MAP_SIZE/2-x + stage.width/2
    const backgroundY = MAP_SIZE/2-y + stage.height/2
    // 绘制放射性渐变
    const bgGradient = ctx.createRadialGradient(
        backgroundX,
        backgroundY,
        MAP_SIZE/10,
        backgroundX,
        backgroundY,
        MAP_SIZE/2
    )

    bgGradient.addColorStop(0, 'rgb(100,216,89)')
    bgGradient.addColorStop(1, 'rgb(154, 207, 233)')

    ctx.fillStyle = bgGradient

    ctx.fillRect(0,0, stage.width, stage.height)
}


// 绘制玩家
function renderPlayer(me, player){
    const {x, y} = player

    const canvasX = stage.width/2 + x -me.x
    const canvasY = stage.height/2 +y -me.y
        // 保存当前全部状态 配合restore使用
    ctx.save()
    ctx.translate(canvasX, canvasY)

    ctx.drawImage(
        getAsset('ball.svg'),
        -PLAYER.RADUIS,
        -PLAYER.RADUIS,
        PLAYER.RADUIS*2,
        PLAYER.RADUIS*2
    )
    ctx.restore()
    
    // 绘制血条背景
    ctx.fillStyle = 'white'
    ctx.fillRect(
        canvasX - PLAYER.RADUIS,
        canvasY - PLAYER.RADUIS -8,
        PLAYER.RADUIS*2,
        4
    )
    // 绘制血条
    ctx.fillStyle = 'red'
    ctx.fillRect(
        canvasX-PLAYER.RADUIS,
        canvasY - PLAYER.RADUIS -8,
        PLAYER.RADUIS*2*(player.hp/PLAYER.MAX_HP),
        4,
    )

    // 绘制玩家名称

    ctx.fillStyle = 'white'
    ctx.textAlign = 'center'
    ctx.font = "20px '微软雅黑'"
    ctx.fillText(player.username, canvasX,canvasY-PLAYER.RADUIS -16)


    player.buffs.map((buff,i)=>{
        ctx.drawImage(
            getAsset(`speed.svg`),
            canvasX-PLAYER.RADUIS+i*22,
            canvasY+PLAYER.RADUIS+16,
            20,
            20
        )
    })

}


function renderBullet(me, bullet) {
    const {x, y, rotate} = bullet
    ctx.save()
    // 偏移到子弹相对人物的位置
    ctx.translate(stage.width/2+x-me.x, stage.height/2+y-me.y)
    // 旋转
    ctx.rotate(Math.PI/180*rotate)
    // 绘制
    ctx.drawImage(
        getAsset('bullet.svg'),
        -BULLET.RADUIS,
        -BULLET.RADUIS,
        BULLET.RADUIS*2,
        BULLET.RADUIS*2
    )
    ctx.restore()
}



/**
 * 渲染道具
 * @param {} me 
 * @param {*} prop 
 */
function renderProp(me, prop) {
    const {x,y,type} = prop;
    ctx.save()
    ctx.drawImage(
        getAsset(`${type}.svg`),
        stage.width/2+x -me.x,
        stage.height/2+y -me.y,
        PROP.RADUIS*2,
        PROP.RADUIS*2
    )
    ctx.restore()
}






// 设置启动渲染函数的定时器，
let renderInterval = null;

export function startRendering() {
    renderInterval = setInterval(render,1000/60)
}

export function stopRendering() {
    ctx.clearRect(0,0,stage.width, stage.height)
    clearInterval(renderInterval)
}

export function updateRanking(data) {
    let str = '';
    data.map((item,i)=>{
        str+=`
            <tr>
                <td>${i+1}</td>
                <td>${item.username}</td>
                <td>${item.score}</td>
            </tr>
        `
    })

    $('.ranking table tbody').innerHTML = str;

}

