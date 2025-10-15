
import React from 'react';
import ThemeToggle from './ThemeToggle';
import { Link } from 'react-router-dom';

interface HeaderProps {
  isAdmin?: boolean;
}

const Header: React.FC<HeaderProps> = ({ isAdmin = false }) => {
  return (
    <header className="bg-light-card dark:bg-dark-card border-b border-light-border dark:border-dark-border shadow-sm p-4 flex justify-between items-center">
      <Link to={isAdmin ? "/admin" : "/"} className="flex items-center space-x-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-light-accent dark:text-dark-accent" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.08V18H9v-1.92c-1.65-.4-2.88-1.85-2.88-3.58 0-2.03 1.6-3.67 3.63-3.67 2.03 0 3.67 1.64 3.67 3.67 0 1.73-1.23 3.18-2.88 3.58zM12 6c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
        </svg>
        <h1 className="text-xl font-bold text-light-text dark:text-dark-text">
          PredictiveOps
        </h1>
      </Link>
      <div className="flex items-center space-x-4">
        {isAdmin && (
           <div className="flex items-center space-x-2">
             <img src="https://picsum.photos/40/40" alt="Admin" className="rounded-full" />
             <span className="text-light-text dark:text-dark-text font-medium hidden sm:block">Admin User</span>
           </div>
        )}
        <ThemeToggle />
         {isAdmin && (
           <Link to="/" className="text-sm text-light-text dark:text-dark-text hover:text-light-accent dark:hover:text-dark-accent">Logout</Link>
        )}
      </div>
    </header>
  );
};

export default Header;
