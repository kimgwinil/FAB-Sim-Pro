import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * Renders a process theory chapter written in Markdown (GitHub-flavored,
 * so pipe tables are supported) with Tailwind-styled elements.
 */
export function TheoryView({ title, content }: { title: string; content: string }) {
  return (
    <div className="text-slate-700">
      <h3 className="text-lg font-semibold text-slate-900 leading-tight mb-4 border-b border-slate-200 pb-2 break-keep">
        {title}
      </h3>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => <h2 className="text-base font-semibold text-slate-900 mt-6 mb-2 border-b border-slate-200 pb-1 break-keep" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-base font-semibold text-slate-900 mt-6 mb-2 border-b border-slate-200 pb-1 break-keep" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-sm font-semibold text-slate-800 mt-4 mb-1.5 break-keep" {...props} />,
          h4: ({ node, ...props }) => <h4 className="text-sm font-semibold text-slate-800 mt-3 mb-1 break-keep" {...props} />,
          p: ({ node, ...props }) => <p className="text-sm leading-relaxed mb-3 break-keep" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc pl-5 text-sm mb-3 space-y-1" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal pl-5 text-sm mb-3 space-y-1" {...props} />,
          li: ({ node, ...props }) => <li className="leading-relaxed break-keep" {...props} />,
          strong: ({ node, ...props }) => <strong className="font-semibold text-slate-900" {...props} />,
          blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-blue-300 bg-blue-50 pl-3 pr-2 py-2 my-3 text-sm text-slate-700 rounded-r break-keep" {...props} />,
          a: ({ node, ...props }) => <a className="text-blue-600 underline" {...props} />,
          hr: ({ node, ...props }) => <hr className="my-5 border-slate-200" {...props} />,
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-3 border border-slate-200 rounded-lg bg-white">
              <table className="w-full text-sm text-left border-collapse" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => <thead className="bg-slate-100" {...props} />,
          th: ({ node, ...props }) => <th className="px-3 py-2 border border-slate-200 font-semibold text-slate-800 break-keep" {...props} />,
          td: ({ node, ...props }) => <td className="px-3 py-2 border border-slate-200 align-top break-keep" {...props} />,
          code: ({ node, ...props }) => <code className="px-1 py-0.5 bg-slate-100 rounded text-[0.85em] font-mono text-slate-800" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
