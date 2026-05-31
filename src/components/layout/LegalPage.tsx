import type { ReactNode } from 'react'

type LegalPageProps = {
  eyebrow: string
  title: string
  description?: string
  lastUpdated: string
  children: ReactNode
}

export function LegalPage({ eyebrow, title, description, lastUpdated, children }: LegalPageProps) {
  return (
    <main className="mx-auto flex w-full max-w-container-max flex-grow flex-col gap-ad-clearance px-margin-mobile py-ad-clearance md:px-margin-desktop">
      <section className="card-fintech p-8 md:p-10">
        <span className="mb-3 block font-label-md text-label-md uppercase tracking-widest text-primary">
          {eyebrow}
        </span>
        <h1 className="mb-4 font-display-lg text-headline-lg-mobile md:text-display-lg text-on-surface">
          {title}
        </h1>
        {description && (
          <p className="max-w-3xl font-body-lg text-body-lg text-on-surface-variant">{description}</p>
        )}
        <p className="mt-4 font-body-md text-sm text-on-surface-variant">Last updated: {lastUpdated}</p>
      </section>

      <article className="card-fintech prose prose-money max-w-none p-8 md:p-10 prose-headings:font-headline-md prose-headings:text-on-surface prose-p:font-body-md prose-p:text-on-surface-variant prose-li:font-body-md prose-li:text-on-surface-variant prose-a:text-primary prose-strong:text-on-surface">
        {children}
      </article>
    </main>
  )
}
