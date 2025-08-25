import Image, { ImageProps } from "next/image"

/**
 * ImageSafe: thin wrapper around next/image that allows passing width/height OR fill via className.
 * Prefer width/height for performance. For unknown sizes, wrap parent in relative container and pass fill.
 */
export function ImageSafe(props: ImageProps) {
  const { alt, ...rest } = props
  return <Image alt={alt} {...rest} />
}
