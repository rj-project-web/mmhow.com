type KeyTakeawaysProps = {
  points: string[]
}

export function KeyTakeaways({ points }: KeyTakeawaysProps) {
  if (!points.length) return null

  return (
    <aside
      aria-label="Key takeaways"
      className="rounded-xl border border-blue-200/70 bg-blue-50/80 px-5 py-4"
    >
      <h2 className="mb-3 font-label-md text-label-md uppercase tracking-widest text-primary">
        Key Takeaways
      </h2>
      <ul className="flex list-disc flex-col gap-2 pl-5 font-body-md text-body-md text-on-surface">
        {points.map((point, index) => (
          <li key={index}>{point}</li>
        ))}
      </ul>
    </aside>
  )
}
