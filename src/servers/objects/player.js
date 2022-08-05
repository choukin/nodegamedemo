const Item = require('./item')
const Constants = require('../../shared/constants')
const Bullet = require('./bullet')
// 玩家
class Player extends Item{
    constructor(data) {
        super(data)

        this.move = {
            left:0,
            right:0,
            top:0,
            bottom:0
        }
        // 用户吗
        this.username = data.username
        // 生命值
        this.hp = Constants.PLAYER.MAX_HP
        // 速度
        this.speed = Constants.PLAYER.SPEED
        // 击败分值
        this.score = 0
        // 拥有的子弹
        this.buffs = []


        // 开火
        this.fire = false
        this.fireMouseDir = 0
        this.fireTime = 0
    }

    update(dt){
        // console.log('player update',this.move);
        this.x+=(this.move.left+this.move.right)* this.speed*dt
        this.y+=(this.move.top+this.move.bottom)*this.speed*dt;

        // 在地图最大尺寸和自身位置比较时，不能大于地图最大尺寸
        // 在地图开始0位置和自身位置比较时不能小于0
        this.x = Math.max(0, Math.min(Constants.MAP_SIZE, this.x))
        this.y = Math.max(0, Math.min(Constants.MAP_SIZE, this.y))

        // 判断buff 是否失效
        this.buffs = this.buffs.filter(item=>{
            if(item.time>0){
                return item
            } else {
                item.remove(this)
            }
        })

        // buff 的持续时间每帧都减少
        this.buffs.map(buff=>buff.update(dt))

        // 每帧都减少开火延迟
        this.fireTime -= dt
        // console.log('开火');
        // 判断是否开火
        if(this.fire!==false){
            // console.log('开火');
            // 如果没有了延时就返回bullet对象
            this.fireTime = Constants.PLAYER.FIRE;
            // 创建一个Bullet对象，将自身id传递过去，后面做碰撞时，标记自己发射的子弹不会打到自己
            return new Bullet(this.id, this.x, this.y, this.fireMouseDir)
        }
    }

    pushBuff(prop){
        this.buffs.push(prop)
        prop.add(this)
    }
    takeBulletDamage(){
        this.hp -= 1;
    }
    serializeForUpdate(){
        return {
            ...(super.serializeForUpdate()),
            username:this.username,
            socre:this.score,
            hp:this.hp,
            buffs:this.buffs.map(item=>item.serializeForUpdate())
        }
    }
} 

module.exports = Player;