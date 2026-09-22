import type { ImageSlot } from '../content/content'

export function Photo({ image, eager = false }: { image: ImageSlot; eager?: boolean }) {
  const { src, srcSet, sizes, alt, width, height } = image
  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className="w-full h-full min-h-0 object-cover rounded"
    />
  )
}
