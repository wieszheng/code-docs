/* .vitepress/theme/index.ts */
import DefaultTheme from 'vitepress/theme'
import { watch } from 'vue';
import Confetti from "./components/Confetti.vue"
import Layout from './components/Layout.vue'
import './style/index.css'
import Update from "./components/Update.vue";
import ArticleMetadata from "./components/ArticleMetadata.vue";

// 彩虹背景动画样式
let homePageStyle: HTMLStyleElement | undefined

export default {
    extends: DefaultTheme,
    Layout: Layout,
    enhanceApp({app, router }) {
        // 注册全局组件
        app.component('Confetti', Confetti)
        app.component('Update' , Update)
        app.component('ArticleMetadata' , ArticleMetadata)

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