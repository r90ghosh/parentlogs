import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'

interface ArticleContentProps {
  content: string
  className?: string
}

export function ArticleContent({ content, className }: ArticleContentProps) {
  // Warm cream for body text, softer on the eyes
  const textColor = 'text-[--cream]'
  const headingColor = 'text-[--white]'

  return (
    <div className={cn('prose prose-invert max-w-none', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className={`font-display text-3xl md:text-4xl font-bold ${headingColor} mt-10 mb-6 first:mt-0 tracking-tight`}>
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className={`font-display text-2xl font-bold ${headingColor} mt-10 mb-5 pb-2 border-b border-[--border] tracking-tight`}>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className={`font-display text-xl font-semibold ${headingColor} mt-8 mb-4`}>{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className={`font-display text-lg font-semibold ${headingColor} mt-6 mb-3`}>{children}</h4>
          ),
          p: ({ children }) => (
            <p className={`font-body text-lg ${textColor} leading-[1.8] tracking-wide mb-6`}>{children}</p>
          ),
          ul: ({ children }) => (
            <ul className={`list-disc list-outside pl-6 mb-6 space-y-3 font-body text-lg ${textColor} leading-[1.8] tracking-wide`}>
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className={`list-decimal list-outside pl-6 mb-6 space-y-3 font-body text-lg ${textColor} leading-[1.8] tracking-wide`}>
              {children}
            </ol>
          ),
          li: ({ children }) => <li className={`font-body ${textColor} pl-2`}>{children}</li>,
          strong: ({ children }) => (
            <strong className={`font-semibold ${headingColor}`}>{children}</strong>
          ),
          em: ({ children }) => <em className={`italic ${textColor}`}>{children}</em>,
          blockquote: ({ children }) => (
            <blockquote className={`border-l-4 border-copper/60 pl-5 py-2 my-6 bg-[--surface]/30 rounded-r-lg font-body text-lg ${textColor} leading-[1.8] italic`}>
              {children}
            </blockquote>
          ),
          code: ({ children, className }) => {
            const isInline = !className
            if (isInline) {
              return (
                <code className="px-1.5 py-0.5 rounded bg-[--card]/80 text-copper/90 text-base font-mono">
                  {children}
                </code>
              )
            }
            return (
              <code className={`block p-4 rounded-lg bg-[--surface]/50 font-body ${textColor} text-base font-mono overflow-x-auto leading-relaxed`}>
                {children}
              </code>
            )
          },
          pre: ({ children }) => (
            <pre className="my-6 rounded-lg overflow-hidden">{children}</pre>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-copper/90 hover:text-copper underline underline-offset-4 decoration-copper/40"
            >
              {children}
            </a>
          ),
          hr: () => <hr className="my-10 border-[--border]/60" />,
          table: ({ children }) => (
            <div className="overflow-x-auto my-8">
              <table className="w-full border-collapse border border-[--border] rounded-lg overflow-hidden">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-[--card]/60">{children}</thead>
          ),
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => (
            <tr className="border-b border-[--border] last:border-0">{children}</tr>
          ),
          th: ({ children }) => (
            <th className={`px-4 py-3 text-left font-display text-base font-semibold ${headingColor}`}>
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className={`px-4 py-3 font-body text-base ${textColor}`}>{children}</td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
