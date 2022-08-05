const Constants = require('../../shared/constants')
const Item = require('./item')
/**
 * 道具
 */
class Prop extends Item{
    constructor(type){
        
        // 随机位置
        const x = (Math.random()*.5+.25)* Constants.MAP_SIZE
        const y = (Math.random()*.5+.25)* Constants.MAP_SIZE
        super({
            x,
            y,
            w:Constants.PROP.RADUIS,
            h:Constants.PROP.RADUIS
        })
        this.isOver = false

        // 什么类型的buff
        this.type = type;
        // 道具作用10s
        this.time = 10;
    }

    // 这个道具让玩家速度增加 500
    add(player) {
        switch (this.type) {
            case 'speed':
                player.speed += 500
                break;
        }
    }
    // 移除道具的影响
    remove(player){
        switch (this.type) {
            case 'speed':
                player.speed -= 500
                
                break;
        
            default:
                break;
        }
    }

    // 每帧更新剩余作用时间
    update(dt){
        this.time -= dt
    }

    serializeForUpdate(){
        return {
            ...(super.serializeForUpdate()),
            type: this.type,
            time:this.tiem
        }
    }
}

module.exports = Prop