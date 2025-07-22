import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import LogoutButton from "@/components/organisms/LogoutButton";
import LanguageSelector from "@/components/molecules/LanguageSelector";
import { useTranslation } from "@/i18n/index";
const DesktopSidebar = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

const navItems = [
    { path: "/", icon: "Home", label: t('dashboard') },
    { path: "/fields", icon: "MapPin", label: t('fields') },
    { path: "/tasks", icon: "CheckSquare", label: t('tasks') },
    { path: "/inventory", icon: "Package", label: t('inventory') },
    { path: "/finance", icon: "DollarSign", label: t('finance') },
  ];
  return (
    <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-gray-200 h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-lg">
            <ApperIcon name="Sprout" className="h-6 w-6 text-white" />
          </div>
<div>
            <h1 className="text-xl font-bold text-gray-900 font-display">{t('appTitle')}</h1>
            <p className="text-xs text-gray-500">{t('appSubtitle')}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={`group relative flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20"
                      : "text-gray-700 hover:bg-gray-50 hover:text-primary"
                  }`}
                >
                  <ApperIcon name={item.icon} className="h-5 w-5 mr-3" />
                  {item.label}
                  
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute right-2 h-2 w-2 bg-primary rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </NavLink>
              </li>
            );
          })}
</ul>
        
        {/* Settings and Language Selector */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => setShowLanguageSelector(!showLanguageSelector)}
            className="group relative flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 text-gray-700 hover:bg-gray-50 hover:text-primary"
          >
            <ApperIcon name="Settings" className="h-5 w-5 mr-3" />
            {t('settings')}
            <ApperIcon 
              name={showLanguageSelector ? "ChevronUp" : "ChevronDown"} 
              className="h-4 w-4 ml-auto" 
            />
          </button>
          
          {showLanguageSelector && (
            <div className="mt-2 ml-8">
              <LanguageSelector />
            </div>
)}
        </div>
      </nav>

      {/* User Profile */}
      <LogoutButton />
    </aside>
  );
};