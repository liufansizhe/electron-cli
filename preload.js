// Electron 预加载脚本
const { ipcRenderer } = require('electron')

window.addEventListener('DOMContentLoaded', () => {
    // 暴露窗口控制API给渲染进程
    window.electronAPI = {
        // 最小化窗口
        minimize: () => ipcRenderer.send('window-minimize'),
        // 最大化/还原窗口
        maximize: () => ipcRenderer.send('window-maximize'),
        // 关闭窗口
        close: () => ipcRenderer.send('window-close'),
        // 获取窗口状态
        isMaximized: () => ipcRenderer.invoke('window-is-maximized')
    }
})
