import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResponsiveGridProps {
  children: React.ReactNode;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'md',
  className = ''
}) => {
  const isMobile = useIsMobile();

  const getGridCols = () => {
    const { mobile = 1, tablet = 2, desktop = 3 } = columns;
    
    // Return proper Tailwind classes
    const mobileClass = `grid-cols-${mobile}`;
    const tabletClass = `md:grid-cols-${tablet}`;
    const desktopClass = `lg:grid-cols-${desktop}`;
    
    return `${mobileClass} ${tabletClass} ${desktopClass}`;
  };

  const getGapClass = () => {
    const gapMap = {
      sm: isMobile ? 'gap-3' : 'gap-4',
      md: isMobile ? 'gap-4' : 'gap-6',
      lg: isMobile ? 'gap-6' : 'gap-8',
      xl: isMobile ? 'gap-8' : 'gap-10'
    };
    
    return gapMap[gap];
  };

  return (
    <div className={`
      grid
      ${getGridCols()}
      ${getGapClass()}
      w-full
      ${className}
    `}>
      {children}
    </div>
  );
};

export default ResponsiveGrid;
