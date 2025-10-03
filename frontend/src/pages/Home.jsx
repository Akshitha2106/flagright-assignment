import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const Home = () => {
  const { theme } = useTheme();

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <section className={`${theme === 'light' ? 'bg-gray-900 text-white' : 'bg-gray-800 text-white'} text-center py-20`}>
          <h1 className="text-5xl font-bold mb-4">The Future of AML Compliance</h1>
          <p className="text-xl mb-8">Consolidated, real-time, and API-first AML compliance and fraud detection.</p>
          <Link to="/users">
            <button className={`${theme === 'light' ? 'bg-blue-500 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700'} text-white font-bold py-2 px-4 rounded`}>
              Get Started
            </button>
          </Link>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className={`${theme === 'light' ? 'bg-white' : 'bg-purple-900'} p-8 rounded-lg shadow-md`}>
                <h3 className="text-2xl font-bold mb-4">Real-time Monitoring</h3>
                <p>Monitor transactions in real-time to detect and prevent financial crimes as they happen.</p>
              </div>
              <div className={`${theme === 'light' ? 'bg-white' : 'bg-purple-900'} p-8 rounded-lg shadow-md`}>
                <h3 className="text-2xl font-bold mb-4">Graph-Based Visualization</h3>
                <p>Visualize complex relationships between users and transactions to uncover hidden patterns of fraudulent activity.</p>
              </div>
              <div className={`${theme === 'light' ? 'bg-white' : 'bg-purple-900'} p-8 rounded-lg shadow-md`}>
                <h3 className="text-2xl font-bold mb-4">API-First</h3>
                <p>Integrate our powerful AML and fraud detection capabilities into your existing applications with our developer-friendly APIs.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
