import './css/bootstrap-reboot.css'
import './css/main.css'
import {connect, play} from './networking'
import {$} from './util'
import {downloadAssets} from './asset'
import {startRendering, stopRendering, updateRanking} from './render'
import {startCapturingInput, stopCapturingInput} from './input'
Promise.all([
    connect(gameOver),
    downloadAssets()
]).then(()=>{
    // 链接成功后
    // 隐藏链接提示
    // 显示输入框和按键
    $('.connect').classList.add('hidden')
    $('.play').classList.remove('hidden')
    $('#home input').focus()

    // 开始游戏隐藏开始界面
    // $('#home').classList.add('hidden')
    // play('user')
    // startRendering()
    $('#play-button').onclick = ()=>{
        //
        let username = $('#home input').value
        
        // 输入值判断
        if(username.replace(/\s*/g, '')===''){
            alert('名称不能为空')
            return
        }
        // 开始游戏隐藏开始界面
        $('#home').classList.add('hidden')
        $('.ranking').classList.add('hidden')
        play(username)
        startRendering()
        startCapturingInput()
    }

}).catch(console.error)

function gameOver(update) {
    updateRanking(update.leaderboard)
    stopRendering()
    stopCapturingInput()
    $('#home').classList.remove('hidden')
    $('.ranking').classList.remove('hidden')
    alert('阵亡了，重新来吧')
}


