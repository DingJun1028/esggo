/**
 * 🖼️ Image - 圖片優化組件
 * 支援 Lazy Loading、Blur Placeholder、響應式圖片
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, AlertCircle, RefreshCw } from 'lucide-react';

// ==================== 類型定義 ====================

export interface OptimizedImageProps {
  /** 圖片來源 */
  src: string;
  /** 圖片替代文字 */
  alt: string;
  /** 圖片寬度 */
  width?: number | string;
  /** 圖片高度 */
  height?: number | string;
  /** 樣式名稱 */
  className?: string;
  /** 圖片填充模式 */
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  /** 是否啟用 Lazy Loading */
  lazy?: boolean;
  /** 是否顯示載入動畫 */
  showLoading?: boolean;
  /** 自定義載入中的佔位符 */
  placeholder?: React.ReactNode;
  /** 自定義錯誤顯示 */
  errorPlaceholder?: React.ReactNode;
  /** 模糊效果強度 */
  blurAmount?: number;
  /** 響應式圖片來源 */
  srcSet?: {
    src: string;
    width: number;
  }[];
  /** 預設圖片（載入失敗時顯示） */
  fallbackSrc?: string;
  /** 點擊處理函數 */
  onClick?: () => void;
  /** 載入完成回調 */
  onLoad?: () => void;
  /** 載入錯誤回調 */
  onError?: (error: Error) => void;
  /** 動畫持續時間 */
  animationDuration?: number;
  /** 是否顯示圖片資訊標籤 */
  showInfo?: boolean;
}

// ==================== 圖片快取鉤子 ====================

const imageCache = new Set<string>();

export const useImagePreload = (src: string) => {
  const [isLoaded, setIsLoaded] = useState(imageCache.has(src));
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!src) return;

    if (imageCache.has(src)) {
      setIsLoaded(true);
      return;
    }

    const img = new Image();
    img.src = src;

    const handleLoad = () => {
      imageCache.add(src);
      setIsLoaded(true);
    };

    const handleError = () => {
      setHasError(true);
    };

    img.addEventListener('load', handleLoad);
    img.addEventListener('error', handleError);

    return () => {
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
    };
  }, [src]);

  return { isLoaded, hasError };
};

// ==================== 圖片載入鉤子 ====================

export const useImageLoader = (src: string, lazy: boolean = true) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!lazy || isInView) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observerRef.current?.disconnect();
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.01,
      }
    );

    const element = imgRef.current?.parentElement;
    if (element) {
      observerRef.current.observe(element);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [lazy, isInView]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  return {
    imgRef,
    isLoaded,
    isInView,
    hasError,
    handleLoad,
    handleError,
  };
};

// ==================== 優化圖片組件 ====================

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width = '100%',
  height = 'auto',
  className = '',
  objectFit = 'cover',
  lazy = true,
  showLoading = true,
  placeholder,
  errorPlaceholder,
  blurAmount = 10,
  srcSet: customSrcSet,
  fallbackSrc,
  onClick,
  onLoad,
  onError,
  animationDuration = 0.3,
  showInfo = false,
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { imgRef, isInView, handleLoad, handleError } = useImageLoader(src, lazy);

  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
    setCurrentSrc(src);
  }, [src]);

  const handleImageLoad = useCallback(() => {
    setIsLoaded(true);
    imageCache.add(currentSrc || src);
    onLoad?.();
  }, [currentSrc, src, onLoad]);

  const handleImageError = useCallback(() => {
    setHasError(true);
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
    } else {
      onError?.(new Error('Image load failed'));
    }
  }, [fallbackSrc, currentSrc, onError]);

  // 生成 srcSet 屬性
  const generateSrcSet = () => {
    if (!customSrcSet) return undefined;
    return customSrcSet.map((s) => `${s.src} ${s.width}w`).join(', ');
  };

  // 錯誤佔位符
  const renderErrorPlaceholder = () => {
    if (errorPlaceholder) return errorPlaceholder;

    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-gray-100 text-gray-400">
        <AlertCircle size={32} />
        <span className="text-sm mt-2">圖片載入失敗</span>
      </div>
    );
  };

  // 載入中佔位符
  const renderPlaceholder = () => {
    if (placeholder) return placeholder;

    return (
      <div className="flex items-center justify-center w-full h-full bg-gray-100">
        {showLoading && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <RefreshCw size={24} className="text-gray-400" />
          </motion.div>
        )}
      </div>
    );
  };

  // 圖片樣式
  const imageStyle: React.CSSProperties = {
    width,
    height,
    objectFit,
    opacity: isLoaded ? 1 : 0,
    transition: `opacity ${animationDuration}s ease-in-out`,
    filter: isLoaded ? 'none' : `blur(${blurAmount}px)`,
  };

  // 處理錯誤狀態
  if (hasError && !currentSrc) {
    return (
      <div
        className={`overflow-hidden ${className}`}
        style={{ width, height }}
        onClick={onClick}
      >
        {renderErrorPlaceholder()}
      </div>
    );
  }

  return (
    <div
      ref={(el) => {
        if (el && !lazy) {
          (imgRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        }
      }}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
      onClick={onClick}
    >
      {/* 載入中佔位符 */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: animationDuration }}
            className="absolute inset-0 z-10"
            style={{ width, height }}
          >
            {renderPlaceholder()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 圖片 */}
      {isInView && (
        <img
          ref={imgRef as React.LegacyRef<HTMLImageElement>}
          src={currentSrc}
          srcSet={generateSrcSet()}
          sizes={customSrcSet ? '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw' : undefined}
          alt={alt}
          style={imageStyle}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading={lazy ? 'lazy' : 'eager'}
          decoding={lazy ? 'async' : 'sync'}
        />
      )}

      {/* 圖片資訊標籤 */}
      {showInfo && isLoaded && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-2 right-2 px-2 py-1 bg-black/50 text-white text-xs rounded"
        >
          {typeof width === 'number' ? `${width}px` : width} × {typeof height === 'number' ? `${height}px` : height}
        </motion.div>
      )}
    </div>
  );
};

// ==================== 響應式圖片組件 ====================

export interface ResponsiveImageProps {
  /** 圖片來源 */
  src: string;
  /** 替代文字 */
  alt: string;
  /** 斷點配置 */
  breakpoints?: {
    width: number;
    src: string;
  }[];
  /** 預設圖片 */
  fallbackSrc?: string;
  /** 其他屬性 */
  className?: string;
  objectFit?: 'cover' | 'contain' | 'fill';
  lazy?: boolean;
  aspectRatio?: string;
  onClick?: () => void;
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  breakpoints = [
    { width: 640, src: `${src}?w=640` },
    { width: 1024, src: `${src}?w=1024` },
    { width: 1920, src: `${src}?w=1920` },
  ],
  fallbackSrc,
  className = '',
  objectFit = 'cover',
  lazy = true,
  aspectRatio = '16/9',
  onClick,
}) => {
  // 排序斷點
  const sortedBreakpoints = [...breakpoints].sort((a, b) => a.width - b.width);

  // 生成 srcSet
  const srcSet = sortedBreakpoints.map((bp) => `${bp.src} ${bp.width}w`).join(', ');

  return (
    <div className={`relative ${className}`} style={{ aspectRatio }}>
      <OptimizedImage
        src={fallbackSrc || src}
        srcSet={sortedBreakpoints.map((bp) => ({ src: bp.src, width: bp.width }))}
        alt={alt}
        objectFit={objectFit}
        lazy={lazy}
        onClick={onClick}
      />
    </div>
  );
};

// ==================== 頭像組件 ====================

export interface AvatarProps {
  /** 圖片來源 */
  src?: string;
  /** 姓名（用於生成首字母） */
  name?: string;
  /** 尺寸 */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  /** 樣式 */
  className?: string;
  /** 是否圓形 */
  rounded?: boolean;
  /** 載入錯誤時顯示首字母 */
  showInitials?: boolean;
  /** 背景顏色 */
  bgColor?: string;
  onClick?: () => void;
}

const sizeMap = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  className = '',
  rounded = true,
  showInitials = true,
  bgColor = 'bg-blue-500',
  onClick,
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeValue = typeof size === 'number' ? size : sizeMap[size];
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  const handleError = useCallback(() => {
    setImageError(true);
  }, []);

  const renderContent = () => {
    if (src && !imageError) {
      return (
        <OptimizedImage
          src={src}
          alt={name || 'Avatar'}
          width={sizeValue}
          height={sizeValue}
          objectFit="cover"
          onError={handleError}
        />
      );
    }

    if (showInitials) {
      return (
        <div
          className={`flex items-center justify-center text-white font-semibold ${bgColor}`}
          style={{ width: sizeValue, height: sizeValue }}
        >
          {initials}
        </div>
      );
    }

    return (
      <div
        className={`flex items-center justify-center ${bgColor}`}
        style={{ width: sizeValue, height: sizeValue }}
      >
        <ImageIcon size={sizeValue * 0.5} className="text-white" />
      </div>
    );
  };

  return (
    <div
      className={`overflow-hidden ${rounded ? 'rounded-full' : 'rounded-lg'} ${className}`}
      style={{ width: sizeValue, height: sizeValue }}
      onClick={onClick}
    >
      {renderContent()}
    </div>
  );
};

// ==================== 圖片網格組件 ====================

export interface ImageGridProps {
  /** 圖片陣列 */
  images: {
    src: string;
    alt: string;
    caption?: string;
  }[];
  /** 列數 */
  columns?: number;
  /** 間距 */
  gap?: number;
  /** 圖片寬度 */
  imageWidth?: number;
  /** 是否圓角 */
  rounded?: boolean;
  /** 點擊處理 */
  onImageClick?: (index: number) => void;
}

export const ImageGrid: React.FC<ImageGridProps> = ({
  images,
  columns = 3,
  gap = 16,
  imageWidth = 200,
  rounded = true,
  onImageClick,
}) => {
  return (
    <div
      className="grid gap-4"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(${imageWidth}px, 1fr))`,
        gap,
      }}
    >
      {images.map((image, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`relative overflow-hidden ${rounded ? 'rounded-xl' : ''}`}
          onClick={() => onImageClick?.(index)}
          style={{ cursor: onImageClick ? 'pointer' : 'default' }}
        >
          <OptimizedImage
            src={image.src}
            alt={image.alt}
            width="100%"
            height="auto"
            objectFit="cover"
            aspectRatio="1"
            showInfo={false}
          />
          {image.caption && (
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
              <p className="text-white text-sm truncate">{image.caption}</p>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

// ==================== 預載入圖片 ====================

export const preloadImages = (srcs: string[]): Promise<void[]> => {
  return Promise.all(
    srcs.map(
      (src) =>
        new Promise<void>((resolve, reject) => {
          if (imageCache.has(src)) {
            resolve();
            return;
          }

          const img = new Image();
          img.src = src;

          img.onload = () => {
            imageCache.add(src);
            resolve();
          };

          img.onerror = () => {
            reject(new Error(`Failed to load image: ${src}`));
          };
        })
    )
  );
};

// ==================== 使用範例 ====================

/**
 * 使用範例
 * 
 * ```tsx
 * import { OptimizedImage, ResponsiveImage, Avatar, ImageGrid, preloadImages } from '@/components/ui';
 * 
 * // 基本使用
 * const BasicImage = () => (
 *   <OptimizedImage
 *     src=\"https://example.com/image.jpg\"
 *     alt=\"範例圖片\"
 *     width={400}
 *     height={300}\n     lazy={true}\n     showLoading={true}\n   />\n );\n * \n * // 響應式圖片\n * const ResponsiveExample = () => (\n *   <ResponsiveImage\n *     src=\"https://example.com/photo.jpg\"\n *     alt=\"響應式圖片\"\n *     breakpoints={[\n *       { width: 640, src: 'https://example.com/photo-sm.jpg' },\n *       { width: 1024, src: 'https://example.com/photo-md.jpg' },\n *       { width: 1920, src: 'https://example.com/photo-lg.jpg' },\n *     ]}\n *   />\n );\n * \n // 頭像\n * const UserAvatar = () => (\n *   <Avatar\n *     src=\"https://example.com/avatar.jpg\"\n *     name=\"張三\"\n *     size=\"lg\"\n *     rounded={true}\n *   />\n );\n * \n // 圖片網格\n * const PhotoGallery = () => (\n *   <ImageGrid\n *     images={[\n *       { src: '/img1.jpg', alt: '圖片1', caption: '美麗風景' },\n *       { src: '/img2.jpg', alt: '圖片2', caption: '城市風光' },\n *       { src: '/img3.jpg', alt: '圖片3', caption: '自然景觀' },\n *     ]}\n *     columns={3}\n *     gap={16}\n *     onImageClick={(index) => console.log('Clicked:', index)}\n *   />\n );\n * \n // 預載入圖片\n * const preload = async () => {\n *   await preloadImages(['/img1.jpg', '/img2.jpg', '/img3.jpg']);\n *   console.log('Images preloaded!');\n * };\n * ```
 */

export default OptimizedImage;
