import { defineConfig } from 'vitepress'

// Deployed at https://maansenv.github.io/Publisher/ — sub-path base is load-bearing.
export default defineConfig({
  lang: 'en-US',
  title: 'Maansen',
  titleTemplate: 'Maansen — Unity Asset Store Publisher',
  description:
    'Unity Asset Store publisher page and asset documentation. First release: Easy FP Full Body Controller — a first-person full-body controller for URP.',
  base: '/Publisher/',
  cleanUrls: true,
  appearance: 'force-dark',
  lastUpdated: true,

  head: [
    ['meta', { name: 'theme-color', content: '#0A0A0A' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@400;500;600;700&display=swap'
      }
    ]
  ],

  themeConfig: {
    siteTitle: 'PUBLISHER',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Easy FP Controller', link: '/easy-fp-full-body-controller/', activeMatch: '/easy-fp-full-body-controller/' },
      {
        text: 'Asset Store',
        link: 'https://assetstore.unity.com/packages/tools/game-toolkits/easy-fp-full-body-controller-357454'
      }
    ],

    sidebar: {
      '/easy-fp-full-body-controller/': [
        {
          text: 'Easy FP Full Body Controller',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/easy-fp-full-body-controller/' },
            { text: 'Quick Start', link: '/easy-fp-full-body-controller/quick-start' },
            { text: 'Interfaces', link: '/easy-fp-full-body-controller/interfaces' }
          ]
        }
      ]
    },

    search: { provider: 'local' },

    socialLinks: [{ icon: 'github', link: 'https://github.com/MaansenV' }],

    outline: { level: [2, 3], label: 'On this page' },

    docFooter: { prev: 'Previous', next: 'Next' },

    darkModeSwitchLabel: 'Appearance',
    sidebarMenuLabel: 'Menu',
    returnToTopLabel: 'Return to top',

    footer: {
      message: 'Unity Asset Store Publisher',
      copyright: 'Copyright © 2026 Maansen'
    }
  }
})
