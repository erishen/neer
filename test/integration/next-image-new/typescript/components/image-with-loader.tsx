import Image from 'neer/image'
import type {
  ImageProps,
  ImageLoader,
  ImageLoaderProps,
} from 'neer/image'

function myLoader({ src, width, quality }: ImageLoaderProps): string {
  return `https://example.com/${src}?w=${width}&q=${quality || 75}`
}
const loader: ImageLoader = myLoader

export function ImageWithLoader(props: Omit<ImageProps, 'loader'>) {
  return <Image loader={loader} {...props} />
}
