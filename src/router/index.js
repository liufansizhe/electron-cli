// 路由

import { createRouter, createWebHistory } from 'vue-router'

import isNewVersion from '@/utils/version'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'Home',
            component: () => import('@/views/HomeView.vue'),
            children: [
                {
                    path: '/demo',
                    meta: {
                        title: 'demo title',
                        description: 'demo description'
                    },
                    component: () => import('@/components/Demo/index.vue')
                }
            ]
        }
    ]
})
router.afterEach((to) => {
    const { title, keywords, description } = to.meta
    if (title) {
        document.title = title
    }
    if (keywords) {
        const metaKeywords = document.querySelector('meta[name="keywords"]')
        if (metaKeywords) {
            metaKeywords.content = keywords
        }
    }
    if (description) {
        const metaDescription = document.querySelector('meta[name="description"]')
        if (metaDescription) {
            metaDescription.content = description
        }
    }
})
router.beforeEach((to, from, next) => {
    isNewVersion()
    next()
})
export default router
