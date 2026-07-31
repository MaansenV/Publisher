import { defineConfig } from 'vitepress'

// Deployed at https://maansenv.github.io/Publisher/ — sub-path base is load-bearing.
// Visual world: Character Select / Loadout Dossier — paper, ink, cobalt, vermilion, acid yellow.
// On-site publisher brand: vedaloiv.
const DIRECTION_CONTRACT = `<!--
THESIS: A Unity publisher page that feels like selecting a reliable loadout, not buying a black box. Refuses the dark SaaS template, the previous espresso/coral poster world, and fictional game UI.
OWN-WORLD: Paper-white field, ink-black type, cobalt primary actions, vermilion state markers, acid-yellow proof tags, crisp 2px rules, sharp dossier panels, and hard offset depth only where it anchors a real panel.
STORY: A skeptical Unity developer sees the real Easy FP Controller, understands its guided setup and documented capabilities, then chooses the Asset Store or docs with confidence.
FIRST VIEWPORT: Product-specific black headline on the left; a selected-asset dossier with the real Unity preview, version, requirements, tabs, and actions on the right; no generic slogan-first hero.
FORM: Character Select / Loadout Dossier — grounded direction 4 of 7; seed 97fcb31d; challenger hand considered Signal Bench, Technical Zine, and Tension Diagram.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
-->`

export default defineConfig({
  lang: 'en-US',
  title: 'vedaloiv',
  titleTemplate: 'vedaloiv — Unity Asset Store Publisher',
  description:
    'Unity Asset Store publisher page and asset documentation by vedaloiv. Less friction, more building — tools that lower the floor, with docs verified against the shipped source.',
  base: '/Publisher/',
  cleanUrls: true,
  lastUpdated: true,
  markdown: { theme: { light: 'github-dark', dark: 'github-dark' } },

  head: [
    ['meta', { name: 'theme-color', content: '#F4EFE5' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Bowlby+One+SC&family=DM+Mono:wght@400;500&family=Figtree:wght@400;500;600;700;800&display=swap'
      }
    ]
  ],

  themeConfig: {
    siteTitle: 'vedaloiv',

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

    sidebarMenuLabel: 'Menu',
    returnToTopLabel: 'Return to top',

    footer: {
      message: 'Unity Asset Store Publisher',
      copyright: 'Copyright © 2026 vedaloiv'
    }
  },

  // Inject the direction contract as the first child of <body> on the landing
  // page only (scoped by the landing-root marker). Survives the production build.
  transformHtml(code: string, _id: string) {
    if (!code.includes('id="vedaloiv-landing"')) return code
    return code.replace(/<body[^>]*>/, (m) => m + DIRECTION_CONTRACT)
  }
})
