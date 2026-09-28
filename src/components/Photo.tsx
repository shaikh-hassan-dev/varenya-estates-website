import type { ImageSlot } from '../content/content'

export function Photo({ image, eager = false, className = '' }: { image: ImageSlot; eager?: boolean; className?: string }) {
  const { src, srcSet, sizes, alt, width, height, sources } = image
  const img = (
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : undefined}
      decoding="async"
      className={`w-full h-full min-h-0 object-cover rounded ${className}`}
    />
  )
  if (!sources) return img
  return (
    <picture className="contents">
      {sources.map((s) => (
        <source key={s.media} type="image/webp" {...s} />
      ))}
      {img}
    </picture>
  )
}
