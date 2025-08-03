/*
 * @FilePath: \dev\src\services\request.js
 * @Version: 2.0
 * @LastEditors: lhl
 * @LastEditTime: 2022-04-24 10:34:57
 * @Description:
 */

import { ElMessage } from 'element-plus'
import axios from 'axios'
import config from './config'
import i18n from '@/language/index'
import qs from 'qs'

const Axios = axios.create(config)

// POST 传参序列化
Axios.interceptors.request.use(
    (config) => {
        if (config.headers['Content-Type'] == 'multipart/form-data') {
            return config
        }
        if (config.method === 'post') config.data = qs.stringify(config.data)
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// 返回结果处理
Axios.interceptors.response.use(
    (response) => {
        switch (response.status) {
            case 200: {
                if (response?.data?.code < 0) {
                    ElMessage.error(i18n.global.t(response?.data?.msg))
                    return { data: null }
                } else {
                    return { data: response?.data?.data ?? {}, msg: response?.data?.msg }
                }
            }
            default: {
                return { data: null }
            }
        }
    },
    (error) => {
        switch (error?.response?.status) {
            case 401: {
                ElMessage.error(i18n.global.t(error?.response?.data?.msg))
                return { data: null }
            }
            default: {
                ElMessage.error(i18n.global.t('Unknown Error'))
                return { data: null }
            }
        }
    }
)

export default Axios
