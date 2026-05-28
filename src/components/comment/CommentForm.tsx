'use client'

import { useState } from 'react'

type CommentFormProps = {
  articleId: string | number
}

export function CommentForm({ articleId }: CommentFormProps) {
  const [authorName, setAuthorName] = useState('')
  const [authorEmail, setAuthorEmail] = useState('')
  const [content, setContent] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authorName,
          authorEmail,
          content,
          article: articleId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit comment')
      }

      setAuthorName('')
      setAuthorEmail('')
      setContent('')
      setStatus('success')
      setMessage('Thanks! Your comment has been submitted for review.')
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <form className="flex flex-col gap-4 rounded-xl border border-tertiary bg-surface-container-lowest p-6" onSubmit={handleSubmit}>
      <h3 className="font-headline-md text-headline-md text-on-surface">Leave a Comment</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <input
          className="rounded-DEFAULT border border-tertiary bg-surface px-4 py-3 font-body-md text-body-md focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          onChange={(event) => setAuthorName(event.target.value)}
          placeholder="Your name"
          required
          value={authorName}
        />
        <input
          className="rounded-DEFAULT border border-tertiary bg-surface px-4 py-3 font-body-md text-body-md focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          onChange={(event) => setAuthorEmail(event.target.value)}
          placeholder="Email (optional)"
          type="email"
          value={authorEmail}
        />
      </div>
      <textarea
        className="min-h-32 rounded-DEFAULT border border-tertiary bg-surface px-4 py-3 font-body-md text-body-md focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        onChange={(event) => setContent(event.target.value)}
        placeholder="Share your thoughts..."
        required
        value={content}
      />
      <button
        className="self-start rounded-DEFAULT bg-primary px-6 py-3 font-label-md text-label-md text-on-primary transition-colors hover:bg-surface-tint disabled:opacity-60"
        disabled={status === 'loading'}
        type="submit"
      >
        {status === 'loading' ? 'Submitting...' : 'Post Comment'}
      </button>
      {message && (
        <p className={`font-body-md text-body-md ${status === 'error' ? 'text-error' : 'text-primary'}`}>
          {message}
        </p>
      )}
    </form>
  )
}
