import Image from 'next/image'
import Link from 'next/link'

/** Source asset dimensions (public/mmhow-logo.png) */
const LOGO_WIDTH = 951
const LOGO_HEIGHT = 354

type SiteLogoProps = {
  /** Tailwind height class, e.g. h-[72px] */
  sizeClass?: string
  className?: string
  priority?: boolean
}

export function SiteLogo({
  sizeClass = 'h-[65px]',
  className = '',
  priority = false,
}: SiteLogoProps) {
  return (
    <Link
      className={`inline-flex shrink-0 items-center transition-opacity hover:opacity-90 ${className}`}
      href="/"
    >
      <Image
        alt="MMHow.com — How to Make Money Online"
        className={`${sizeClass} w-auto max-w-none object-contain object-left`}
        height={LOGO_HEIGHT}
        priority={priority}
        quality={100}
        sizes="(max-width: 640px) 140px, 200px"
        src="/mmhow-logo.png"
        unoptimized
        width={LOGO_WIDTH}
      />
    </Link>
  )
}
