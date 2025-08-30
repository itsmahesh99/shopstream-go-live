import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileHeaderProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  title?: string;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  title = "Dashboard"
}) => {
  return (
    <header className="lg:hidden sticky top-0 z-50 bg-white shadow-sm border-b">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link to="/home" className="flex-shrink-0">
          <img 
            src="/keinlogo.png" 
            alt="Kein Logo" 
            className="h-8 w-auto"
          />
        </Link>

        {/* Page Title */}
        <h1 className="text-lg font-semibold text-gray-900 truncate mx-4">
          {title}
        </h1>

        {/* Hamburger Menu Button */}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex-shrink-0"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6 text-gray-600" />
          ) : (
            <Menu className="h-6 w-6 text-gray-600" />
          )}
        </Button>
      </div>
    </header>
  );
};

export default MobileHeader;
