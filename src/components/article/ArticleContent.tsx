import type { SerializedEditorState } from 'lexical'
import { RichText } from '@payloadcms/richtext-lexical/react'

type ArticleContentProps = {
  content: SerializedEditorState
}

export function ArticleContent({ content }: ArticleContentProps) {
  return (
    <RichText
      className="prose prose-lg prose-money max-w-none prose-headings:font-headline-md prose-headings:text-on-surface prose-p:font-body-md prose-p:text-on-surface-variant prose-a:text-primary prose-img:rounded-xl prose-strong:text-on-surface prose-table:w-full prose-th:bg-surface-container prose-th:px-4 prose-th:py-2 prose-td:px-4 prose-td:py-2"
      data={content}
    />
  )
}
