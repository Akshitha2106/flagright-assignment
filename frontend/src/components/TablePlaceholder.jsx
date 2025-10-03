import React from 'react';
import './TablePlaceholder.css';
import { useTheme } from '../contexts/ThemeContext';

const TablePlaceholder = () => {
  const { theme } = useTheme();
  return (
    <div className="p-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className={`text-xs uppercase ${theme === 'light' ? 'text-gray-700 bg-gray-50' : 'text-gray-400 bg-gray-700'}`}>
            <tr>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Email</th>
              <th scope="col" className="px-6 py-3">Phone</th>
              <th scope="col" className="px-6 py-3">Address</th>
              <th scope="col" className="px-6 py-3">Payment Methods</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i} className={`border-b ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
                <td className="px-6 py-4">
                  <div className={`h-4 rounded w-3/4 animate-pulse ${theme === 'light' ? 'bg-gray-300' : 'bg-purple-700'}`}></div>
                </td>
                <td className="px-6 py-4">
                  <div className={`h-4 rounded w-3/4 animate-pulse ${theme === 'light' ? 'bg-gray-300' : 'bg-gray-700'}`}></div>
                </td>
                <td className="px-6 py-4">
                  <div className={`h-4 rounded w-3/4 animate-pulse ${theme === 'light' ? 'bg-gray-300' : 'bg-gray-700'}`}></div>
                </td>
                <td className="px-6 py-4">
                  <div className={`h-4 rounded w-3/4 animate-pulse ${theme === 'light' ? 'bg-gray-300' : 'bg-gray-700'}`}></div>
                </td>
                <td className="px-6 py-4">
                  <div className={`h-4 rounded w-3/4 animate-pulse ${theme === 'light' ? 'bg-gray-300' : 'bg-gray-700'}`}></div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <div className={`h-8 w-20 rounded animate-pulse ${theme === 'light' ? 'bg-gray-300' : 'bg-gray-700'}`}></div>
                    <div className={`h-8 w-20 rounded animate-pulse ${theme === 'light' ? 'bg-gray-300' : 'bg-gray-700'}`}></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablePlaceholder;
