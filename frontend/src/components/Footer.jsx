import React from 'react';
import { useTheme } from '../../src/contexts/ThemeContext';

const Footer = () => {
  const { theme } = useTheme();

  return (
    <footer className={`${theme === 'light' ? 'bg-gray-200 text-gray-800' : 'bg-gray-800 text-white'} py-8`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-lg font-semibold">Flagright</p>
            <p className="text-sm">© 2025 Flagright. All rights reserved.</p>
          </div>
          <div className="text-center">
            <p className="text-sm">Made with ❤️ by Akshitha Mittapally</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
