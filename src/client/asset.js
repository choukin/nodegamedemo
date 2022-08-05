// 需要加载的资源
const ASSSET_NAMES = [
    'ball.svg',
    'aim.svg',
    'bullet.svg',
    'speed.svg'
]

const assets = {};

const downloadPromise = Promise.all(ASSSET_NAMES.map(downloadAsset))

function downloadAsset(assetName) {
    return new Promise(resolve => {
        const asset = new Image()
        asset.onload = ()=>{
            console.log(`下载 ${assetName} 🎉`);
            assets[assetName] = asset
            resolve()
        }
        asset.src = `assets/${assetName}`
    })
}

export const downloadAssets = () => downloadPromise

export const getAsset = assetName => assets[assetName]