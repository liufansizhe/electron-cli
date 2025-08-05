// Electron 主进程入口
import { BrowserWindow, app, ipcMain } from 'electron'

import { fileURLToPath } from 'node:url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
console.log(process.env.NODE_ENV)
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
            contextIsolation: false
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

    // 设置窗口控制IPC监听器
    setupWindowControls()
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// // 窗口控制函数
function setupWindowControls() {
    // 最小化窗口
    ipcMain.on('window-minimize', (event) => {
        const webContents = event.sender
        const win = BrowserWindow.fromWebContents(webContents)
        win.minimize()
    })

    // 最大化/还原窗口
    ipcMain.on('window-maximize', (event) => {
        const webContents = event.sender
        const win = BrowserWindow.fromWebContents(webContents)
        if (win.isMaximized()) {
            win.unmaximize()
        } else {
            win.maximize()
        }
    })

    // 关闭窗口
    ipcMain.on('window-close', (event) => {
        const webContents = event.sender
        const win = BrowserWindow.fromWebContents(webContents)
        win.close()
    })

    // 获取窗口最大化状态
    ipcMain.handle('window-is-maximized', (event) => {
        const webContents = event.sender
        const win = BrowserWindow.fromWebContents(webContents)
        return win.isMaximized()
    })
}

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    } else {
        ipcMain.removeHandler('window-is-maximized')
        ipcMain.removeHandler('window-minimize')
        ipcMain.removeHandler('window-maximize')
        ipcMain.removeHandler('window-close')
    }
})
