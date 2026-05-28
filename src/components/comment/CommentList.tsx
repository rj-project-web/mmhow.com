import { formatDate } from '@/lib/payload'

type CommentItem = {
  id: string | number
  authorName: string
  content: string
  createdAt?: string
}

export function CommentList({ comments }: { comments: CommentItem[] }) {
  if (comments.length === 0) {
    return (
      <p className="font-body-md text-body-md text-on-surface-variant">
        No comments yet. Be the first to share your thoughts.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {comments.map((comment) => (
        <article
          key={comment.id}
          className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5"
        >
          <div className="mb-2 flex items-center justify-between gap-4">
            <h4 className="font-label-md text-label-md text-on-surface">{comment.authorName}</h4>
            <time className="font-body-md text-sm text-on-surface-variant">
              {formatDate(comment.createdAt)}
            </time>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">{comment.content}</p>
        </article>
      ))}
    </div>
  )
}
