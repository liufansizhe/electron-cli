import 'element-plus/dist/index.css'
import '@/styles/common.scss'
import 'virtual:svg-icons-register'
import 'amfe-flexible'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import * as directive from '@/utils/directive'

import App from './App.vue'
import SvgIcon from './components/Icon/index.vue'
import VueI18n from '@/language'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'

const app = createApp(App)

window.document.documentElement.setAttribute('data-theme', import.meta.env?.VITE_THEME)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
for (const [key, component] of Object.entries(directive)) {
    app.directive(key, component)
}

app.config.globalProperties.$changeTheme = (type) => {
    window.document.documentElement.setAttribute('data-theme', type)
}

app.component('svg-icon', SvgIcon)
app.use(VueI18n).use(createPinia()).use(router).mount('#app')
