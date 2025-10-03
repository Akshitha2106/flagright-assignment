import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Sidebar from './components/Sidebar.jsx';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './pages/Home.jsx'
import Users from './pages/Users.jsx'
import About from './pages/About.jsx'

import Transactions from './pages/Transactions.jsx'
import Relationships from './pages/Relationships.jsx'
import { useTheme } from './contexts/ThemeContext.jsx'
import { useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme } from './theme';

import { Toaster } from 'react-hot-toast';
import Footer from './components/Footer.jsx';

function App() {
  const { theme } = useTheme();

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <MuiThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <Router>
        <Toaster
          position="top-center"
          toastOptions={{
            success: {
              style: {
                background: theme === 'light' ? '#dcfce7' : '#166534',
                color: theme === 'light' ? '#166534' : '#dcfce7',
              },
            },
            error: {
              style: {
                background: theme === 'light' ? '#fee2e2' : '#991b1b',
                color: theme === 'light' ? '#991b1b' : '#fee2e2',
              },
            },
          }}
        />
        <div className={`flex flex-col min-h-screen`}>
          <div className="flex flex-grow">
            <Sidebar />
            <main className={`flex-1 p-4 overflow-y-auto ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-900'}`}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/users" element={<Users />} />
                <Route path="/about" element={<About />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/relationships/user/:userId" element={<Relationships />} />
                <Route path="/relationships/transaction/:transactionId" element={<Relationships />} />
              </Routes>
            </main>
          </div>
          <Footer />
        </div>
      </Router>
    </MuiThemeProvider>
  );
}

export default App
