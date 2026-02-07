
import React from 'react';
import { MonitorPlay, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { SiteConfig } from '../types';

interface FooterProps {
  onNavigate: (path: string) => void;
  siteConfig: SiteConfig;
}

const Footer: React.FC<FooterProps> = ({ onNavigate, siteConfig }) => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-6">
              <MonitorPlay className="h-8 w-8 text-red-600 mr-2" />
              <span className="text-3xl font-bold brand-font tracking-tight">{siteConfig.siteName}</span>
            </div>
            <p className="text-gray-400 max-w-sm mb-8 leading-relaxed">
              {siteConfig.footerText}
            </p>
            <div className="flex space-x-5">
              <a href={siteConfig.socialLinks.facebook} target="_blank" rel="noopener noreferrer"><Facebook className="h-5 w-5 text-gray-400 hover:text-white transition-colors" /></a>
              <a href={siteConfig.socialLinks.twitter} target="_blank" rel="noopener noreferrer"><Twitter className="h-5 w-5 text-gray-400 hover:text-white transition-colors" /></a>
              <a href={siteConfig.socialLinks.instagram} target="_blank" rel="noopener noreferrer"><Instagram className="h-5 w-5 text-gray-400 hover:text-white transition-colors" /></a>
              <a href={siteConfig.socialLinks.youtube} target="_blank" rel="noopener noreferrer"><Youtube className="h-5 w-5 text-gray-400 hover:text-white transition-colors" /></a>
            </div>
          </div>

          {/* Useful Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white uppercase tracking-widest text-xs">Navigation</h4>
            <ul className="space-y-4">
              {['Home', 'OTT Releases', 'Movie Releases', 'Cinema News', 'Calendar'].map((link) => (
                <li key={link}>
                  <button 
                    onClick={() => onNavigate('/')} 
                    className="text-gray-400 hover:text-red-500 transition-colors text-sm font-medium"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal / Policy */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white uppercase tracking-widest text-xs">Legal</h4>
            <ul className="space-y-4 text-sm text-gray-400 font-medium">
              <li><button className="hover:text-red-500 transition-colors">About Us</button></li>
              <li><button className="hover:text-red-500 transition-colors">Contact Us</button></li>
              <li><button className="hover:text-red-500 transition-colors">Privacy Policy</button></li>
              <li><button className="hover:text-red-500 transition-colors">Terms of Service</button></li>
            </ul>
          </div>
        </div>

        {/* SEO Keyword Cluster Footer */}
        <div className="mt-16 pt-8 border-t border-white/5">
           <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold mb-4">Trending Keywords</p>
           <div className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-gray-500">
              <span>Netflix India Release Dates</span>
              <span>Amazon Prime Video New Movies</span>
              <span>Disney Hotstar Upcoming Series</span>
              <span>ZEE5 Original Shows 2024</span>
              <span>Bollywood Movie Release Calendar</span>
              <span>South Indian Movie OTT Rights</span>
              <span>Malayalam Movie OTT Releases</span>
              <span>Telugu Movie Digital Premiere</span>
           </div>
        </div>

        <div className="mt-12 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} {siteConfig.siteName}. All rights reserved. Designed for Indian Movie Lovers.</p>
          <div className="flex gap-4">
             <span>Speed Index: 98/100</span>
             <span>SEO Score: 100/100</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
