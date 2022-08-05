const Player = require('../objects/player')
const Constants = require('../../shared/constants')
const Prop = require('../objects/prop')
class Game{
    constructor(){
        // 保存玩家socket信息
        this.sockets = {}
        // 保存玩家游戏对象的信息
        this.players = {}
        // 子弹
        this.bullets = []
        // 道具数组
        this.props = []
        // 添加道具计时
        this.createPropTime = 0;
        // 最后一次执行时间
        this.lastUpdateTime = Date.now()
        // 是否发送给前端数据，这里将每两针发送一次数据
        this.shouldSendUpdate = false
        // 更新游戏
        setInterval(this.update.bind(this), 1000/60)
    }
    update(){
        const now = Date.now();
        // 当前时间减去上次执行完毕的时间得到间隔时间
        const dt = (now - this.lastUpdateTime)/1000
        this.lastUpdateTime = now

        // 过滤飞出地图或打到其他人身上的子弹

        this.bullets = this.bullets.filter(item=>!item.isOver)
        // 更新所有子弹
        this.bullets.map(bullet=>{
            bullet.update(dt)
        })

        // createPropTime 为0 重新添加道具
        this.createPropTime -= dt;
        // 顾虑被碰到的道具
        this.props = this.props.filter(item=>!item.isOver)

        if(this.createPropTime<=0 && this.props.length<10){
            this.createPropTime = Constants.PROP.CREATE_TIME;
            this.props.push(new Prop('speed'))
        }



        // 更新玩家人物
        Object.keys(this.players).map(playerID=>{
            const player = this.players[playerID];
            // 给玩家添加发射的子弹
            const bullet = player.update(dt)
            if(bullet){
                // console.log('子弹',bullet);
                this.bullets.push(bullet)
            }
        })
            // 子弹玩家碰撞

            this.collisionsBullet(Object.values(this.players), this.bullets)
            // 道具和玩家碰撞
            this.collisionsProp(Object.values(this.players), this.props)
            Object.keys(this.sockets).map(playerID=>{
                const socket = this.sockets[playerID]
                const player = this.players[playerID]
                if(player.hp <= 0){
                    // 发送最新数据
                    socket.emit(Constants.MSG_TYPES.GAME_OVER,this.createUpdate(player))
                    this.disconnect(socket);
                }                
            })

        if(this.shouldSendUpdate){
            Object.keys(this.sockets).map(playerID=>{
                const socket = this.sockets[playerID]
                const player = this.players[playerID]
                // 发送最新数据
                socket.emit(
                    Constants.MSG_TYPES.UPDATE,
                    this.createUpdate(player)
                )
            })

        }else{
            this.shouldSendUpdate = true
        }
    }
    //  玩家和子弹碰撞检测
    collisionsBullet(players, bullets){
        for (let i = 0; i < bullets.length; i++) {
            for (let j = 0; j < players.length; j++) {
                const player = players[j];
                const bullet = bullets[i];
                // console.log(player.id);
                // 自己发的子弹不能打自己
                if(bullet.parentID !== player.id
                    && player.distanceTo(bullet) <= Constants.PLAYER.RADUIS + Constants.BULLET.RADUIS
                    ){
                        // 子弹消失
                        bullet.isOver = true;
                        // 打到的玩家掉血
                        player.takeBulletDamage();
                        if(player.hp<=0){
                            // 发射玩家加分
                            this.players[bullet.parentID].score++
                        }
                        break
                }
                
            }
            
        }
    }
    //  玩家和道具碰撞检测
    collisionsProp(players, props){
        for (let i = 0; i < props.length; i++) {
            for (let j = 0; j < players.length; j++) {
                const player = players[j];
                const prop = props[i];
                // console.log(player.id);
                if(player.distanceTo(prop) <= Constants.PLAYER.RADUIS + Constants.BULLET.RADUIS
                    ){
                        // 道具消失
                        prop.isOver = true;
                        // 玩家添加道具
                        player.pushBuff(prop)
                        break
                }
                
            }
            
        }
    }    
    handleInput(socket,item){
        console.log('handleInput: ',item);
        const player = this.players[socket.id]
        if(player){
            let data = item.action.split('-')
            let type = data[0]
            let value = data[1]
            switch(type){
                // 移动人物
                case 'move': 
                    player.move[value] = typeof item.data ==='boolean'
                                            ?item.data?1:-1
                                            :0                        
                 break;    
                 // 更新鼠标位置  
                case 'dir':
                    player.fireMouseDir = item.data;
                    break;
                // 开火停火
                case 'bullet':
                    // console.log('开火停火',item);
                    player.fire = item.data;
                    return ;                           
            }
        }
    }
    createUpdate(player){
        const otherPlayer = Object.values(this.players).filter(p=>p!==player)
        const leaderboard = this.getLeaderboard()
        // console.log('leaderboard',leaderboard);
        return {
            t:Date.now(),
            me:player.serializeForUpdate(),
            others:otherPlayer,
            bullets:this.bullets.map(bullet=> bullet.serializeForUpdate()),
            leaderboard, // 排行榜数据
            props: this.props.map(prop=>prop.serializeForUpdate())
        }
    }
    joinGame(socket, username){
        // console.log('=====');
        this.sockets[socket.id] = socket

        const x = (Math.random()*0.5+.25)* Constants.MAP_SIZE
        const y = (Math.random()*0.5+.25)* Constants.MAP_SIZE
        this.players[socket.id] = new Player({
            id:socket.id,
            username,
            x,
            y,
            r:Constants.PLAYER.RADUIS
        })
    }
    getLeaderboard() {
        return Object.values(this.players)
        .sort((a, b)=> b.score -a.score)
        .slice(0,10)
        .map(item=>({username:item.username, score: item.score}))
    }    
    disconnect(socket){
        delete this.sockets[socket.id]
        delete this.players[socket.id]
    }
}
module.exports = Game