
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Heart, User, Video } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const navItems = [
    { to: "/", icon: Home, label: "Discover" },
    { to: "/matches", icon: Heart, label: "Matches" },
    { to: "/profile", icon: User, label: "Profile" }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 animate-slide-up">
      <div className="glass py-2 px-4 mx-auto max-w-md">
        <div className="flex justify-around items-center">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => cn(
                "flex flex-col items-center px-3 py-2 rounded-lg transition-all duration-200 hover-scale",
                isActive
                  ? "text-primary font-medium"
                  : "text-gray-600 dark:text-gray-400"
              )}
            >
              {({ isActive }) => (
                <>
                  <Icon size={24} className={cn(
                    "transition-all duration-300",
                    isActive ? "mb-1 scale-110" : "mb-1"
                  )} />
                  <span className="text-xs">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
