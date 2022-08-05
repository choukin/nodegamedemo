// 被冻结的数据不能修改
module.exports = Object.freeze({
    // 玩儿家的数据
    PLAYER:{
        /// 最大生命值
        MAX_HP:100,
        // 速度
        SPEED:500,
        // 大小
        RADUIS:50,
        // 开火频率 0.1 秒一发
        FIRE:0.1
    },
    // 子弹
    BULLET:{
        // 速度
        SPEED:1500,
        // 大小
        RADUIS:20
    },
    // 道具
    PROP:{
        // 生成时间
      CREATE_TIME:10,
        // 大小
      RADUIS:30  
    },
    // 地图大小
    MAP_SIZE:5000,
    // socket 发送消息的函数名
    MSG_TYPES:{
        JOIN_GAME:1,
        UPDATE:2,
        INPUT:3,
        GAME_OVER: 4,
        GET_DELAY: 5        
    }
})