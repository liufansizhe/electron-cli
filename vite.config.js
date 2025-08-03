import { URL, fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import basicSsl from '@vitejs/plugin-basic-ssl'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import fs from 'fs'
import path from 'path'
import postCssPxToRem from 'postcss-pxtorem'
import seoPrerender from 'vite-plugin-seo-prerender'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'
import { viteMockServe } from 'vite-plugin-mock'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, process.cwd())
    let config = {}
    console.log('环境信息：', process.env.NODE_ENV, command, env, mode)

    if (process.env.NODE_ENV == 'production') {
        config = {
            base: '/',
            build: {
                output: {
                    manualChunks: {
                        // vue vue-router合并打包
                        vue: ['vue', 'vue-router'],
                        lodash: ['lodash']
                    }
                },
                outDir: path.resolve(__dirname, 'dist'),
                cssCodeSplit: true,
                rollupOptions: {
                    input: 'index.html',
                    output: {
                        // 静态资源打包做处理
                        chunkFileNames: 'static/js/[name]-[hash].js',
                        entryFileNames: 'static/js/[name]-[hash].js',
                        assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
                        manualChunks(id) {
                            if (id.includes('node_modules')) {
                                return id
                                    .toString()
                                    .split('node_modules/')[1]
                                    .split('/')[0]
                                    .toString()
                            }
                        }
                    }
                }
            },
            devServer: {
                client: {
                    overlay: false // 编译错误时，取消全屏覆盖（建议关掉）
                }
            },
            css: {
                postcss: {
                    plugins: [
                        postCssPxToRem({
                            rootValue: 192,
                            propList: ['*']
                        })
                    ]
                }
            },
            plugins: [
                vue(),
                seoPrerender({
                    callback: (html, route) => {
                        return html.replace(
                            /(<html.*?)(style=".*?")/,
                            '$1 style="font-size:192px;"'
                        )
                    },
                    routes: [] // 需要生成的路由
                }),
                createSvgIconsPlugin({
                    // 指定需要缓存的图标文件夹
                    iconDirs: [path.resolve(process.cwd(), 'src/assets/svg')],
                    // 指定symbolId格式
                    symbolId: '[name]'
                }),
                AutoImport({
                    resolvers: [ElementPlusResolver()]
                }),
                Components({
                    resolvers: [ElementPlusResolver()]
                }),
                viteCompression({
                    verbose: true,
                    disable: false,
                    threshold: 10240,
                    algorithm: 'gzip',
                    ext: '.gz'
                    // deleteOriginFile: true
                }),
                visualizer({ open: false })
            ],
            resolve: {
                alias: {
                    '@': fileURLToPath(new URL('./src', import.meta.url))
                }
            },
            esbuild: {
                drop: ['console', 'debugger']
            }
        }
    } else {
        const plugins = [
            vue(),
            basicSsl(),
            createSvgIconsPlugin({
                // 指定需要缓存的图标文件夹
                iconDirs: [path.resolve(process.cwd(), 'src/assets/svg')],
                // 指定symbolId格式
                symbolId: '[name]'
            }),
            AutoImport({
                resolvers: [ElementPlusResolver()]
            }),
            Components({
                resolvers: [ElementPlusResolver()]
            })
        ]
        if (mode == 'mock') {
            plugins.push(
                viteMockServe({
                    mockPath: 'src/mock', // Mock文件存放目录
                    localEnabled: true, // 开发环境启用Mock
                    logger: true // 控制台显示请求日志
                })
            )
        }
        config = {
            devServer: {
                client: {
                    overlay: false // 编译错误时，取消全屏覆盖（建议关掉）
                }
            },
            server: {
                host: '0.0.0.0',
                port: '8080',
                proxy: {
                    // 在此处编写代理规则
                    '/api': {
                        target: env.VITE_API_URL,
                        changeOrigin: true,
                        bypass(req, res, options) {
                            const proxyURL = options.target + options.rewrite(req.url)
                            res.setHeader('x-req-proxyURL', proxyURL) // 将真实请求地址设置到响应头中
                        },
                        rewrite: (path) => {
                            return path.replace(/\/api/, '')
                        },
                        secure: false
                    }
                },

                https: true
            },
            css: {
                postcss: {
                    plugins: [
                        postCssPxToRem({
                            rootValue: 192,
                            propList: ['*']
                        })
                    ]
                }
            },
            plugins,
            resolve: {
                alias: {
                    '@': fileURLToPath(new URL('./src', import.meta.url))
                }
            }
        }
    }
    // 如果当前时打包行为 生成最新版本号
    if (command == 'build') {
        let data = {}
        if (fs.existsSync('./public/version.json')) {
            data = JSON.parse(fs.readFileSync('./public/version.json')) ?? {}
        }
        //打包时生成版本号
        let version = Object.assign(data, {
            [env.VITE_VERSION]: JSON.stringify(new Date().getTime())
        })
        fs.writeFile(`./public/version.json`, JSON.stringify(version), () => {
            console.log('新版本号生成成功', version)
        })
    }
    return config
})
