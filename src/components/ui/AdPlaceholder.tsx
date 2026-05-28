type AdPlaceholderProps = {
  label: string
  className?: string
}

export function AdPlaceholder({ label, className = '' }: AdPlaceholderProps) {
  return (
    <div
      className={`ad-placeholder relative flex items-center justify-center rounded-DEFAULT border border-tertiary ${className}`}
    >
      <span className="absolute left-2 top-2 font-label-md text-[10px] uppercase tracking-wider text-outline">
        Advertisement
      </span>
      <span className="font-body-md text-body-md text-tertiary-container">{label}</span>
    </div>
  )
}
