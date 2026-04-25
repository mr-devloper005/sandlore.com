import { defineSiteTheme } from '@/config/site.theme.defaults'

export const SITE_THEME = defineSiteTheme({
  shell: 'editorial',
  hero: {
    variant: 'spotlight-split',
    eyebrow: 'Quiet editorial journal',
  },
  home: {
    layout: 'editorial-rhythm',
    primaryTask: 'article',
    featuredTaskKeys: ['article', 'comment', 'pdf'],
  },
  navigation: {
    variant: 'editorial',
  },
  footer: {
    variant: 'editorial',
  },
  cards: {
    listing: 'catalog-grid',
    article: 'editorial-feature',
    image: 'studio-panel',
    profile: 'listing-elevated',
    classified: 'catalog-grid',
    pdf: 'listing-elevated',
    sbm: 'editorial-feature',
    social: 'editorial-feature',
    org: 'listing-elevated',
    comment: 'editorial-feature',
  },
})
