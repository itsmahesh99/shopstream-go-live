import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResponsivePageContainerProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  showPadding?: boolean;
}

const ResponsivePageContainer: React.FC<ResponsivePageContainerProps> = ({
  children,
  title,
  subtitle,
  className = '',
  showPadding = true
}) => {
  const isMobile = useIsMobile();

  return (
    <div className={`
      w-full min-h-screen
      ${showPadding ? (isMobile ? 'p-4' : 'p-6') : ''}
      ${className}
    `}>
      {/* Page Header */}
      {title && (
        <div className={`mb-6 ${isMobile ? 'mb-4' : 'mb-6'}`}>
          <h1 className={`
            font-bold text-gray-900
            ${isMobile ? 'text-xl' : 'text-2xl lg:text-3xl'}
          `}>
            {title}
          </h1>
          {subtitle && (
            <p className={`
              text-gray-600 mt-1
              ${isMobile ? 'text-sm' : 'text-base'}
            `}>
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Page Content */}
      <div className="w-full">
        {children}
      </div>
    </div>
  );
};

export default ResponsivePageContainer;
