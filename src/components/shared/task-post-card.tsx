import { ContentImage } from '@/components/shared/content-image'
import Link from 'next/link'
import { ArrowUpRight, ExternalLink, FileText, Mail, MapPin, Tag } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import type { TaskKey } from '@/lib/site-config'
import { SITE_THEME } from '@/config/site.theme'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { TASK_POST_CARD_OVERRIDE_ENABLED, TaskPostCardOverride } from '@/overrides/task-post-card'

type ListingContent = {
  location?: string
  category?: string
  description?: string
  email?: string
}

const stripHtml = (value?: string | null) =>
  (value || '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<\/?[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const getExcerpt = (value?: string | null, maxLength = 140) => {
  const text = stripHtml(value)
  if (!text) return ''
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength).trimEnd()}…`
}

const getContent = (post: SitePost): ListingContent => {
  const content = post.content && typeof post.content === 'object' ? post.content : {}
  return content as ListingContent
}

const getImageUrl = (post: SitePost, content: ListingContent) => {
  const media = Array.isArray(post.media) ? post.media : []
  const mediaUrl = media[0]?.url
  if (mediaUrl) return mediaUrl

  const contentAny = content as Record<string, unknown>
  const contentImage = typeof contentAny.image === 'string' ? contentAny.image : null
  if (contentImage) return contentImage

  const contentImages = Array.isArray(contentAny.images) ? contentAny.images : []
  const firstImage = contentImages.find((value) => typeof value === 'string')
  if (firstImage) return firstImage as string

  const contentLogo = typeof contentAny.logo === 'string' ? contentAny.logo : null
  if (contentLogo) return contentLogo

  return '/placeholder.svg?height=640&width=960'
}

const cardStyles = {
  'listing-elevated': {
    frame: 'rounded-[2.5rem] border border-slate-200/60 bg-gradient-to-br from-white to-slate-50/50 shadow-[0_25px_80px_rgba(15,23,42,0.12)] hover:-translate-y-2 hover:shadow-[0_35px_100px_rgba(15,23,42,0.18)] transition-all duration-500',
    muted: 'text-slate-600',
    title: 'text-slate-950',
    badge: 'bg-slate-950 text-white',
  },
  'editorial-feature': {
    frame: 'rounded-[2.5rem] border border-[#EDDCC6]/60 bg-gradient-to-br from-[#FFF4EA] via-[#FFFEFA] to-[#EDDCC6] shadow-[0_25px_80px_rgba(126,172,181,0.18)] hover:-translate-y-2 hover:shadow-[0_35px_100px_rgba(126,172,181,0.25)] transition-all duration-500',
    muted: 'text-[#7EACB5]',
    title: 'text-[#BF4646]',
    badge: 'bg-[#BF4646] text-[#FFF4EA]',
  },
  'studio-panel': {
    frame: 'rounded-[2.5rem] border border-white/20 bg-gradient-to-br from-[rgba(7,17,31,0.98)] via-[rgba(12,23,43,0.98)] to-[rgba(15,23,42,0.98)] text-white shadow-[0_30px_90px_rgba(15,23,42,0.4)] hover:-translate-y-2 hover:shadow-[0_40px_120px_rgba(15,23,42,0.5)] transition-all duration-500',
    muted: 'text-slate-300',
    title: 'text-white',
    badge: 'bg-[#8df0c8] text-[#07111f]',
  },
  'catalog-grid': {
    frame: 'rounded-[2.5rem] border border-[rgba(67,78,41,0.2)] bg-gradient-to-br from-[#f8faf1] via-[#edf5dc] to-[#e8f0d8] shadow-[0_25px_80px_rgba(55,65,31,0.15)] hover:-translate-y-2 hover:shadow-[0_35px_100px_rgba(55,65,31,0.2)] transition-all duration-500',
    muted: 'text-[#5b664c]',
    title: 'text-[#1f2617]',
    badge: 'bg-[#1f2617] text-[#edf5dc]',
  },
} as const

const getVariantForTask = (taskKey: TaskKey) => SITE_THEME.cards[taskKey] || 'listing-elevated'

export function TaskPostCard({
  post,
  href,
  taskKey,
  compact,
}: {
  post: SitePost
  href: string
  taskKey?: TaskKey
  compact?: boolean
}) {
  if (TASK_POST_CARD_OVERRIDE_ENABLED) {
    return <TaskPostCardOverride post={post} href={href} taskKey={taskKey} compact={compact} />
  }

  const content = getContent(post)
  const image = getImageUrl(post, content)
  const rawCategory = content.category || post.tags?.[0] || 'Post'
  const normalizedCategory = normalizeCategory(rawCategory)
  const category = CATEGORY_OPTIONS.find((item) => item.slug === normalizedCategory)?.name || rawCategory
  const variant = taskKey || 'listing'
  const visualVariant = cardStyles[getVariantForTask(variant)]
  const isBookmarkVariant = variant === 'sbm' || variant === 'social'
  const imageAspect = variant === 'image' ? 'aspect-[4/5]' : variant === 'article' ? 'aspect-[16/10]' : variant === 'pdf' ? 'aspect-[4/5]' : variant === 'classified' ? 'aspect-[16/11]' : 'aspect-[4/3]'
  const altText = `${post.title} ${category} ${variant === 'listing' ? 'business listing' : variant} image`
  const imageSizes = variant === 'article' ? '(max-width: 640px) 90vw, (max-width: 1024px) 48vw, 420px' : variant === 'image' ? '(max-width: 640px) 82vw, (max-width: 1024px) 34vw, 320px' : '(max-width: 640px) 85vw, (max-width: 1024px) 42vw, 340px'

  const { recipe } = getFactoryState()
  const isDirectoryProduct = recipe.homeLayout === 'listing-home' || recipe.homeLayout === 'classified-home'
  const isDirectorySurface = isDirectoryProduct && (variant === 'listing' || variant === 'classified' || variant === 'profile')

  if (isDirectorySurface) {
    const cardTone = recipe.brandPack === 'market-utility'
      ? {
          frame: 'rounded-[2.5rem] border border-[#d7deca]/60 bg-gradient-to-br from-white via-[#edf5dc]/20 to-[#e8f0d8]/50 shadow-[0_25px_80px_rgba(64,76,34,0.12)] hover:-translate-y-2 hover:shadow-[0_35px_100px_rgba(64,76,34,0.18)] transition-all duration-500',
          badge: 'bg-[#1f2617] text-[#edf5dc]',
          muted: 'text-[#5b664c]',
          title: 'text-[#1f2617]',
          cta: 'text-[#1f2617]',
        }
      : {
          frame: 'rounded-[2.5rem] border border-slate-200/60 bg-gradient-to-br from-white via-slate-50/50 to-slate-100/30 shadow-[0_25px_80px_rgba(15,23,42,0.12)] hover:-translate-y-2 hover:shadow-[0_35px_100px_rgba(15,23,42,0.18)] transition-all duration-500',
          badge: 'bg-slate-950 text-white',
          muted: 'text-slate-600',
          title: 'text-slate-950',
          cta: 'text-slate-950',
        }

    return (
      <Link href={href} className={`group flex h-full flex-col overflow-hidden transition duration-300 ${cardTone.frame}`}>
        <div className="relative aspect-[16/11] overflow-hidden bg-slate-100">
          <ContentImage src={image} alt={altText} fill sizes={imageSizes} quality={75} className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" intrinsicWidth={960} intrinsicHeight={720} />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
            <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${cardTone.badge}`}>
              <Tag className="h-3.5 w-3.5" />
              {category}
            </span>
            <span className="rounded-full bg-white/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-900">
              {variant === 'classified' ? 'Open now' : 'Verified'}
            </span>
          </div>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className={`line-clamp-2 text-xl font-semibold leading-snug ${cardTone.title}`}>{post.title}</h3>
            <ArrowUpRight className={`h-5 w-5 shrink-0 ${cardTone.muted}`} />
          </div>
          <p className={`mt-3 line-clamp-3 text-sm leading-7 ${cardTone.muted}`}>{getExcerpt(content.description || post.summary) || 'Explore this local listing.'}</p>
          <div className="mt-5 flex flex-wrap gap-3 text-xs">
            {content.location ? <span className={`inline-flex items-center gap-1 ${cardTone.muted}`}><MapPin className="h-3.5 w-3.5" />{content.location}</span> : null}
            {content.email ? <span className={`inline-flex items-center gap-1 ${cardTone.muted}`}><Mail className="h-3.5 w-3.5" />{content.email}</span> : null}
          </div>
          <div className={`mt-auto pt-5 text-sm font-semibold ${cardTone.cta}`}>{variant === 'classified' ? 'View offer' : 'View details'}</div>
        </div>
      </Link>
    )
  }

  if (isBookmarkVariant) {
    return (
      <Link href={href} className="group flex h-full flex-row items-start gap-5 overflow-hidden rounded-[2.5rem] border border-[#EDDCC6]/60 bg-gradient-to-br from-[#FFF4EA] via-[#FFFEFA] to-[#EDDCC6] p-6 text-[#BF4646] shadow-[0_25px_80px_rgba(126,172,181,0.18)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_35px_100px_rgba(126,172,181,0.25)] relative">
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#BF4646]/5 via-transparent to-[#7EACB5]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem] pointer-events-none" />
        
        <div className="relative z-10 mt-1 rounded-full bg-white/80 backdrop-blur-sm p-3 text-current transition-all duration-300 group-hover:scale-110 group-hover:bg-white/90 group-hover:shadow-lg">
          <ExternalLink className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1 relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#BF4646]/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#BF4646] border border-[#BF4646]/20">
              <span className="w-2 h-2 bg-[#BF4646] rounded-full animate-pulse" />
              {category}
            </span>
            {content.location ? <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/60 backdrop-blur-sm text-xs text-[#7EACB5] font-medium"><MapPin className="h-3.5 w-3.5" />{content.location}</span> : null}
          </div>
          <h3 className="mt-2 line-clamp-2 text-xl font-bold leading-tight text-[#BF4646] group-hover:text-[#ab3e3e] transition-colors duration-300">{post.title}</h3>
          <p className="mt-3 line-clamp-3 text-sm leading-[1.8] text-[#7EACB5] font-medium">{getExcerpt(content.description || post.summary, compact ? 120 : 180) || 'Explore this bookmark.'}</p>
          {content.email ? <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 backdrop-blur-sm text-xs text-[#7EACB5] font-medium"><Mail className="h-3.5 w-3.5" />{content.email}</div> : null}
        </div>
      </Link>
    )
  }

  if (variant === 'article' || variant === 'comment') {
    return (
      <Link href={href} className="group flex h-full overflow-hidden rounded-none bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all duration-500 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] relative">
        {/* Unique split layout design */}
        <div className="flex h-full">
          {/* Left side - Image with unique treatment */}
          <div className="relative w-2/5 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#BF4646] to-[#7EACB5] opacity-90" />
            <ContentImage 
              src={image} 
              alt={altText} 
              fill 
              sizes={imageSizes} 
              quality={90} 
              className="object-cover mix-blend-overlay transition-all duration-700 group-hover:scale-[1.05]" 
              intrinsicWidth={960} 
              intrinsicHeight={720} 
            />
            
            {/* Unique corner accent */}
            <div className="absolute top-0 left-0 w-16 h-16 bg-white transform -translate-x-8 -translate-y-8 rotate-45 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700" />
            
            {/* Floating category badge */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 text-center">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#BF4646] block">
                  {variant === 'comment' ? 'Response' : 'Feature'}
                </span>
                <span className="text-xs text-[#7EACB5] font-medium">{category}</span>
              </div>
            </div>
          </div>
          
          {/* Right side - Content with unique layout */}
          <div className="flex-1 flex flex-col p-8 relative">
            {/* Unique number indicator */}
            <div className="absolute top-8 right-8">
              <div className="w-12 h-12 rounded-full border-2 border-[#EDDCC6] flex items-center justify-center">
                <span className="text-lg font-bold text-[#BF4646]">01</span>
              </div>
            </div>
            
            {/* Content with unique spacing */}
            <div className="flex-1 flex flex-col justify-center pr-16">
              <div className="mb-4">
                <span className="inline-block w-8 h-0.5 bg-[#BF4646] rounded-full" />
              </div>
              
              <h3 className="line-clamp-3 text-2xl font-bold leading-tight tracking-[-0.04em] text-[#1a1a1a] mb-4 group-hover:text-[#BF4646] transition-colors duration-300">
                {post.title}
              </h3>
              
              <p className="line-clamp-3 text-sm leading-relaxed text-[#666] font-light mb-6">
                {getExcerpt(content.description || post.summary, compact ? 120 : 160) || 'Explore this story.'}
              </p>
              
              {/* Unique CTA design */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm font-medium text-[#BF4646]">
                  <span>Read</span>
                  <div className="w-6 h-6 rounded-full bg-[#BF4646] text-white flex items-center justify-center text-xs">
                    →
                  </div>
                </div>
                <div className="flex gap-1">
                  {[1,2,3].map((i) => (
                    <div key={i} className="w-1 h-1 rounded-full bg-[#EDDCC6]" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Hover overlay with unique pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#BF4646]/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </Link>
    )
  }

  if (variant === 'image') {
    return (
      <Link href={href} className="group flex h-full overflow-hidden bg-black shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-500 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] relative">
        {/* Unique stacked layout design */}
        <div className="flex h-full">
          {/* Main image section */}
          <div className="relative w-3/5 overflow-hidden">
            <ContentImage src={image} alt={altText} fill sizes={imageSizes} quality={90} className="object-cover transition-all duration-700 group-hover:scale-[1.03]" intrinsicWidth={960} intrinsicHeight={720} />
            
            {/* Unique geometric overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
            
            {/* Floating elements */}
            <div className="absolute top-4 left-4">
              <div className="flex flex-col gap-2">
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                </div>
                <div className="w-1 h-12 bg-white/30 mx-auto" />
              </div>
            </div>
            
            {/* Category tag */}
            <div className="absolute bottom-4 left-4">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded px-3 py-1">
                <span className="text-xs font-bold text-white uppercase tracking-[0.2em]">{category}</span>
              </div>
            </div>
          </div>
          
          {/* Side content panel */}
          <div className="w-2/5 bg-gradient-to-b from-gray-900 to-black p-6 flex flex-col justify-between">
            {/* Top section */}
            <div>
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-white rounded-full" />
                  <span className="text-xs font-bold text-white uppercase tracking-[0.3em]">Visual Story</span>
                </div>
                <h3 className="text-xl font-bold leading-tight text-white mb-3 group-hover:text-gray-200 transition-colors duration-300">
                  {post.title}
                </h3>
              </div>
              
              {/* Unique visual elements */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                {[1,2,3,4,5,6].map((i) => (
                  <div key={i} className="aspect-square bg-white/10 rounded" />
                ))}
              </div>
            </div>
            
            {/* Bottom section */}
            <div>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">
                {getExcerpt(content.description || post.summary, 80) || 'Visual exploration'}
              </p>
              
              {/* Unique CTA */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 border border-white/30 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  <span className="text-xs font-medium text-white">Explore</span>
                </div>
                <div className="flex gap-1">
                  {[1,2,3].map((i) => (
                    <div key={i} className="w-1 h-1 bg-white/30 rounded-full" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Unique hover effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </Link>
    )
  }

  if (variant === 'profile' || variant === 'org') {
    return (
      <Link href={href} className="group flex h-full overflow-hidden bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all duration-500 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] relative">
        {/* Unique card design with diagonal split */}
        <div className="flex h-full">
          {/* Left section - Image with unique treatment */}
          <div className="relative w-1/2 overflow-hidden">
            <ContentImage src={image} alt={altText} fill sizes={imageSizes} quality={90} className="object-cover transition-all duration-700 group-hover:scale-[1.05]" intrinsicWidth={960} intrinsicHeight={720} />
            
            {/* Diagonal overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#BF4646]/80 to-transparent" />
            
            {/* Floating elements */}
            <div className="absolute top-4 right-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2">
                <div className="w-4 h-4 bg-[#BF4646] rounded-full" />
              </div>
            </div>
            
            {/* Type indicator */}
            <div className="absolute bottom-4 left-4">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded px-3 py-1">
                <span className="text-xs font-bold text-white uppercase tracking-[0.2em]">
                  {variant === 'org' ? 'Collective' : 'Profile'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Right section - Content with unique layout */}
          <div className="w-1/2 p-8 flex flex-col justify-center relative">
            {/* Unique geometric accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#EDDCC6] rounded-bl-full opacity-20" />
            
            <div className="relative z-10">
              {/* Unique header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 bg-[#BF4646] rounded-full" />
                <span className="text-xs font-bold text-[#BF4646] uppercase tracking-[0.3em]">{category}</span>
              </div>
              
              <h3 className="text-xl font-bold leading-tight text-gray-900 mb-3 group-hover:text-[#BF4646] transition-colors duration-300">
                {post.title}
              </h3>
              
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                {getExcerpt(content.description || post.summary, 100) || 'Explore this profile.'}
              </p>
              
              {/* Unique visual elements */}
              <div className="flex gap-2 mb-4">
                {[1,2,3,4].map((i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full ${i === 2 ? 'bg-[#BF4646]' : 'bg-[#EDDCC6]'}`} />
                ))}
              </div>
              
              {content.location && (
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                  <div className="w-2 h-2 bg-gray-400 rounded-full" />
                  {content.location}
                </div>
              )}
              
              {/* Unique CTA */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 border-2 border-[#BF4646] rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-[#BF4646] rounded-full" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">Connect</span>
                </div>
                <div className="w-8 h-8 bg-[#EDDCC6] rounded-full flex items-center justify-center group-hover:bg-[#BF4646] transition-colors duration-300">
                  <span className="text-white text-xs">→</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Unique hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-l from-[#BF4646]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </Link>
    )
  }

  if (variant === 'pdf') {
    return (
      <Link href={href} className="group flex h-full flex-col overflow-hidden rounded-[1.8rem] border border-[#EDDCC6] bg-[linear-gradient(180deg,#FFF4EA_0%,#EDDCC6_100%)] shadow-[0_18px_52px_rgba(126,172,181,0.14)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(126,172,181,0.18)]">
        <div className="relative aspect-[4/5] overflow-hidden bg-[#FFF4EA] p-5">
          <div className="absolute inset-5 rounded-[1.2rem] border border-[#EDDCC6] bg-white shadow-[0_14px_34px_rgba(126,172,181,0.12)]" />
          <div className="relative z-10 flex h-full flex-col justify-between">
            <span className="inline-flex w-fit items-center gap-1 rounded-full bg-[#BF4646] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#FFF4EA]">
              <FileText className="h-3.5 w-3.5" />
              Document
            </span>
            <div className="rounded-[1rem] bg-white/70 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#7EACB5]">
              {category}
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="line-clamp-2 text-xl font-semibold leading-tight text-[#BF4646]">{post.title}</h3>
          <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#7EACB5]">{getExcerpt(content.description || post.summary) || 'Open this document.'}</p>
          <div className="mt-auto pt-5 text-sm font-semibold text-[#BF4646]">Open file</div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={href} className={`group flex h-full flex-col overflow-hidden transition duration-300 ${visualVariant.frame}`}>
      <div className={`relative ${imageAspect} overflow-hidden bg-[#ede2dc]`}>
        <ContentImage src={image} alt={altText} fill sizes={imageSizes} quality={75} className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" intrinsicWidth={960} intrinsicHeight={720} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-80" />
        <span className={`absolute left-4 top-4 inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${visualVariant.badge}`}>
          <Tag className="h-3.5 w-3.5" />
          {category}
        </span>
        {variant === 'pdf' && <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/88 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-950 shadow"><FileText className="h-3.5 w-3.5" />PDF</span>}
      </div>
      <div className={`flex flex-1 flex-col p-5 ${compact ? 'py-4' : ''}`}>
        <h3 className={`line-clamp-2 font-semibold leading-snug ${variant === 'article' ? 'text-[1.35rem]' : 'text-lg'} ${visualVariant.title}`}>{post.title}</h3>
        <p className={`mt-3 text-sm leading-7 ${variant === 'article' ? 'line-clamp-4' : 'line-clamp-3'} ${visualVariant.muted}`}>{getExcerpt(content.description || post.summary) || 'Explore this post.'}</p>
        <div className="mt-auto pt-4">
          {content.location && <div className={`inline-flex items-center gap-1 text-xs ${visualVariant.muted}`}><MapPin className="h-3.5 w-3.5" />{content.location}</div>}
          {content.email && <div className={`mt-2 inline-flex items-center gap-1 text-xs ${visualVariant.muted}`}><Mail className="h-3.5 w-3.5" />{content.email}</div>}
        </div>
      </div>
    </Link>
  )
}
