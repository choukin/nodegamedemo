class Item{
    constructor(data={}){
        // id
        this.id = data.id
        // 位置
        this.x = data.x
        this.y = data.y
        // 大小
        this.w = data.w
        this.h = data.h


    }
    // 物体每帧的运动状态
    update(dt){

    }
    // 计算当前物体到指定物体的距离  勾股定理算距离
    distanceTo(item){
        const dx = this.x - item.x
        const dy = this.y - item.y
        return Math.sqrt(dx*dx+dy*dy)
    }
    // 格式化数据，方便发送到前端
    serializeForUpdate(){
        return {
            id:this.id,
            x:this.x,
            y:this.y,
            w:this.w,
            h:this.h,
        }
    }
}

module.exports = Item