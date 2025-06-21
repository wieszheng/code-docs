/* .vitepress/theme/index.ts */
import DefaultTheme from 'vitepress/theme'
import { inBrowser } from 'vitepress'
import { watch } from 'vue';
import './style/index.css'
import Confetti from "./components/Confetti.vue"
import Layout from './components/Layout.vue'
import ArticleMetadata from "./components/ArticleMetadata.vue";

import { NProgress } from 'nprogress-v2/dist/index.js' // 进度条组件
import 'nprogress-v2/dist/index.css' // 进度条样式
import 'virtual:group-icons.css' //代码组样式
import "vitepress-markdown-timeline/dist/theme/index.css";


// 彩虹背景动画样式
let homePageStyle: HTMLStyleElement | undefined


export default {
    extends: DefaultTheme,
    Layout: Layout,
    enhanceApp({app, router }) {
        // 注册全局组件
        app.component('Confetti', Confetti)
        app.component('ArticleMetadata' , ArticleMetadata)
        if (inBrowser) {
            NProgress.configure({ showSpinner: false })
            router.onBeforeRouteChange = () => {
                NProgress.start() // 开始进度条
            }
            router.onAfterRouteChanged = () => {
                NProgress.done() // 停止进度条
            }
        }
        // 彩虹背景动画样式
        if (typeof window !== 'undefined') {
            watch(
                () => router.route.data.relativePath,
                () => updateHomePageStyle(location.pathname === '/'),
                { immediate: true },
            )
        }
    }
}


// 彩虹背景动画样式
function updateHomePageStyle(value: boolean) {
    if (value) {
        if (homePageStyle) return

        homePageStyle = document.createElement('style')
        homePageStyle.innerHTML = `
    :root {
      animation: rainbow 12s linear infinite;
    }`
        document.body.appendChild(homePageStyle)
    } else {
        if (!homePageStyle) return

        homePageStyle.remove()
        homePageStyle = undefined
    }
}