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
    ? "bg-[linear-gradient(180deg,#FFF4EA_0%,#ffffff_100%)]"
    : isVisualTask
      ? "bg-[linear-gradient(180deg,#08101d_0%,#0f1a2d_100%)] text-white"
      : isDocumentTask
        ? "bg-[linear-gradient(180deg,#FFF4EA_0%,#EDDCC6_100%)]"
        : isProfileTask
          ? "bg-[linear-gradient(180deg,#FFF4EA_0%,#ffffff_100%)]"
          : "bg-background";
  const detailPanel = isVisualTask
    ? "border border-white/10 bg-white/6"
    : "border border-[#EDDCC6] bg-white/90";
  const detailMuted = isVisualTask ? "text-slate-300" : "text-[#7EACB5]";
  const detailTitle = isVisualTask ? "text-white" : "text-[#BF4646]";

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
              <div className="mx-auto w-full max-w-5xl space-y-8">
                {/* Hero Section with Enhanced Design */}
                <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-[#FFF4EA] via-[#FEF7F0] to-[#EDDCC6] shadow-[0_32px_80px_rgba(126,172,181,0.18)]">
                  {/* Decorative Elements */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#BF4646]/5 via-transparent to-[#7EACB5]/5" />
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#BF4646]/10 to-transparent rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#7EACB5]/10 to-transparent rounded-full blur-2xl" />
                  
                  <div className="relative p-8 sm:p-12 lg:p-16">
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                      <span className="inline-flex items-center gap-2 rounded-full bg-[#BF4646]/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#BF4646] border border-[#BF4646]/20">
                        <span className="w-2 h-2 bg-[#BF4646] rounded-full animate-pulse" />
                        Feature Story
                      </span>
                      <Badge className="rounded-full bg-white/90 backdrop-blur-sm border border-[#EDDCC6]/50 text-[#7EACB5] px-4 py-2 text-xs font-semibold">
                        {category}
                      </Badge>
                    </div>
                    
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.02] tracking-[-0.08em] text-[#BF4646] mb-6">
                      {post.title}
                    </h1>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-[#7EACB5] mb-6">
                      <span className="font-medium">By {articleAuthor}</span>
                      <span className="w-1 h-1 rounded-full bg-[#7EACB5]/40" />
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/60 backdrop-blur-sm">
                        <span className="w-1.5 h-1.5 bg-[#7EACB5] rounded-full" />
                        Editorial
                      </span>
                    </div>
                    
                    {postTags.length ? (
                      <div className="flex flex-wrap gap-2">
                        {postTags.slice(0, 4).map((tag) => (
                          <Badge key={tag} variant="outline" className="rounded-full border-[#EDDCC6]/60 bg-white/80 text-[#7EACB5] px-3 py-1 text-xs font-medium">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
                
                {/* Summary Section */}
                {articleSummary && (
                  <div className="relative rounded-[2rem] bg-gradient-to-br from-white to-[#FFF4EA] p-8 shadow-[0_16px_48px_rgba(126,172,181,0.12)] border border-[#EDDCC6]/30">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#7EACB5]/8 to-transparent rounded-full blur-xl" />
                    <p className="relative text-lg leading-8 text-[#7EACB5] font-medium max-w-4xl">
                      {articleSummary}
                    </p>
                  </div>
                )}
                {images[0] ? (
                  <div className="group relative aspect-[21/9] w-full overflow-hidden rounded-[3rem] border border-[#EDDCC6]/50 bg-gradient-to-br from-[#FFF4EA] to-[#EDDCC6] shadow-[0_32px_80px_rgba(126,172,181,0.25)]">
                    {/* Image overlay effects */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#BF4646]/10 via-transparent to-[#7EACB5]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    <ContentImage
                      src={images[0]}
                      alt={`${post.title} featured image`}
                      fill
                      className="object-cover transition-all duration-1000 group-hover:scale-[1.03]"
                      intrinsicWidth={1600}
                      intrinsicHeight={900}
                    />
                    
                    {/* Floating caption */}
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-sm px-4 py-2 text-xs font-semibold text-[#BF4646] shadow-lg border border-[#EDDCC6]/50">
                        <span className="w-2 h-2 bg-[#BF4646] rounded-full animate-pulse" />
                        Featured Image
                      </div>
                    </div>
                  </div>
                ) : null}
                
                {/* Enhanced Content Section */}
                <div className="relative rounded-[3rem] bg-gradient-to-br from-white via-[#FFFEFA] to-[#FFF4EA] p-8 sm:p-12 shadow-[0_24px_64px_rgba(126,172,181,0.16)] border border-[#EDDCC6]/40">
                  {/* Decorative corner elements */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[#BF4646]/8 to-transparent rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#7EACB5]/8 to-transparent rounded-full blur-2xl" />
                  
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="h-px bg-gradient-to-r from-[#EDDCC6] via-[#7EACB5] to-[#EDDCC6] flex-1" />
                      <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#7EACB5]">Article Content</span>
                      <div className="h-px bg-gradient-to-r from-[#EDDCC6] via-[#7EACB5] to-[#EDDCC6] flex-1" />
                    </div>
                    
                    <RichContent 
                      html={articleHtml} 
                      className="leading-8 prose-p:my-6 prose-h2:my-8 prose-h3:my-6 prose-ul:my-6 prose-headings:text-[#BF4646] prose-headings:font-bold prose-a:text-[#7EACB5] prose-a:font-medium prose-a:border-b prose-a:border-b-[#7EACB5]/30 prose-strong:text-[#BF4646] prose-blockquote:border-l-[#BF4646] prose-blockquote:bg-[#FFF4EA] prose-blockquote:p-4 prose-blockquote:rounded-lg prose-code:bg-[#EDDCC6] prose-code:text-[#BF4646] prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm [&_*]:transition-colors duration-300" 
                    />
                  </div>
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

                <div className={cn(isClassified ? "mx-auto w-full max-w-5xl" : "mt-8")}>
                  <div className={cn("relative rounded-[3rem] overflow-hidden", isVisualTask ? "bg-white/5 backdrop-blur-sm border border-white/10" : "bg-gradient-to-br from-white via-[#FFFEFA] to-[#FFF4EA] border border-[#EDDCC6]/40")}>
                    {/* Decorative elements */}
                    {!isVisualTask && (
                      <>
                        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#BF4646]/8 to-transparent rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#7EACB5]/8 to-transparent rounded-full blur-2xl" />
                      </>
                    )}
                    
                    <div className="relative p-8 sm:p-12">
                      <div className={cn("flex flex-wrap items-center gap-3 mb-6", isVisualTask ? "text-white/80" : "text-[#7EACB5]")}>
                        <Badge className={cn("inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.2em]", isVisualTask ? "bg-white/10 border border-white/20 text-white" : "bg-[#BF4646]/10 border border-[#BF4646]/20 text-[#BF4646]")}>
                          <span className="w-2 h-2 bg-current rounded-full animate-pulse" />
                          {category}
                        </Badge>
                        {location && (
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 backdrop-blur-sm text-sm font-medium">
                            <MapPin className="h-4 w-4" />
                            {location}
                          </span>
                        )}
                      </div>
                      
                      <h1 className={cn("text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.02] tracking-[-0.06em] mb-6", isVisualTask ? "text-white" : "text-[#BF4646]")}>
                        {post.title}
                      </h1>
                      
                      <div className={cn("max-w-4xl", isVisualTask ? "[&_p]:text-slate-300 [&_a]:text-white [&_strong]:text-white" : "prose-headings:text-[#BF4646] prose-headings:font-bold prose-a:text-[#7EACB5] prose-a:font-medium prose-strong:text-[#BF4646]")}>
                        <RichContent html={descriptionHtml} />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : null}

            {isClassified ? (
              <div className="mx-auto w-full max-w-4xl rounded-[2rem] border border-[#EDDCC6] bg-white/92 p-6">
                <h2 className="text-lg font-semibold text-[#BF4646]">Business details</h2>
                <div className="mt-4 space-y-3 text-sm text-[#7EACB5]">
                  {content.website && (
                    <div className="flex items-start gap-2">
                      <Globe className="mt-0.5 h-4 w-4" />
                      <a
                        href={content.website}
                        className="break-all text-[#BF4646] hover:underline"
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
                        className="break-all text-[#BF4646] hover:underline"
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
              <div className="mx-auto w-full max-w-4xl rounded-[2rem] border border-[#EDDCC6] bg-white/92 p-4">
                <p className="text-sm font-semibold text-[#BF4646]">Location map</p>
                <div className="mt-4 overflow-hidden rounded-xl border border-[#EDDCC6]">
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
