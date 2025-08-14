// Electron 主进程入口
import { BrowserWindow, app } from 'electron'

import { fileURLToPath } from 'node:url'
import mainUtils from './mainUtils.js'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// 忽略证书错误（仅开发环境）
if (process.env.NODE_ENV === 'development') {
    app.commandLine.appendSwitch('ignore-certificate-errors')
    app.commandLine.appendSwitch('ignore-ssl-errors')
}
function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        // 自定义窗口样式
        frame: false, // 移除默认窗口边框
        titleBarStyle: 'hidden',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: true
        }
    })

    // 开发环境加载 Vite 启动的本地服务，生产环境加载打包后的文件
    if (process.env.NODE_ENV === 'development') {
        win.loadURL('https://localhost:8080/')
    } else {
        console.log(path.join(__dirname, './dist/index.html'))
        const indexPath = path.join(__dirname, './dist/index.html')
        win.loadURL(new URL(`file://${indexPath}`).href)
    }

    // //在macOS上隐藏交通灯按钮
    if (process.platform === 'darwin') {
        win.setWindowButtonVisibility(false)
    }
}

app.whenReady().then(() => {
    createWindow()
    for (let i in mainUtils) {
        mainUtils[i]?.()
    }
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
