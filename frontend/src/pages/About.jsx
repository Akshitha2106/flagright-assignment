import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const About = () => {
  const { theme } = useTheme();

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}>
      <h1 className="text-5xl font-bold mb-4">About Us</h1>
      <p className="text-xl text-center max-w-2xl">
        This is a demo application built to showcase the power of Flagright's APIs for fraud detection and anti-money laundering. We provide developers with the tools they need to build secure and compliant financial applications.
      </p>
    </div>
  );
};

export default About;
