import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  UserGroupIcon,
  ArrowsRightLeftIcon,
  SunIcon,
  MoonIcon,
  InformationCircleIcon, // ✅ added for About
} from "@heroicons/react/24/outline";
import { useTheme } from "../contexts/ThemeContext";

const Sidebar = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { to: "/", icon: <HomeIcon className="h-6 w-6" />, text: "Home" },
    {
      to: "/users",
      icon: <UserGroupIcon className="h-6 w-6" />,
      text: "Users",
    },
    {
      to: "/transactions",
      icon: <ArrowsRightLeftIcon className="h-6 w-6" />,
      text: "Transactions",
    },
    {
      to: "/about",
      icon: <InformationCircleIcon className="h-6 w-6" />, // ✅ About icon
      text: "About",
    },
  ];

  return (
    <div
      className={`flex h-screen ${
        theme === "light" ? "bg-white text-gray-900" : "bg-gray-900 text-white"
      }`}
    >
      <div className="w-64 flex flex-col">
        {/* Logo */}
        <div
          className={`flex items-center justify-center h-20 border-b ${
            theme === "light" ? "border-gray-200" : "border-gray-700"
          }`}
        >
          <Link to="/">
            <img
              src={
                theme === "light"
                  ? "https://stanhope.group/wp-content/uploads/2022/05/flagright-logo-v2-transp.svg"
                  : "https://cdn.prod.website-files.com/64f420094266acf96b6d3f84/64f4202e5cb2cbb8378b2092_logo-dark.svg"
              }
              className="max-h-[28px]"
              alt="Flagright"
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center px-4 py-2 mt-2 text-sm font-semibold rounded-lg ${
                location.pathname === link.to
                  ? theme === "light"
                    ? "bg-gray-200 text-gray-900"
                    : "bg-gray-700 text-white"
                  : theme === "light"
                  ? "text-gray-500 hover:bg-gray-200 hover:text-gray-900"
                  : "text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
            >
              {link.icon}
              <span className="ml-3">{link.text}</span>
            </Link>
          ))}
        </nav>

        {/* Theme Toggle */}
        <div className="px-2 py-4">
          <button
            onClick={toggleTheme}
            className={`flex items-center justify-center w-full px-4 py-2 text-sm font-semibold rounded-lg ${
              theme === "light"
                ? "text-gray-500 hover:bg-gray-200 hover:text-gray-900"
                : "text-gray-400 hover:bg-gray-700 hover:text-white"
            }`}
          >
            {theme === "light" ? (
              <MoonIcon className="h-6 w-6" />
            ) : (
              <SunIcon className="h-6 w-6" />
            )}
            <span className="ml-3">
              {theme === "light" ? "Dark Mode" : "Light Mode"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
