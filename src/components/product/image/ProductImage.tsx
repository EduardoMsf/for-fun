import Image from 'next/image';

interface Props {
  src?: string;
  alt: string;
  className?: React.StyleHTMLAttributes<HTMLImageElement>['className'];
  style?: React.StyleHTMLAttributes<HTMLImageElement>['style'];
  width?: number;
  height?: number;
  loading?: 'eager' | 'lazy';
}

export const ProductImage = ({
  src,
  alt,
  className,
  width,
  height,
  style,
  loading,
}: Props) => {
  const localSrc = src
    ? src.startsWith('http')
      ? src
      : `/products/${src}`
    : `/imgs/placeholder.jpg`;
  return (
    <Image
      src={localSrc}
      width={width || 80}
      height={height || 80}
      alt={alt}
      className={className || 'w-20 h-20 object-cover rounded'}
      style={style}
      loading={loading}
    />
  );
};
