import type { SerializedEditorState } from 'lexical'
import { RichText } from '@payloadcms/richtext-lexical/react'

type ArticleContentProps = {
  content: SerializedEditorState
}

export function ArticleContent({ content }: ArticleContentProps) {
  return (
    <RichText
      className="prose prose-lg prose-money max-w-none prose-headings:font-headline-md prose-headings:text-on-surface prose-p:font-body-md prose-p:text-on-surface-variant prose-a:text-primary prose-img:rounded-xl prose-strong:text-on-surface"
      data={content}
    />
  )
}
