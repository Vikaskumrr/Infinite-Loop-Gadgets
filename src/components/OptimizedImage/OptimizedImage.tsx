import React from 'react';
import { buildImageProxyUrl, buildProductFallbackImage, buildResponsiveSrcSet } from '../../utils/images';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallbackSrc?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({ src, fallbackSrc, sizes = '(max-width: 768px) 90vw, 600px', onError, ...props }) => {
  const [activeSrc, setActiveSrc] = React.useState(src);
  const [hasTriedProxy, setHasTriedProxy] = React.useState(false);
  const resolvedFallbackSrc = fallbackSrc || buildProductFallbackImage(typeof props.alt === 'string' ? props.alt : undefined);
  const srcSet = buildResponsiveSrcSet(activeSrc);

  React.useEffect(() => {
    setActiveSrc(src);
    setHasTriedProxy(false);
  }, [src]);

  return (
    <img
      {...props}
      src={activeSrc}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      loading={props.loading || 'lazy'}
      decoding={props.decoding || 'async'}
      onError={(event) => {
        const proxySrc = buildImageProxyUrl(src);
        if (!hasTriedProxy && proxySrc && activeSrc !== proxySrc) {
          setHasTriedProxy(true);
          setActiveSrc(proxySrc);
        } else if (activeSrc !== resolvedFallbackSrc) {
          setActiveSrc(resolvedFallbackSrc);
        }
        onError?.(event);
      }}
    />
  );
};

export default OptimizedImage;
