import Link from 'next/link'
import { ArrowRight, Building2, FileText, Image as ImageIcon, LayoutGrid, Tag, User } from 'lucide-react'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { TaskListClient } from '@/components/tasks/task-list-client'
import { SchemaJsonLd } from '@/components/seo/schema-jsonld'
import { fetchTaskPosts } from '@/lib/task-data'
import { SITE_CONFIG, getTaskConfig, type TaskKey } from '@/lib/site-config'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { taskIntroCopy } from '@/config/site.content'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { TASK_LIST_PAGE_OVERRIDE_ENABLED, TaskListPageOverride } from '@/overrides/task-list-page'

const taskIcons: Record<TaskKey, any> = {
  listing: Building2,
  article: FileText,
  image: ImageIcon,
  profile: User,
  classified: Tag,
  sbm: LayoutGrid,
  social: LayoutGrid,
  pdf: FileText,
  org: Building2,
  comment: FileText,
}

const variantShells = {
  'listing-directory': 'bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.08),transparent_24%),linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)]',
  'listing-showcase': 'bg-[linear-gradient(180deg,#EEEEEE_0%,#6FCF97_100%)]',
  'article-editorial': 'bg-[radial-gradient(circle_at_top_left,rgba(47,160,132,0.08),transparent_20%),linear-gradient(180deg,#EEEEEE_0%,#ffffff_100%)]',
  'article-journal': 'bg-[linear-gradient(180deg,#EEEEEE_0%,#6FCF97_100%)]',
  'image-masonry': 'bg-[linear-gradient(180deg,#09101d_0%,#111c2f_100%)] text-white',
  'image-portfolio': 'bg-[linear-gradient(180deg,#07111f_0%,#13203a_100%)] text-white',
  'profile-creator': 'bg-[linear-gradient(180deg,#EEEEEE_0%,#ffffff_100%)]',
  'profile-business': 'bg-[linear-gradient(180deg,#f6fbff_0%,#ffffff_100%)]',
  'classified-bulletin': 'bg-[linear-gradient(180deg,#EEEEEE_0%,#ffffff_100%)]',
  'classified-market': 'bg-[linear-gradient(180deg,#f4f6ef_0%,#ffffff_100%)]',
  'sbm-curation': 'bg-[linear-gradient(180deg,#fff7ee_0%,#ffffff_100%)]',
  'sbm-library': 'bg-[linear-gradient(180deg,#EEEEEE_0%,#ffffff_100%)]',
} as const

export async function TaskListPage({ task, category }: { task: TaskKey; category?: string }) {
  if (TASK_LIST_PAGE_OVERRIDE_ENABLED) {
    return await TaskListPageOverride({ task, category })
  }

  const taskConfig = getTaskConfig(task)
  const posts = await fetchTaskPosts(task, 30)
  const normalizedCategory = category ? normalizeCategory(category) : 'all'
  const intro = taskIntroCopy[task]
  const baseUrl = SITE_CONFIG.baseUrl.replace(/\/$/, '')
  const schemaItems = posts.slice(0, 10).map((post, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    url: `${baseUrl}${taskConfig?.route || '/posts'}/${post.slug}`,
    name: post.title,
  }))
  const { recipe } = getFactoryState()
  const layoutKey = recipe.taskLayouts[task as keyof typeof recipe.taskLayouts] || `${task}-${task === 'listing' ? 'directory' : 'editorial'}`
  const shellClass = variantShells[layoutKey as keyof typeof variantShells] || 'bg-background'
  const Icon = taskIcons[task] || LayoutGrid

  const isDark = ['image-masonry', 'image-portfolio', 'profile-creator'].includes(layoutKey)
  const ui = isDark
    ? {
        muted: 'text-slate-300',
        panel: 'border border-white/10 bg-white/6',
        soft: 'border border-white/10 bg-white/5',
        input: 'border-white/10 bg-white/6 text-white',
        button: 'bg-white text-slate-950 hover:bg-slate-200',
      }
    : layoutKey.startsWith('article') || layoutKey.startsWith('sbm')
      ? {
          muted: 'text-[#1F6F5F]',
          panel: 'border border-[#6FCF97] bg-white/90',
          soft: 'border border-[#6FCF97] bg-[#EEEEEE]',
          input: 'border border-[#6FCF97] bg-white text-[#2FA084]',
          button: 'bg-[#2FA084] text-[#EEEEEE] hover:bg-[#1F6F5F]',
        }
      : {
          muted: 'text-[#1F6F5F]',
          panel: 'border border-[#6FCF97] bg-white',
          soft: 'border border-[#6FCF97] bg-[#EEEEEE]',
          input: 'border border-[#6FCF97] bg-white text-[#2FA084]',
          button: 'bg-[#2FA084] text-[#EEEEEE] hover:bg-[#1F6F5F]',
        }

  return (
    <div className={`min-h-screen ${shellClass}`}>
      <NavbarShell />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {task === 'listing' ? (
          <SchemaJsonLd
            data={[
              {
                '@context': 'https://schema.org',
                '@type': 'ItemList',
                name: 'Business Directory Listings',
                itemListElement: schemaItems,
              },
              {
                '@context': 'https://schema.org',
                '@type': 'LocalBusiness',
                name: SITE_CONFIG.name,
                url: `${baseUrl}/listings`,
                areaServed: 'Worldwide',
              },
            ]}
          />
        ) : null}
        {task === 'article' || task === 'classified' ? (
          <SchemaJsonLd
            data={{
              '@context': 'https://schema.org',
              '@type': 'CollectionPage',
              name: `${taskConfig?.label || task} | ${SITE_CONFIG.name}`,
              url: `${baseUrl}${taskConfig?.route || ''}`,
              hasPart: schemaItems,
            }}
          />
        ) : null}

        {layoutKey === 'listing-directory' || layoutKey === 'listing-showcase' ? (
          <section className="mb-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div className={`rounded-[2rem] p-7 shadow-[0_24px_70px_rgba(15,23,42,0.07)] ${ui.panel}`}>
              <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] opacity-70"><Icon className="h-4 w-4" /> Supporting archive</div>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-foreground">{taskConfig?.description || 'Latest posts'}</h1>
              <p className={`mt-4 max-w-2xl text-sm leading-7 ${ui.muted}`}>A denser, faster-scanning surface for structured entries, references, and utility-first supporting pages.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={taskConfig?.route || '#'} className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${ui.button}`}>Explore results <ArrowRight className="h-4 w-4" /></Link>
                <Link href="/search" className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${ui.soft}`}>Open search</Link>
              </div>
            </div>
            <form className={`grid gap-3 rounded-[2rem] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] ${ui.soft}`} action={taskConfig?.route || '#'}>
              <div>
                <label className={`text-xs uppercase tracking-[0.2em] ${ui.muted}`}>Category</label>
                <select name="category" defaultValue={normalizedCategory} className={`mt-2 h-11 w-full rounded-xl px-3 text-sm ${ui.input}`}>
                  <option value="all">All categories</option>
                  {CATEGORY_OPTIONS.map((item) => (
                    <option key={item.slug} value={item.slug}>{item.name}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className={`h-11 rounded-xl text-sm font-medium ${ui.button}`}>Apply filters</button>
            </form>
          </section>
        ) : null}

        {layoutKey === 'article-editorial' || layoutKey === 'article-journal' ? (
          <section className="mb-12 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div className="rounded-[2.4rem] border border-[#6FCF97] bg-[linear-gradient(180deg,#EEEEEE_0%,#6FCF97_100%)] p-7 shadow-[0_24px_70px_rgba(111,207,151,0.14)] sm:p-9">
              <p className={`text-xs uppercase tracking-[0.34em] ${ui.muted}`}>Archive issue</p>
              <h1 className="mt-4 max-w-4xl text-5xl font-semibold tracking-[-0.06em] text-foreground sm:text-6xl">{taskConfig?.description || 'Latest posts'}</h1>
              <p className={`mt-6 max-w-2xl text-sm leading-8 ${ui.muted}`}>A print-minded archive with larger headlines, quieter controls, and more deliberate separation between feature stories and supporting entries.</p>
            </div>
            <div className={`rounded-[2rem] p-6 ${ui.panel}`}>
              <p className={`text-xs font-semibold uppercase tracking-[0.24em] ${ui.muted}`}>Reading note</p>
              <p className={`mt-4 text-sm leading-7 ${ui.muted}`}>Use categories to move through the archive without losing the calmer editorial pacing of the page.</p>
              <form className="mt-5 flex items-center gap-3" action={taskConfig?.route || '#'}>
                <select name="category" defaultValue={normalizedCategory} className={`h-11 flex-1 rounded-xl px-3 text-sm ${ui.input}`}>
                  <option value="all">All categories</option>
                  {CATEGORY_OPTIONS.map((item) => (
                    <option key={item.slug} value={item.slug}>{item.name}</option>
                  ))}
                </select>
                <button type="submit" className={`h-11 rounded-xl px-4 text-sm font-medium ${ui.button}`}>Apply</button>
              </form>
            </div>
          </section>
        ) : null}

        {layoutKey === 'image-masonry' || layoutKey === 'image-portfolio' ? (
          <section className="mb-12 grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${ui.soft}`}>
                <Icon className="h-3.5 w-3.5" /> Visual feed
              </div>
              <h1 className="mt-5 text-5xl font-semibold tracking-[-0.05em]">{taskConfig?.description || 'Latest posts'}</h1>
              <p className={`mt-5 max-w-2xl text-sm leading-8 ${ui.muted}`}>A darker gallery surface with larger media, fewer text interruptions, and more atmospheric pacing than the reading archive.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className={`min-h-[220px] rounded-[2rem] ${ui.panel}`} />
              <div className={`min-h-[220px] rounded-[2rem] ${ui.soft}`} />
              <div className={`col-span-2 min-h-[120px] rounded-[2rem] ${ui.panel}`} />
            </div>
          </section>
        ) : null}

        {layoutKey === 'profile-creator' || layoutKey === 'profile-business' ? (
          <section className={`mb-12 rounded-[2.2rem] p-8 shadow-[0_24px_70px_rgba(15,23,42,0.1)] ${ui.panel}`}>
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div className={`min-h-[240px] rounded-[2rem] ${ui.soft}`} />
              <div>
                <p className={`text-xs uppercase tracking-[0.3em] ${ui.muted}`}>{taskConfig?.label || task}</p>
                <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground">Profiles with stronger identity, portrait, and trust cues.</h1>
                <p className={`mt-5 max-w-2xl text-sm leading-8 ${ui.muted}`}>This page gives authors, studios, and organizations a quieter portrait-led shell instead of repeating article or listing layouts.</p>
              </div>
            </div>
          </section>
        ) : null}

        {layoutKey === 'classified-bulletin' || layoutKey === 'classified-market' ? (
          <section className="mb-12 grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className={`rounded-[1.8rem] p-6 ${ui.panel}`}>
              <p className={`text-xs uppercase tracking-[0.3em] ${ui.muted}`}>{taskConfig?.label || task}</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground">Fast-moving notices, offers, and responses in a bulletin-board format.</h1>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {['Quick to scan', 'Shorter response path', 'Clearer urgency cues'].map((item) => (
                <div key={item} className={`rounded-[1.5rem] p-5 ${ui.soft}`}>
                  <p className="text-sm font-semibold">{item}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {layoutKey === 'sbm-curation' || layoutKey === 'sbm-library' ? (
          <section className="mb-12 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div>
              <p className={`text-xs uppercase tracking-[0.3em] ${ui.muted}`}>{taskConfig?.label || task}</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground">Curated resources arranged more like shelves than a generic post feed.</h1>
              <p className={`mt-5 max-w-2xl text-sm leading-8 ${ui.muted}`}>Bookmarks, saved references, and collections get a library-like rhythm with quieter metadata and stronger textual grouping.</p>
            </div>
            <div className={`rounded-[2rem] p-6 ${ui.panel}`}>
              <p className={`text-xs uppercase tracking-[0.24em] ${ui.muted}`}>Collection filter</p>
              <form className="mt-4 flex items-center gap-3" action={taskConfig?.route || '#'}>
                <select name="category" defaultValue={normalizedCategory} className={`h-11 flex-1 rounded-xl px-3 text-sm ${ui.input}`}>
                  <option value="all">All categories</option>
                  {CATEGORY_OPTIONS.map((item) => (
                    <option key={item.slug} value={item.slug}>{item.name}</option>
                  ))}
                </select>
                <button type="submit" className={`h-11 rounded-xl px-4 text-sm font-medium ${ui.button}`}>Apply</button>
              </form>
            </div>
          </section>
        ) : null}

        {task === 'pdf' ? (
          <section className="mb-12 grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
            <div className="rounded-[2.2rem] border border-[#dacfbf] bg-[linear-gradient(180deg,#fffdf8_0%,#f2ebde_100%)] p-7 shadow-[0_20px_60px_rgba(57,46,33,0.08)]">
              <p className="text-xs uppercase tracking-[0.32em] text-[#1F6F5F]">Document archive</p>
              <h1 className="mt-4 text-5xl font-semibold tracking-[-0.06em] text-[#2FA084]">{taskConfig?.description || 'Documents and reports'}</h1>
              <p className="mt-5 max-w-2xl text-sm leading-8 text-[#1F6F5F]">Reports, guides, and downloadable files are presented more like a quiet index than a social feed.</p>
            </div>
            <form className="rounded-[2rem] border border-[#6FCF97] bg-white p-6 shadow-[0_18px_50px_rgba(111,207,151,0.12)]" action={taskConfig?.route || '#'}>
              <p className="text-xs uppercase tracking-[0.24em] text-[#1F6F5F]">Filter archive</p>
              <div className="mt-4 flex items-center gap-3">
                <select name="category" defaultValue={normalizedCategory} className="h-11 flex-1 rounded-xl border border-[#6FCF97] bg-white px-3 text-sm text-[#2FA084]">
                  <option value="all">All categories</option>
                  {CATEGORY_OPTIONS.map((item) => (
                    <option key={item.slug} value={item.slug}>{item.name}</option>
                  ))}
                </select>
                <button type="submit" className="h-11 rounded-xl bg-[#2FA084] px-4 text-sm font-medium text-[#EEEEEE]">Apply</button>
              </div>
            </form>
          </section>
        ) : null}

        {task === 'comment' ? (
          <section className="mb-12 rounded-[2.2rem] border border-[#6FCF97] bg-[linear-gradient(180deg,#EEEEEE_0%,#6FCF97_100%)] p-8 shadow-[0_20px_60px_rgba(111,207,151,0.14)]">
            <p className="text-xs uppercase tracking-[0.32em] text-[#1F6F5F]">Annotations desk</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-[#2FA084]">Responses, notes, and context kept close to the writing.</h1>
            <p className="mt-5 max-w-3xl text-sm leading-8 text-[#1F6F5F]">Comment surfaces stay lighter and more text-led so they read like annotations beneath the archive rather than a separate noisy feed.</p>
          </section>
        ) : null}

        {task === 'org' ? (
          <section className="mb-12 rounded-[2.2rem] border border-[#6FCF97] bg-white p-8 shadow-[0_20px_60px_rgba(111,207,151,0.14)]">
            <p className="text-xs uppercase tracking-[0.32em] text-[#1F6F5F]">Collective profiles</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-[#2FA084]">Organizations framed with the same calm editorial tone as the archive.</h1>
            <p className="mt-5 max-w-3xl text-sm leading-8 text-[#1F6F5F]">Teams, studios, and institutions sit between profile and directory surfaces, with stronger identity cues and less utility clutter.</p>
          </section>
        ) : null}

        {intro ? (
          <section className={`mb-12 rounded-[2rem] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-8 ${ui.panel}`}>
            <h2 className="text-2xl font-semibold text-foreground">{intro.title}</h2>
            {intro.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className={`mt-4 text-sm leading-7 ${ui.muted}`}>{paragraph}</p>
            ))}
          </section>
        ) : null}

        <TaskListClient task={task} initialPosts={posts} category={normalizedCategory} />
      </main>
      <Footer />
    </div>
  )
}
