import axios from 'axios'

const isNewVersion = () => {
    let baseUrl = `/version.json?t=${new Date().getTime()}`
    axios.get(baseUrl).then((res) => {
        if (res.status === 200) {
            let webappVersion = res?.data?.[import.meta.env.VITE_VERSION] ?? 1 //当前项目发布的版本
            let localWebappVersion = localStorage.getItem('webappVersion') //缓存中的版本

            if (localWebappVersion && localWebappVersion != webappVersion) {
                // 如果没有缓存版本 或者 缓存版本与当前项目发布版本不一致时 强行刷新
                localStorage.setItem('webappVersion', webappVersion)
                window.location.reload()
                return
            } else {
                localStorage.setItem('webappVersion', webappVersion)
            }
        }
    })
}
export default isNewVersion
