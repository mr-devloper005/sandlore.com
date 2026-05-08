import type { TaskKey } from '@/lib/site-config'

export const siteContent = {
  navbar: {
    tagline: 'Issue notes, essays, and slower reading',
  },
  footer: {
    tagline: 'A slower journal of stories and image-led notes',
  },
  hero: {
    badge: 'Current issue',
    title: ['A journal for', 'quiet stories and visual essays.'],
    description:
      'Read carefully framed stories, interviews, and image-led features arranged with the pace of a print publication rather than a feed.',
    primaryCta: {
      label: 'Open the issue',
      href: '/articles',
    },
    secondaryCta: {
      label: 'Search the archive',
      href: '/search',
    },
    searchPlaceholder: 'Search essays, interviews, places, and notes',
    focusLabel: 'Issue focus',
    featureCardBadge: 'cover story',
    featureCardTitle: 'A reading-first cover keeps the newest feature at the center of the issue.',
    featureCardDescription:
      'The latest story leads visually, while the rest of the archive stays easy to discover without turning the homepage into a dashboard.',
  },
  home: {
    metadata: {
      title: 'A quiet journal of stories, essays, and visual notes',
      description:
        'Sandlore is a slower editorial journal for essays, interviews, field notes, and image-led features with a premium reading-first presentation.',
      openGraphTitle: 'A quiet journal of stories, essays, and visual notes',
      openGraphDescription:
        'Discover articles, visual notes, and connected archival surfaces through a refined magazine-style reading experience.',
      keywords: ['editorial journal', 'article magazine', 'long-form essays', 'visual features', 'reading archive'],
    },
    introBadge: 'About the journal',
    introTitle: 'Built like an issue-driven publication, with room for image, pace, and atmosphere.',
    introParagraphs: [
      'Sandlore is designed as an editorial object first: large headings, generous margins, quieter controls, and a clearer distinction between lead stories, archive entries, and supporting surfaces.',
      'The site still supports every task in the system, but the public-facing experience privileges reading comfort, visual hierarchy, and a calmer issue-like structure.',
      'Whether a visitor starts with an essay, a search query, or a linked supporting page, the experience keeps the publication voice intact instead of reverting to generic platform chrome.',
    ],
    sideBadge: 'At a glance',
    sidePoints: [
      'Lead-story homepage with issue-style hierarchy.',
      'Article-first navigation and quieter utility controls.',
      'Distinct list and detail shells for archive, search, and supporting tasks.',
      'Lightweight motion, strong contrast, and print-inspired spacing.',
    ],
    primaryLink: {
      label: 'Browse the archive',
      href: '/articles',
    },
    secondaryLink: {
      label: 'Search the site',
      href: '/search',
    },
  },
  cta: {
    badge: 'Read next',
    title: 'Settle into essays, reports, interviews, and slower visual storytelling.',
    description:
      'The archive stays fully connected under the hood, but the front-end experience is tuned for reading comfort, editorial rhythm, and deliberate discovery.',
    primaryCta: {
      label: 'Read Articles',
      href: '/articles',
    },
    secondaryCta: {
      label: 'Search Archive',
      href: '/search',
    },
  },
  taskSectionHeading: 'Latest {label}',
  taskSectionDescriptionSuffix: 'Browse the newest entries in this section.',
} as const

export const taskPageMetadata: Record<Exclude<TaskKey, 'comment' | 'org' | 'social'>, { title: string; description: string }> = {
  article: {
    title: 'Articles and stories',
    description: 'Read essays, dispatches, interviews, and long-form stories in a calmer editorial archive.',
  },
  listing: {
    title: 'Listings and discoverable pages',
    description: 'Browse supporting listings and structured pages presented with stronger editorial framing.',
  },
  classified: {
    title: 'Classifieds and announcements',
    description: 'Scan announcements, notices, and timely posts in a tighter bulletin-style presentation.',
  },
  image: {
    title: 'Images and visual posts',
    description: 'Explore image-led posts and visual stories in a darker gallery-driven layout.',
  },
  profile: {
    title: 'Profiles and public pages',
    description: 'Discover public profiles and identity-led pages presented with stronger portrait and reputation cues.',
  },
  sbm: {
    title: 'Curated links and saved resources',
    description: 'Browse references, bookmarked links, and curated resources as a calm library-like archive.',
  },
  pdf: {
    title: 'PDFs and downloadable resources',
    description: 'Open reports, documents, and downloadable resources in a document-led archive layout.',
  },
}

export const taskIntroCopy: Record<
  TaskKey,
  { title: string; paragraphs: string[]; links: { label: string; href: string }[] }
> = {
  listing: {
    title: 'Listings, services, and structured pages',
    paragraphs: [
      'This section holds structured pages, references, and directory-style entries that support the wider editorial experience.',
      'The layout is denser and more utility-minded than the article archive, but it still carries the same restrained typography and quieter pacing.',
      'Use it when you want quicker scanning, stronger metadata, and clearer links back into the publication.',
    ],
    links: [
      { label: 'Read articles', href: '/articles' },
      { label: 'Search archive', href: '/search' },
      { label: 'View profiles', href: '/profile' },
    ],
  },
  article: {
    title: 'Articles, stories, and long-form reading',
    paragraphs: [
      'This archive is shaped for essays, interviews, reports, and slower reading, with more space for typography and narrative setup.',
      'Lead stories are given room to breathe, while the wider archive keeps categories, tags, and related posts easy to navigate.',
      'Use it to browse thoughtful writing first, then move into search, documents, or supporting task pages when you need more context.',
    ],
    links: [
      { label: 'Search archive', href: '/search' },
      { label: 'Open images', href: '/images' },
      { label: 'Browse resources', href: '/pdf' },
    ],
  },
  classified: {
    title: 'Classifieds, offers, and timely updates',
    paragraphs: [
      'Classified posts surface timely notices, offers, and short-lived opportunities in a compact bulletin rhythm.',
      'Compared with the article archive, this page is intentionally tighter, faster, and more notice-board like.',
      'Browse by category when you want immediacy, then step back into articles or search for broader context.',
    ],
    links: [
      { label: 'Business listings', href: '/listings' },
      { label: 'Read articles', href: '/articles' },
      { label: 'Search archive', href: '/search' },
    ],
  },
  image: {
    title: 'Image-led posts and visual stories',
    paragraphs: [
      'Images take the lead here through darker galleries, larger media blocks, and quieter surrounding chrome.',
      'The goal is to make visual work feel immersive and materially different from the print-like article archive.',
      'Browse the latest visual pieces, then continue into related stories or supporting pages when you want more context.',
    ],
    links: [
      { label: 'Read articles', href: '/articles' },
      { label: 'Search archive', href: '/search' },
      { label: 'Open classifieds', href: '/classifieds' },
    ],
  },
  profile: {
    title: 'Profiles, identities, and public pages',
    paragraphs: [
      'Profiles bring the person, studio, brand, or institution behind the work into clearer focus.',
      'These pages use stronger portrait framing and quieter metadata so identity reads as part of the publication rather than a utility profile.',
      'Browse profiles to understand authorship and reputation, then continue into related stories and references.',
    ],
    links: [
      { label: 'Open listings', href: '/listings' },
      { label: 'Read articles', href: '/articles' },
      { label: 'Browse images', href: '/images' },
    ],
  },
  sbm: {
    title: 'Curated links and bookmarked resources',
    paragraphs: [
      'This section collects references, links, and saved resources in a calmer library-like format.',
      'It is lighter, more textual, and less image-heavy than the rest of the site so collections feel ordered instead of feed-driven.',
      'Use it to follow trails, revisit sources, and move back into essays or documents when you need deeper context.',
    ],
    links: [
      { label: 'Browse articles', href: '/articles' },
      { label: 'Search archive', href: '/search' },
      { label: 'Open PDFs', href: '/pdf' },
    ],
  },
  pdf: {
    title: 'PDFs, documents, and downloadable files',
    paragraphs: [
      'The document archive holds reports, guides, and downloadable files in a presentation that feels closer to an index than a feed.',
      'These pages are intentionally quieter and more text-led, with stronger document cues and reduced visual noise.',
      'Browse by category to find useful files quickly, then continue into articles or search when you want wider context.',
    ],
    links: [
      { label: 'Read articles', href: '/articles' },
      { label: 'Search archive', href: '/search' },
      { label: 'Explore profiles', href: '/profile' },
    ],
  },
  social: {
    title: 'Short updates and community signals',
    paragraphs: [
      'Short updates add quick signals and reactions without taking over the quieter tone of the wider publication.',
      'They work as lighter entry points into stories, resources, and follow-up reading.',
      'Use them when you want a more immediate layer beneath the longer-form archive.',
    ],
    links: [
      { label: 'Read articles', href: '/articles' },
      { label: 'Search archive', href: '/search' },
      { label: 'View PDFs', href: '/pdf' },
    ],
  },
  comment: {
    title: 'Comments and contextual responses',
    paragraphs: [
      'Comments keep responses close to the writing they belong to, preserving context instead of sending discussion elsewhere.',
      'This page behaves more like an annotations desk than a standalone social feed.',
      'Use it as a supporting layer beneath stories, then return to the main archive for deeper reading.',
    ],
    links: [
      { label: 'Explore articles', href: '/articles' },
      { label: 'Search archive', href: '/search' },
      { label: 'See classifieds', href: '/classifieds' },
    ],
  },
  org: {
    title: 'Organizations, teams, and structured entities',
    paragraphs: [
      'Organization pages provide a structured surface for teams, studios, brands, and institutions connected to the archive.',
      'They sit between a profile and a directory entry, giving collective entities a clearer editorial frame.',
      'Use them to connect people, places, and stories without falling back to generic corporate profile layouts.',
    ],
    links: [
      { label: 'Read articles', href: '/articles' },
      { label: 'Business listings', href: '/listings' },
      { label: 'PDF library', href: '/pdf' },
    ],
  },
}
