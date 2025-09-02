import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResponsiveCardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
}

const ResponsiveCard: React.FC<ResponsiveCardProps> = ({
  children,
  title,
  description,
  className = '',
  padding = 'md',
  shadow = 'md'
}) => {
  const isMobile = useIsMobile();

  const getPaddingClass = () => {
    if (padding === 'none') return '';
    
    const paddingMap = {
      sm: isMobile ? 'p-3' : 'p-4',
      md: isMobile ? 'p-4' : 'p-6',
      lg: isMobile ? 'p-6' : 'p-8'
    };
    
    return paddingMap[padding];
  };

  const getShadowClass = () => {
    const shadowMap = {
      none: '',
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg'
    };
    
    return shadowMap[shadow];
  };

  return (
    <div className={`
      bg-white rounded-lg border border-gray-200
      ${getShadowClass()}
      ${getPaddingClass()}
      ${className}
    `}>
      {/* Card Header */}
      {(title || description) && (
        <div className={`
          ${title && description ? 'mb-4' : 'mb-3'}
          ${padding !== 'none' ? '' : 'p-4 pb-0'}
        `}>
          {title && (
            <h3 className={`
              font-semibold text-gray-900
              ${isMobile ? 'text-lg' : 'text-xl'}
            `}>
              {title}
            </h3>
          )}
          {description && (
            <p className={`
              text-gray-600 mt-1
              ${isMobile ? 'text-sm' : 'text-base'}
            `}>
              {description}
            </p>
          )}
        </div>
      )}

      {/* Card Content */}
      <div className={padding === 'none' && (title || description) ? 'p-4 pt-0' : ''}>
        {children}
      </div>
    </div>
  );
};

export default ResponsiveCard;
