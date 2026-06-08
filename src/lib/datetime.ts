/** Format as `2026-06-07 15:30` (24-hour, local time). */
export function formatDateTime(value?: string | Date | null): string {
  if (!value) return ''

  const d = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(d.getTime())) return ''

  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}
