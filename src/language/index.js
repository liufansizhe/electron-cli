import { createI18n } from 'vue-i18n' // 引入vue-i18n组件
import en from './lang/en'
import de from './lang/de'
import es from './lang/es'
import fr from './lang/fr'
import ja from './lang/ja'
import zh from './lang/zh'
const lang = 'en'
const i18n = createI18n({
    legacy: false,
    locale: lang, // 默认显示语音
    messages: {
        en, // 英文——美式
        de, //德语
        es, //阿斯图里亚斯语
        fr, //法语
        ja, //日语
        zh //中文
    }
})
export const languageObj = {
    de: 'Deutsch',
    en: 'English',
    fr: 'Français',
    ja: '日本語',
    es: 'Español',
    zh: '简体中文'
}
export default i18n
