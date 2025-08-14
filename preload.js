// Electron 预加载脚本
const { ipcRenderer, contextBridge } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    // 最小化窗口
    minimize: () => ipcRenderer.send('window-minimize'),
    // 最大化/还原窗口
    maximize: () => ipcRenderer.send('window-maximize'),
    // 关闭窗口
    close: () => ipcRenderer.send('window-close'),
    // 获取窗口状态
    isMaximized: () => ipcRenderer.invoke('window-is-maximized'),
    //获取默认路径
    getDefaultPath: () => ipcRenderer.invoke('get-default-path'),
    //选择文件夹
    selectFolder: () => ipcRenderer.invoke('select-folder'),
    //获取磁盘空间
    getDiskSpace: (path) => ipcRenderer.invoke('get-disk-space', path),
    //下载
    download: (data) => ipcRenderer.invoke('start-download', data),
    //下载进度
    getDownloadProgress: (callback) => {
        ipcRenderer.on('download-progress', (event, data) => callback(data))
    },
    //打开web
    openWeb: (url) => {
        ipcRenderer.send('open-web', url)
    }
})
