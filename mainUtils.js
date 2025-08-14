import { BrowserWindow, app, dialog, ipcMain, shell } from 'electron'

import fs from 'fs'
import path from 'path'

//获取渲染实例
const getWin = (event) => {
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    return win
}
//获取默认路径
const getPath = () => {
    // Windows 默认路径: C:\Users\<user>\Downloads
    if (process.platform === 'win32') {
        return path.join(app.getPath('home'), 'Downloads')
    }
    // macOS 默认路径: /Users/<user>/Downloads
    else if (process.platform === 'darwin') {
        return path.join(app.getPath('home'), 'Downloads')
    }
    // Linux 默认路径
    return app.getPath('downloads')
}
//格式化字节
const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat(bytes / Math.pow(k, i)).toFixed(decimals) + ' ' + sizes[i]
}
// 格式化速度显示
const formatSpeed = (bytesPerSecond) => {
    if (bytesPerSecond < 1024) {
        return `${bytesPerSecond.toFixed(0)} B/s`
    } else if (bytesPerSecond < 1048576) {
        return `${(bytesPerSecond / 1024).toFixed(1)} KB/s`
    } else {
        return `${(bytesPerSecond / 1048576).toFixed(1)} MB/s`
    }
}
// 创建唯一文件名函数
function createUniquePath(directory, fileName) {
    const parsedPath = path.parse(fileName)
    let counter = 1
    let newPath = path.join(directory, fileName)

    while (fs.existsSync(newPath)) {
        newPath = path.join(directory, `${parsedPath.name} (${counter})${parsedPath.ext}`)
        counter++
    }

    return newPath
}

//---------------------------以上是公共函数---------------------------------

// 获取平台特定的默认下载路径
const getDefaultPath = () => {
    ipcMain.handle('get-default-path', () => {
        return getPath()
    })
}
//选择文件夹
const selectFolder = () => {
    // 选择下载文件夹
    ipcMain.handle('select-folder', async () => {
        const defaultPath = getPath()
        const { canceled, filePaths } = await dialog.showOpenDialog({
            properties: ['openDirectory'],
            defaultPath: defaultPath,
            title: '选择下载文件夹',
            buttonLabel: '选择此文件夹'
        })

        return canceled ? defaultPath : filePaths[0]
    })
}
// 窗口控制函数
const setupWindowControls = () => {
    // 最小化窗口
    ipcMain.on('window-minimize', (event) => {
        const win = getWin(event)
        win.minimize()
    })

    // 最大化/还原窗口
    ipcMain.on('window-maximize', (event) => {
        const win = getWin(event)
        if (win.isMaximized()) {
            win.unmaximize()
        } else {
            win.maximize()
        }
    })

    // 关闭窗口
    ipcMain.on('window-close', (event) => {
        const win = getWin(event)
        win.close()
    })

    // 获取窗口最大化状态
    ipcMain.handle('window-is-maximized', (event) => {
        const win = getWin(event)
        return win.isMaximized()
    })
}
//获取磁盘空间
const getDiskSpace = () => {
    // 获取磁盘空间信息
    ipcMain.handle('get-disk-space', (event, folderPath) => {
        try {
            const stats = fs.statfsSync(folderPath)
            return {
                free: formatBytes(stats.bfree * stats.bsize),
                total: formatBytes(stats.blocks * stats.bsize),
                available: formatBytes(stats.bavail * stats.bsize),
                path: folderPath
            }
        } catch (error) {
            console.error('获取磁盘空间失败:', error)
            return { free: 0, total: 0, path: folderPath }
        }
    })
}
//下载
// 存储下载进度信息
const downloadProgress = new Map()
const downloadFile = () => {
    ipcMain.handle('start-download', async (event, { url, savePath }) => {
        const win = getWin(event)
        return new Promise((resolve) => {
            win.webContents.session.once('will-download', (e, item) => {
                // 检查磁盘空间
                const diskSpace = fs.statfsSync(path.dirname(savePath))
                const freeSpace = diskSpace.free * diskSpace.bsize
                if (freeSpace < item.getTotalBytes()) {
                    item.cancel()
                    resolve({ success: false, error: '磁盘空间不足' })
                    return
                }
                const fileName = item.getFilename()
                const savePathUrl = createUniquePath(savePath, fileName)
                console.log(savePathUrl)
                // 设置保存路径
                item.setSavePath(savePathUrl)
                // 初始化下载信息
                const downloadId = item.getURL() + Date.now()
                downloadProgress.set(downloadId, {
                    startTime: Date.now(),
                    lastUpdated: Date.now(),
                    lastBytes: 0,
                    speed: 0,
                    progress: 0
                })

                // 监听进度更新
                item.on('updated', (e, state) => {
                    if (state === 'progressing') {
                        const currentTime = Date.now()
                        const receivedBytes = item.getReceivedBytes()
                        const totalBytes = item.getTotalBytes()
 
                        // 获取下载信息
                        const progressInfo = downloadProgress.get(downloadId)
                        const timeDelta = (currentTime - progressInfo.lastUpdated) / 1000 // 秒
                        const bytesDelta = receivedBytes - progressInfo.lastBytes

                        // 计算速度（字节/秒）
                        let currentSpeed = bytesDelta / timeDelta
                        if (!isFinite(currentSpeed)) currentSpeed = 0

                        // 平滑速度（可选）
                        progressInfo.speed = progressInfo.speed
                            ? progressInfo.speed * 0.7 + currentSpeed * 0.3
                            : currentSpeed

                        // 计算进度
                        progressInfo.progress =
                            totalBytes > 0 ? (receivedBytes / totalBytes) * 100 : 0

                        // 更新记录
                        progressInfo.lastBytes = receivedBytes
                        progressInfo.lastUpdated = currentTime
                        // 发送进度到渲染进程
                        event.sender.send('download-progress', {
                            id: downloadId,
                            progress: progressInfo.progress,
                            speed: formatSpeed(progressInfo.speed),
                            received: formatBytes(receivedBytes),
                            total: formatBytes(totalBytes),
                            name: fileName
                        })
                    }
                })

                // 下载完成
                item.on('done', (e, state) => {
                    downloadProgress.delete(downloadId)
                    resolve({
                        state: state,
                        path: item.getSavePath(),
                        name: fileName
                    })
                })
            })

            // 触发下载
            win.webContents.downloadURL(url)
        })
    })
}
//打开web
const openWeb = () => {
    ipcMain.on('open-web', (event, url) => {
        console.log(url)
        shell.openExternal(url)
    })
}
export default {
    getDefaultPath,
    selectFolder,
    setupWindowControls,
    getDiskSpace,
    downloadFile,
    openWeb
}
