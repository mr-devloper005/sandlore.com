import { ContentImage } from "@/components/shared/content-image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Globe, Phone, Tag, Mail } from "lucide-react";
import { NavbarShell } from "@/components/shared/navbar-shell";
import { Footer } from "@/components/shared/footer";
import { TaskPostCard } from "@/components/shared/task-post-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buildPostUrl, fetchTaskPostBySlug, fetchTaskPosts } from "@/lib/task-data";
import { SITE_CONFIG, getTaskConfig, type TaskKey } from "@/lib/site-config";
import type { SitePost } from "@/lib/site-connector";
import { TaskImageCarousel } from "@/components/tasks/task-image-carousel";
import { cn } from "@/lib/utils";
import { ArticleComments } from "@/components/tasks/article-comments";
import { SchemaJsonLd } from "@/components/seo/schema-jsonld";
import { RichContent, formatRichHtml } from "@/components/shared/rich-content";
import { getFactoryState } from "@/design/factory/get-factory-state";
import { getProductKind } from "@/design/factory/get-product-kind";
import { DirectoryTaskDetailPage } from "@/design/products/directory/task-detail-page";
import { TASK_DETAIL_PAGE_OVERRIDE_ENABLED, TaskDetailPageOverride } from "@/overrides/task-detail-page";

type PostContent = {
  category?: string;
  location?: string;
  address?: string;
  website?: string;
  phone?: string;
  email?: string;
  description?: string;
  body?: string;
  excerpt?: string;
  author?: string;
  highlights?: string[];
  logo?: string;
  images?: string[];
  latitude?: number | string;
  longitude?: number | string;
};

const isValidImageUrl = (value?: string | null) =>
  typeof value === "string" && (value.startsWith("/") || /^https?:\/\//i.test(value));

const absoluteUrl = (value?: string | null) => {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  if (!value.startsWith("/")) return null;
  return `${SITE_CONFIG.baseUrl.replace(/\/$/, "")}${value}`;
};

const getContent = (post: SitePost): PostContent => {
  const content = post.content && typeof post.content === "object" ? post.content : {};
  return content as PostContent;
};

const formatArticleHtml = (content: PostContent, post: SitePost) => {
  const raw =
    (typeof content.body === "string" && content.body.trim()) ||
    (typeof content.description === "string" && content.description.trim()) ||
    (typeof post.summary === "string" && post.summary.trim()) ||
    "";

  return formatRichHtml(raw, "Details coming soon.");
};

const getImageUrls = (post: SitePost, content: PostContent) => {
  const media = Array.isArray(post.media) ? post.media : [];
  const mediaImages = media
    .map((item) => item?.url)
    .filter((url): url is string => isValidImageUrl(url));
  const contentImages = Array.isArray(content.images)
    ? content.images.filter((url): url is string => isValidImageUrl(url))
    : [];
  const merged = [...mediaImages, ...contentImages];
  if (merged.length) return merged;
  if (isValidImageUrl(content.logo)) return [content.logo as string];
  return ["/placeholder.svg?height=900&width=1400"];
};

const toNumber = (value?: number | string) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const buildMapEmbedUrl = (
  latitude?: number | string,
  longitude?: number | string,
  address?: string
) => {
  const lat = toNumber(latitude);
  const lon = toNumber(longitude);
  const normalizedAddress = typeof address === "string" ? address.trim() : "";
  const googleMapsEmbedApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY?.trim();

  if (googleMapsEmbedApiKey) {
    const query = lat !== null && lon !== null ? `${lat},${lon}` : normalizedAddress;
    if (!query) return null;
    return `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(
      googleMapsEmbedApiKey
    )}&q=${encodeURIComponent(query)}`;
  }

  if (lat !== null && lon !== null) {
    const delta = 0.01;
    const left = lon - delta;
    const right = lon + delta;
    const bottom = lat - delta;
    const top = lat + delta;
    const bbox = `${left},${bottom},${right},${top}`;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(
      bbox
    )}&layer=mapnik&marker=${encodeURIComponent(`${lat},${lon}`)}`;
  }

  if (normalizedAddress) {
    return `https://www.google.com/maps?q=${encodeURIComponent(normalizedAddress)}&output=embed`;
  }

  return null;
};

export async function TaskDetailPage({ task, slug }: { task: TaskKey; slug: string }) {
  if (TASK_DETAIL_PAGE_OVERRIDE_ENABLED) {
    return await TaskDetailPageOverride({ task, slug });
  }

  const taskConfig = getTaskConfig(task);
  let post: SitePost | null = null;
  try {
    post = await fetchTaskPostBySlug(task, slug);
  } catch (error) {
    console.warn("Failed to load post detail", error);
  }

  if (!post) {
    notFound();
  }

  const content = getContent(post);
  const isClassified = task === "classified";
  const isArticle = task === "article";
  const category = content.category || post.tags?.[0] || taskConfig?.label || task;
  const description = content.description || post.summary || "Details coming soon.";
  const descriptionHtml = !isArticle ? formatRichHtml(description, "Details coming soon.") : "";
  const articleHtml = isArticle ? formatArticleHtml(content, post) : "";
  const articleSummary =
    post.summary ||
    (typeof content.excerpt === "string" ? content.excerpt : "") ||
    "";
  const articleAuthor =
    (typeof content.author === "string" && content.author.trim()) ||
    post.authorName ||
    "Editorial Team";
  const postTags = Array.isArray(post.tags) ? post.tags.filter((tag) => typeof tag === "string") : [];
  const location = content.address || content.location;
  const images = getImageUrls(post, content);
  const mapEmbedUrl = buildMapEmbedUrl(content.latitude, content.longitude, location);
  const isBookmark = task === "sbm" || task === "social";
  const hideSidebar = isClassified || isArticle || task === "image" || isBookmark;
  const related = (await fetchTaskPosts(task, 6))
    .filter((item) => item.slug !== post.slug)
    .filter((item) => {
      if (!content.category) return true;
      const itemContent = getContent(item);
      return itemContent.category === content.category;
    })
    .slice(0, 3);
  const articleUrl = `${SITE_CONFIG.baseUrl.replace(/\/$/, "")}${taskConfig?.route || "/articles"}/${post.slug}`;
  const articleImage = absoluteUrl(images[0]) || absoluteUrl(SITE_CONFIG.defaultOgImage);
  const articleSchema = isArticle
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: articleSummary || description,
        image: articleImage ? [articleImage] : [],
        author: {
          "@type": "Person",
          name: articleAuthor,
        },
        datePublished: post.publishedAt || undefined,
        dateModified: post.publishedAt || undefined,
        articleSection: category,
        keywords: postTags.join(", "),
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": articleUrl,
        },
      }
    : null;
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_CONFIG.baseUrl.replace(/\/$/, ""),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: taskConfig?.label || "Posts",
        item: `${SITE_CONFIG.baseUrl.replace(/\/$/, "")}${taskConfig?.route || "/"}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${SITE_CONFIG.baseUrl.replace(/\/$/, "")}${taskConfig?.route || "/posts"}/${post.slug}`,
      },
    ],
  };
  const schemaPayload = articleSchema ? [articleSchema, breadcrumbSchema] : breadcrumbSchema;
  const { recipe } = getFactoryState();
  const productKind = getProductKind(recipe);
  const isVisualTask = task === "image";
  const isDocumentTask = task === "pdf";
  const isProfileTask = task === "profile" || task === "org";
  const detailSurface = isArticle
    ? "bg-[linear-gradient(180deg,#EEEEEE_0%,#ffffff_100%)]"
    : isVisualTask
      ? "bg-[linear-gradient(180deg,#08101d_0%,#0f1a2d_100%)] text-white"
      : isDocumentTask
        ? "bg-[linear-gradient(180deg,#EEEEEE_0%,#6FCF97_100%)]"
        : isProfileTask
          ? "bg-[linear-gradient(180deg,#EEEEEE_0%,#ffffff_100%)]"
          : "bg-background";
  const detailPanel = isVisualTask
    ? "border border-white/10 bg-white/6"
    : "border border-[#6FCF97] bg-white/90";
  const detailMuted = isVisualTask ? "text-slate-300" : "text-[#1F6F5F]";
  const detailTitle = isVisualTask ? "text-white" : "text-[#2FA084]";

  if (productKind === "directory" && (task === "listing" || task === "classified" || task === "profile")) {
    return (
      <div className="min-h-screen bg-[#f8fbff]">
        <NavbarShell />
        <DirectoryTaskDetailPage
          task={task}
          taskLabel={taskConfig?.label || task}
          taskRoute={taskConfig?.route || "/"}
          post={post}
          description={description}
          category={category}
          images={images}
          mapEmbedUrl={mapEmbedUrl}
          related={related}
        />
        <Footer />
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen", detailSurface)}>
      <NavbarShell />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SchemaJsonLd data={schemaPayload} />
        <Link
          href={taskConfig?.route || "/"}
          className={cn("mb-6 inline-flex items-center text-sm hover:text-foreground", detailMuted)}
        >
          ← Back to {taskConfig?.label || "posts"}
        </Link>

        <div
          className={cn(
            "grid gap-10",
            hideSidebar ? "lg:grid-cols-1" : "lg:grid-cols-[2fr_1fr]"
          )}
        >
          <div className={cn(isClassified ? "space-y-8" : "")}>
            {isArticle ? (
              <div className="mx-auto w-full max-w-4xl space-y-6">
                <div className="rounded-[2.2rem] border border-[#6FCF97] bg-[linear-gradient(180deg,#EEEEEE_0%,#6FCF97_100%)] p-7 shadow-[0_22px_60px_rgba(111,207,151,0.14)] sm:p-8">
                  <p className="text-xs uppercase tracking-[0.32em] text-[#1F6F5F]">Feature story</p>
                  <h1 className="mt-4 text-4xl font-semibold leading-[1.02] tracking-[-0.06em] text-[#2FA084] sm:text-5xl">
                    {post.title}
                  </h1>
                  <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#1F6F5F]">
                    <span>By {articleAuthor}</span>
                    <Badge variant="secondary" className="inline-flex items-center gap-1 border border-[#6FCF97] bg-white text-[#2FA084]">
                      <Tag className="h-3.5 w-3.5" />
                      {category}
                    </Badge>
                  </div>
                  {postTags.length ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {postTags.map((tag) => (
                        <Badge key={tag} variant="outline" className="border-[#6FCF97] text-[#1F6F5F]">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                  {articleSummary ? (
                    <p className="mt-5 max-w-3xl text-base leading-8 text-[#1F6F5F]">{articleSummary}</p>
                  ) : null}
                </div>
                {images[0] ? (
                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[2.4rem] border border-[#6FCF97] bg-[#EEEEEE] shadow-[0_22px_60px_rgba(111,207,151,0.14)]">
                    <ContentImage
                      src={images[0]}
                      alt={`${post.title} featured image`}
                      fill
                      className="object-cover"
                      intrinsicWidth={1600}
                      intrinsicHeight={900}
                    />
                  </div>
                ) : null}
                <div className="rounded-[2rem] border border-[#6FCF97] bg-white/92 p-6 shadow-[0_18px_50px_rgba(111,207,151,0.12)] sm:p-8">
                  <RichContent html={articleHtml} className="leading-8 prose-p:my-6 prose-h2:my-8 prose-h3:my-6 prose-ul:my-6" />
                </div>
                <ArticleComments slug={post.slug} />
              </div>
            ) : null}

            {!isArticle ? (
              <>
                {!isBookmark ? (
                  <div className={cn(isClassified ? "w-full" : "", isVisualTask ? "rounded-[2rem] border border-white/10 bg-white/5 p-3" : "")}>
                    <TaskImageCarousel images={images} />
                  </div>
                ) : null}

                <div className={cn(isClassified ? "mx-auto w-full max-w-4xl" : "mt-6")}>
                  <div className={cn("rounded-[2rem] p-6 sm:p-7", detailPanel)}>
                    <div className={cn("flex flex-wrap items-center gap-3 text-sm", detailMuted)}>
                      <Badge variant="secondary" className={cn("inline-flex items-center gap-1", isVisualTask ? "border border-white/10 bg-white/10 text-white" : "border border-[#6FCF97] bg-white text-[#2FA084]")}>
                      <Tag className="h-3.5 w-3.5" />
                      {category}
                    </Badge>
                    {location && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {location}
                      </span>
                    )}
                    </div>
                    <h1 className={cn("mt-4 text-3xl font-semibold tracking-[-0.05em]", detailTitle)}>{post.title}</h1>
                    <RichContent html={descriptionHtml} className={cn("mt-3 max-w-3xl", isVisualTask ? "[&_p]:text-slate-300 [&_a]:text-white" : "")} />
                  </div>
                </div>
              </>
            ) : null}

            {isClassified ? (
              <div className="mx-auto w-full max-w-4xl rounded-[2rem] border border-[#6FCF97] bg-white/92 p-6">
                <h2 className="text-lg font-semibold text-[#2FA084]">Business details</h2>
                <div className="mt-4 space-y-3 text-sm text-[#1F6F5F]">
                  {content.website && (
                    <div className="flex items-start gap-2">
                      <Globe className="mt-0.5 h-4 w-4" />
                      <a
                        href={content.website}
                        className="break-all text-[#2FA084] hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {content.website}
                      </a>
                    </div>
                  )}
                  {content.phone && (
                    <div className="flex items-start gap-2">
                      <Phone className="mt-0.5 h-4 w-4" />
                      <span>{content.phone}</span>
                    </div>
                  )}
                  {content.email && (
                    <div className="flex items-start gap-2">
                      <Mail className="mt-0.5 h-4 w-4" />
                      <a
                        href={`mailto:${content.email}`}
                        className="break-all text-[#2FA084] hover:underline"
                      >
                        {content.email}
                      </a>
                    </div>
                  )}
                  {location && (
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4" />
                      <span>{location}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            {content.highlights?.length && !isArticle ? (
              <div className={cn("mt-8 rounded-[2rem] p-6", detailPanel, isClassified ? "mx-auto w-full max-w-4xl" : "")}>
                <h2 className={cn("text-lg font-semibold", detailTitle)}>Highlights</h2>
                <ul className={cn("mt-4 space-y-2 text-sm", detailMuted)}>
                  {content.highlights.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {isClassified && mapEmbedUrl ? (
              <div className="mx-auto w-full max-w-4xl rounded-[2rem] border border-[#6FCF97] bg-white/92 p-4">
                <p className="text-sm font-semibold text-[#2FA084]">Location map</p>
                <div className="mt-4 overflow-hidden rounded-xl border border-[#6FCF97]">
                  <iframe
                    title="Business location map"
                    src={mapEmbedUrl}
                    className="h-56 w-full"
                    loading="lazy"
                  />
                </div>
              </div>
            ) : null}

          </div>

          {!hideSidebar ? (
            <aside className="space-y-6">
            <div className={cn("rounded-[2rem] p-6", detailPanel)}>
              <h2 className={cn("text-lg font-semibold", detailTitle)}>Listing details</h2>
                <div className={cn("mt-4 space-y-3 text-sm", detailMuted)}>
                  {content.website && (
                    <div className="flex items-start gap-2">
                      <Globe className="mt-0.5 h-4 w-4" />
                      <a
                        href={content.website}
                        className={cn("break-all hover:underline", isVisualTask ? "text-white" : "text-[#2f1d16]")}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {content.website}
                      </a>
                    </div>
                  )}
                  {content.phone && (
                    <div className="flex items-start gap-2">
                      <Phone className="mt-0.5 h-4 w-4" />
                      <span>{content.phone}</span>
                    </div>
                  )}
                  {content.email && (
                    <div className="flex items-start gap-2">
                      <Mail className="mt-0.5 h-4 w-4" />
                      <a
                        href={`mailto:${content.email}`}
                        className={cn("break-all hover:underline", isVisualTask ? "text-white" : "text-[#2f1d16]")}
                      >
                        {content.email}
                      </a>
                    </div>
                  )}
                  {location && (
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4" />
                      <span>{location}</span>
                    </div>
                  )}
                </div>
              {content.website ? (
                <Button className={cn("mt-5 w-full", isVisualTask ? "bg-white text-[#07111f] hover:bg-slate-200" : "")} asChild>
                  <a href={content.website} target="_blank" rel="noreferrer">
                    Visit Website
                  </a>
                </Button>
              ) : null}
            </div>

            {mapEmbedUrl ? (
              <div className={cn("rounded-[2rem] p-4", detailPanel)}>
                <p className={cn("text-sm font-semibold", detailTitle)}>Location map</p>
                <div className={cn("mt-4 overflow-hidden rounded-xl", isVisualTask ? "border border-white/10" : "border border-[#dacfbf]")}>
                  <iframe
                    title="Business location map"
                    src={mapEmbedUrl}
                    className="h-56 w-full"
                    loading="lazy"
                  />
                </div>
              </div>
            ) : null}

          </aside>
          ) : null}
        </div>

        <section className="mt-12">
          {related.length ? (
            <>
            <div className="mb-4 flex items-center justify-between">
              <h2 className={cn("text-xl font-semibold", detailTitle)}>
                More in {category}
              </h2>
              {taskConfig?.route && (
                <Link
                  href={taskConfig.route}
                  className={cn("text-sm hover:text-foreground", detailMuted)}
                >
                  View all
                </Link>
              )}
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <TaskPostCard
                  key={item.id}
                  post={item}
                  href={buildPostUrl(task, item.slug)}
                />
              ))}
            </div>
            </>
          ) : null}
          <nav className={cn("mt-6 rounded-[2rem] p-4", detailPanel)}>
            <p className={cn("text-sm font-semibold", detailTitle)}>Related links</p>
            <ul className="mt-2 space-y-2 text-sm">
              {related.map((item) => (
                <li key={`link-${item.id}`}>
                  <Link
                    href={buildPostUrl(task, item.slug)}
                    className={cn("underline-offset-4 hover:underline", isVisualTask ? "text-white" : "text-primary")}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
              {taskConfig?.route ? (
                <li>
                  <Link
                    href={taskConfig.route}
                    className={cn("underline-offset-4 hover:underline", isVisualTask ? "text-white" : "text-primary")}
                  >
                    Browse all {taskConfig.label}
                  </Link>
                </li>
              ) : null}
              <li>
                <Link
                  href={`/search?q=${encodeURIComponent(category)}`}
                  className={cn("underline-offset-4 hover:underline", isVisualTask ? "text-white" : "text-primary")}
                >
                  Search more in {category}
                </Link>
              </li>
            </ul>
          </nav>
        </section>
      </main>
      <Footer />
    </div>
  );
}
