'use client';

import { useState } from 'react';
import Image from 'next/image';
import { createPlaceholderSVG } from '@/lib/image-fallbacks';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fallbackText?: string;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
}

export function ImageWithFallback({
  src,
  alt,
  width = 400,
  height = 200,
  fallbackText,
  className = "",
  priority = false,
  fill = false,
  sizes
}: Readonly<ImageWithFallbackProps>) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      const placeholder = createPlaceholderSVG(
        fallbackText || alt || 'Imagen no disponible',
        width,
        height
      );
      setImgSrc(placeholder);
    }
  };

  const commonProps = {
    src: imgSrc,
    alt,
    className,
    onError: handleError,
    priority
  };

  if (fill) {
    return (
      <Image
        {...commonProps}
        fill
        sizes={sizes}
      />
    );
  }

  return (
    <Image
      {...commonProps}
      width={width}
      height={height}
      sizes={sizes}
    />
  );
}

// Componente específico para imágenes de cursos
export function CourseImage({
  src,
  title,
  className = "w-full h-48 object-cover rounded-lg",
  priority = false
}: {
  src: string;
  title: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <ImageWithFallback
      src={src}
      alt={title}
      width={400}
      height={192} // h-48 = 12rem = 192px
      fallbackText={title}
      className={className}
      priority={priority}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
}
