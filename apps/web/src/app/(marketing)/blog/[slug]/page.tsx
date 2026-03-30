import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, ArrowRight } from 'lucide-react'
import { getPostBySlug, getRelatedPosts, getAllPublishedSlugs, blogCategories, type BlogCategory } from '@/lib/blog'
import { ArticleContent } from '@/components/marketing/ArticleContent'
import { BlogCard } from '@/components/marketing/BlogCard'
import { ShareButtons } from '@/components/marketing/ShareButtons'
import { EmailCapture } from '@/components/marketing/EmailCapture'
import { Button } from '@/components/ui/button'

interface PageProps {
  params: Promise<{ slug: string }>
}

export const revalidate = 3600

export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs()
  return slugs.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return { title: 'Post Not Found | The Dad Center' }
  }

  const title = post.metaTitle || post.title
  const description = post.metaDescription || post.excerpt

  return {
    title: `${title} | The Dad Center Blog`,
    description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title,
      description,
      type: 'article',
      url: `/blog/${slug}`,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      section: blogCategories[post.category as BlogCategory]?.label || post.category,
      authors: [post.author],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(slug, post.category, 2)
  const categoryConfig = blogCategories[post.category as BlogCategory]

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    wordCount: post.content.split(/\s+/).length,
    articleSection: categoryConfig?.label || post.category,
    author: {
      '@type': 'Organization',
      name: 'The Dad Center',
      url: 'https://thedadcenter.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'The Dad Center',
      url: 'https://thedadcenter.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://thedadcenter.com/images/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://thedadcenter.com/blog/${slug}`,
    },
    ...(post.featuredImage && { image: post.featuredImage }),
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://thedadcenter.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://thedadcenter.com/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `https://thedadcenter.com/blog/${slug}`,
      },
    ],
  }

  return (
    <div className="min-h-screen bg-[--bg]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Header */}
      <div className="bg-gradient-to-b from-[--surface] to-[--bg] pt-24 pb-12 md:pt-32 md:pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-ui text-[--muted] hover:text-[--white] transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          {/* Post metadata */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {categoryConfig && (
              <span className={`font-ui px-2.5 py-1 rounded-md text-xs font-medium ${categoryConfig.color}`}>
                {categoryConfig.label}
              </span>
            )}
            <time className="font-body text-sm text-[--dim]" dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </time>
            <span className="flex items-center gap-1.5 font-body text-[--dim]">
              <Clock className="h-4 w-4" />
              {post.readTime} min read
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-[--white] mb-6">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="font-body text-lg text-[--muted] mb-6">{post.excerpt}</p>

          {/* Share */}
          <ShareButtons url={`/blog/${slug}`} title={post.title} description={post.excerpt} />
        </div>
      </div>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ArticleContent content={post.content.replace(/^#\s+.+\n+/, '')} />

        {/* Bottom CTA */}
        <div className="mt-12 p-8 rounded-2xl bg-[--surface]/50 border border-[--border] text-center">
          <h3 className="font-display text-xl font-bold text-[--white] mb-3">
            Want this as a personalized weekly plan?
          </h3>
          <p className="font-body text-[--muted] mb-6 max-w-lg mx-auto">
            Get week-by-week briefings, task management, budget tracking, and partner sync — all
            tailored to your due date.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-copper hover:bg-copper/80 text-white font-ui font-semibold"
          >
            <Link href="/signup">
              Start Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>

        {/* Email Capture */}
        <div className="mt-12">
          <EmailCapture source="blog-post" />
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl font-bold text-[--white] mb-6">Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((related) => (
                <BlogCard key={related.slug} post={related} />
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  )
}
