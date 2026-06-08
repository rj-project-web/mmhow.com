'use client'

import type { DefaultServerCellComponentProps } from 'payload'

import { formatDateTime } from '@/lib/datetime'

export function PublishedAtCell({ cellData }: DefaultServerCellComponentProps) {
  const text = formatDateTime(cellData as string | null)
  return <span>{text || '—'}</span>
}
