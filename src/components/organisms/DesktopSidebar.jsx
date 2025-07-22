import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const DesktopSidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: "Home", label: "Dashboard" },
    { path: "/fields", icon: "MapPin", label: "Fields" },
    { path: "/tasks", icon: "CheckSquare", label: "Tasks" },
    { path: "/inventory", icon: "Package", label: "Inventory" },
    { path: "/finance", icon: "DollarSign", label: "Finance" },
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
            <h1 className="text-xl font-bold text-gray-900 font-display">FarmSync Pro</h1>
            <p className="text-xs text-gray-500">Smart Agriculture</p>
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
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-gray-50">
          <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-full">
            <ApperIcon name="User" className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Farm Manager</p>
            <p className="text-xs text-gray-500">Green Valley Farm</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default DesktopSidebar;