export default {
    // baseURL:
    //   process.env.NODE_ENV === 'development'
    //     ? 'development base_url'
    //     : 'production base_url',
    baseURL: process.env.NODE_ENV === 'development' ? '/api' : import.meta.env.VITE_API_URL, // api的base_url
    // 自定义的请求头
    headers: {
        post: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
    },
    // 超时设置
    // timeout: 10000,
    // 跨域是否带Token
    withCredentials: true,
    // 响应的数据格式 json / blob /document /arraybuffer / text / stream
    responseType: 'json'
}
