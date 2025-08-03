# ai-web

## 前端技术架构
vue3
vite
vue-router
pinia
axios
scss
## 调试与发布
```js
//本地代理开发服
npm run dev
//avc 生产打包
npm run build
```


## 国际化方案
### 依赖 vue-i18n
npm install vue-i18n@next
### 语言配置
```ts
//src\language\lang\en.ts
export default {
  language: '中文',
  header: {
    welcome: 'Welcome to the responsive  spa ssr  website！',
    skin: 'Skin',
    lifePerception:
      'An original front-end technology blog dedicated to sharing primary source on the way to front-end learning. Focus on Web front-end development, mobile development, front-end engineering, front-end career development, do the most valuable front-end technology learning site.',
    blogger: 'Front End · Yang',
    blogTips: 'Focus on the latest front-end technology!'
  }
};

//src\language\lang\zh_CN.ts
export default {
  language: 'English',
  header: {
    welcome: '欢迎访问响应式SPA SSR网站！',
    skin: '换肤',
    lifePerception:
      '原创前端技术博客，致力于分享前端学习路上的第一手资料。专注 web 前端开发、移动端开发、前端工程化、前端职业发展，做最有价值的前端技术学习网站。',
    blogger: '前端·小阳仔',
    blogTips: '关注互联网和前端开发技术的博客网站！'
  }
};

//src\language\index.ts
import { createI18n } from 'vue-i18n'; // 引入vue-i18n组件
import zh_CN from './lang/zh_CN';
import en from './lang/en';
const lang = 'zh_CN';
 
const i18n = createI18n({
  locale: lang, // 默认显示语音
  messages: {
    zh_CN, // 中文
 
    en // 英文——美式
  }
});
 
export default i18n;
```
### vue3 配置
```ts
import App from "./App.vue";
import VueI18n from '../language';
const app = createApp(App);
app.use(VueI18n);
```
### 使用
#### 模板使用
```html
 <p>{{ $t(`header.welcome`) }}</p>
```
#### 动态使用
```ts
<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { useI18n } from "vue-i18n"; //要在js中使用国际
export default defineComponent({
  name: 'Header',
  setup() {
    const { t } = useI18n();
    const headerData = reactive({
      navbarData: [
        {
          name: t("navbar.home"),
          path: '/',
          active: true,
          blog: true,
          class: 'home-style'
        },
      ]
    });
  }
});
</script>
```
#### 切换语言
```ts
<template>
  <span class="language-text cur-pointer m-r-10" @click="setLang()">{{ $t(`language`) }}</span>
</template>
 
<script lang="ts">
import { defineComponent, getCurrentInstance } from 'vue';
export default defineComponent({
  name: 'Langage',
  setup() {
    const { proxy } = getCurrentInstance() as any;
    let lang = 'zh_CN';
    const setLang = () => {
      if (lang === 'zh_CN') {
        proxy.$i18n.locale = 'en';
      } else {
        proxy.$i18n.locale = 'zh_CN';
      }
      lang = proxy.$i18n.locale;
      localStorage.setItem('lang', lang);
    };
 
    return {
      setLang
    };
  }
});
</script>
```