import mockjs from 'mockjs'
const { Random } = mockjs
export default [
    // 登录接口
    {
        url: '/api/login',
        method: 'post',
        timeout: 500, // 模拟网络延迟(ms)
        response: ({ body }) => {
            const { username, password } = body
            if (username === 'admin' && password === '123456') {
                return {
                    code: 200,
                    data: {
                        token: Random.guid(),
                        username: 'Admin'
                    }
                }
            }
            return { code: 401, message: '账号或密码错误' }
        }
    },
    // 获取用户信息
    {
        url: '/api/user/info',
        method: 'get',
        response: () => ({
            code: 200,
            data: {
                userId: Random.id(),
                name: Random.cname(),
                avatar: Random.image('200x200')
            }
        })
    }
]
