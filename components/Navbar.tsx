
import React, { useState } from 'react';
import { Menu, X, Search, ChevronDown, MonitorPlay } from 'lucide-react';
import { NAVIGATION } from '../constants';
import { SiteConfig } from '../types';

interface NavbarProps {
  onNavigate: (path: string) => void;
  siteConfig: SiteConfig;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, siteConfig }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => handleLinkClick('/')}>
            <MonitorPlay className="h-8 w-8 text-red-600 mr-2" />
            <span className="text-2xl font-bold text-gray-900 brand-font tracking-tight">{siteConfig.siteName}</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8 items-center">
            {NAVIGATION.map((item) => (
              <div key={item.path} className="relative group">
                <button
                  onClick={() => handleLinkClick(item.path)}
                  className="flex items-center text-sm font-semibold text-gray-700 hover:text-red-600 transition-colors uppercase tracking-wider py-5"
                >
                  {item.label}
                  {item.children && <ChevronDown className="ml-1 h-4 w-4" />}
                </button>
                
                {item.children && (
                  <div className="absolute left-0 mt-0 w-48 bg-white border border-gray-100 shadow-xl rounded-b-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    {item.children.map((child) => (
                      <button
                        key={child.path}
                        onClick={() => handleLinkClick(child.path)}
                        className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 border-b last:border-0 border-gray-50"
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <button className="text-gray-500 hover:text-red-600">
              <Search className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 pb-4">
          <div className="px-2 pt-2 space-y-1">
            {NAVIGATION.map((item) => (
              <div key={item.path}>
                <button
                  onClick={() => {
                    if (item.children) {
                      setActiveSubmenu(activeSubmenu === item.path ? null : item.path);
                    } else {
                      handleLinkClick(item.path);
                    }
                  }}
                  className="w-full text-left flex justify-between items-center px-3 py-4 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-red-600 border-b border-gray-50"
                >
                  {item.label}
                  {item.children && <ChevronDown className={`h-4 w-4 transition-transform ${activeSubmenu === item.path ? 'rotate-180' : ''}`} />}
                </button>
                {item.children && activeSubmenu === item.path && (
                  <div className="bg-gray-50 py-2">
                    {item.children.map((child) => (
                      <button
                        key={child.path}
                        onClick={() => handleLinkClick(child.path)}
                        className="block px-8 py-3 text-sm text-gray-600 hover:text-red-600"
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
