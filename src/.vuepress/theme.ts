import { hopeTheme } from 'vuepress-theme-hope';
import navbar from './navbar.js';
import sidebar from './sidebar.js';

export default hopeTheme(
  {
    navbar,
    sidebar,
    breadcrumb: false,
    hostname: 'https://myblog-eyx.pages.dev',
    docsDir: 'src',
    iconAssets: 'fontawesome-with-brands',
    logo: '/assets/icon/logo.png',
    // repo: 'vuepress-theme-hope/vuepress-theme-hope',
    pageInfo: ['Category', 'Tag'],
    contributors: false, // disable the information of contributors
    footer: '',
    darkmode: 'disable',
    // displayFooter: true,
    copyright: false,
    blog: {
      description: '前端攻城狮',
      timeline: '时间轴'
      // intro: '/intro.html'
    },

    encrypt: {
      config: {
        '/encrypt/HMDownload.html': ['1234'],
        '/encrypt/HMMerge.html': ['1234']
      }
    },
    // metaLocales: {
    //   editLink: '在 GitHub 上编辑此页'
    // },
    plugins: {
      blog: {},
      // comment: {
      //   // You should generate and use your own comment service
      //   provider: 'Waline',
      //   serverURL: 'https://waline-comment.vuejs.press'
      // },

      // all features are enabled for demo, only preserve features you need here
      mdEnhance: {
        align: true,
        attrs: true,
        chart: true,
        codetabs: true,
        demo: true,
        echarts: true,
        figure: true,
        flowchart: true,
        gfm: true,
        imgLazyload: true,
        imgSize: true,
        include: true,
        katex: true,
        mark: true,
        mermaid: true,
        playground: {
          presets: ['ts', 'vue']
        },
        presentation: ['highlight', 'math', 'search', 'notes', 'zoom'],
        stylize: [
          {
            matcher: 'Recommended',
            replacer: ({ tag }) => {
              if (tag === 'em')
                return {
                  tag: 'Badge',
                  attrs: { type: 'tip' },
                  content: 'Recommended'
                };
            }
          }
        ],
        sub: true,
        sup: true,
        tabs: true,
        vPre: true,
        vuePlayground: true
      }

      // uncomment these if you want a PWA
      // pwa: {
      //   favicon: "/favicon.ico",
      //   cacheHTML: true,
      //   cachePic: true,
      //   appendBase: true,
      //   apple: {
      //     icon: "/assets/icon/apple-icon-152.png",
      //     statusBarColor: "black",
      //   },
      //   msTile: {
      //     image: "/assets/icon/ms-icon-144.png",
      //     color: "#ffffff",
      //   },
      //   manifest: {
      //     icons: [
      //       {
      //         src: "/assets/icon/chrome-mask-512.png",
      //         sizes: "512x512",
      //         purpose: "maskable",
      //         type: "image/png",
      //       },
      //       {
      //         src: "/assets/icon/chrome-mask-192.png",
      //         sizes: "192x192",
      //         purpose: "maskable",
      //         type: "image/png",
      //       },
      //       {
      //         src: "/assets/icon/chrome-512.png",
      //         sizes: "512x512",
      //         type: "image/png",
      //       },
      //       {
      //         src: "/assets/icon/chrome-192.png",
      //         sizes: "192x192",
      //         type: "image/png",
      //       },
      //     ],
      //     shortcuts: [
      //       {
      //         name: "Demo",
      //         short_name: "Demo",
      //         url: "/demo/",
      //         icons: [
      //           {
      //             src: "/assets/icon/guide-maskable.png",
      //             sizes: "192x192",
      //             purpose: "maskable",
      //             type: "image/png",
      //           },
      //         ],
      //       },
      //     ],
      //   },
      // },
    }
  },
  { custom: true }
);
