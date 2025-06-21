import { defineConfig } from 'vitepress'
import { groupIconMdPlugin, groupIconVitePlugin, localIconLoader } from 'vitepress-plugin-group-icons'
import { devDependencies } from '../../package.json'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/code-docs/",
  title: "UTest",
  description: "UTest 一款Ai接口自动化测试平台。",
  //启用深色模式
  appearance: 'dark',
  cleanUrls: true,
  head: [
    ['link',{ rel: 'icon', href: 'logo-uwu.png'}],

  ],
  //markdown配置
  markdown: {
    //行号显示
    lineNumbers: true,

    // 组件插入h1标题下
    config: (md) => {
      md.use(groupIconMdPlugin) //代码组图标

      md.renderer.rules.heading_close = (tokens, idx, options, env, slf) => {
        let htmlResult = slf.renderToken(tokens, idx, options);
        if (tokens[idx].tag === 'h1') htmlResult += `<ArticleMetadata />`;
        return htmlResult;
      }
    }
  },
  vite: {
    plugins: [
      groupIconVitePlugin({
        customIcon: {
          ts: 'logos:typescript',
          js: 'logos:javascript', //js图标
          css: 'logos:css-3', //css图标
        },
      })
    ],
  },
  lastUpdated: true,

  themeConfig: {
    logo: '/logo-uwu.png',
    // siteTitle: false, //标题隐藏 //

    //本地搜索 //
    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "搜索文档",
            buttonAriaLabel: "搜索文档",
          },
          modal: {
            noResultsText: "无法找到相关结果",
            resetButtonTitle: "清除查询条件",
            footer: {
              selectText: "选择",
              navigateText: "切换",
            },
          },
        },
      },
    },

    lastUpdated: {
      text: '上次更新时间',
      formatOptions: {
        dateStyle: 'short', // 可选值full、long、medium、short
        timeStyle: 'medium' // 可选值full、long、medium、short
      },
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: `VitePress ${devDependencies.vitepress.replace('^', '')}`, link: 'https://vitepress.dev/zh/', noIcon: true },
      { text: 'Examples', link: '/adb-tutorial.md' },
      { text: '更新日志', link: '/changelog.md' },
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' },

        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/wieszheng' }
    ],
    //页脚
    footer: {
      message: 'Released under the MIT License.',
      copyright: `Copyright © 2024-${new Date().getFullYear()} wieszheng`,
    },
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '浅色模式',
    darkModeSwitchTitle: '深色模式',

    //侧边栏文字更改(移动端)
    sidebarMenuLabel: '菜单',

    //返回顶部文字修改(移动端)
    returnToTopLabel: '返回顶部',


    //大纲显示2-3级标题
    outline: {
      level: [2, 3],
      label: '目录'
    },


    //自定义上下页名
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },
  }
})
