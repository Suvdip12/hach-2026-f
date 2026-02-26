import React from "react";
import ReactMarkdown from "react-markdown";

interface MarkdownProps {
  content: string;
  className?: string;
}

export const Markdown: React.FC<MarkdownProps> = ({ content, className }) => {
  return (
    <div className={`markdown-content ${className || ""}`}>
      <ReactMarkdown
        components={{
          // Override default elements styles if needed, or rely on global CSS
          // For now, we utilize the standard rendering
          p: ({ node, ...props }) => <p {...props} style={{ margin: 0 }} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
