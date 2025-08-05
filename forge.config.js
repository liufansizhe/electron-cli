import { FuseV1Options, FuseVersion } from '@electron/fuses'

import { FusesPlugin } from '@electron-forge/plugin-fuses'

export default {
    packagerConfig: {
        files: [
            'dist/*', // 包含 Vue 构建产物
            'package.json'
        ],
        asar: true,
        // icon: 'path/to/your/icon.ico', // Windows icon path
        osxIcon: './src/assets/dmg-bg.icns', // MacOS icon path, if different from Windows icon path
        win32metadata: {
            // Optional metadata for Windows executable icon (if needed)
            // icon: 'path/to/your/icon.ico'
        }
    },
    rebuildConfig: {},
    makers: [
        // Windows 配置
        {
            name: '@electron-forge/maker-squirrel',
            config: {
                name: 'MyApp',
                platforms: ['win32']
                // certificateFile: './certs/win.pfx', // 签名证书
                // certificatePassword: process.env.WIN_CERT_PWD
            }
        },
        // macOS 配置
        {
            name: '@electron-forge/maker-dmg',
            config: {
                background: './src/assets/dmg-bg.png', // DMG 背景图
                format: 'ULFO' // 压缩格式
            }
        },
        // 跨平台 ZIP 包（可选）
        {
            name: '@electron-forge/maker-zip',
            platforms: ['darwin', 'win32'] // 指定平台
        }
    ],
    plugins: [
        {
            name: '@electron-forge/plugin-auto-unpack-natives',
            config: {}
        },
        // Fuses are used to enable/disable various Electron functionality
        // at package time, before code signing the application
        new FusesPlugin({
            version: FuseVersion.V1,
            [FuseV1Options.RunAsNode]: false,
            [FuseV1Options.EnableCookieEncryption]: true,
            [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
            [FuseV1Options.EnableNodeCliInspectArguments]: false,
            [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
            [FuseV1Options.OnlyLoadAppFromAsar]: true
        })
    ]
}
