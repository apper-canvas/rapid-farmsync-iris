import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const MobileBottomNav = () => {
  const navItems = [
    { path: "/", icon: "Home", label: "Dashboard" },
    { path: "/fields", icon: "MapPin", label: "Fields" },
    { path: "/tasks", icon: "CheckSquare", label: "Tasks" },
    { path: "/inventory", icon: "Package", label: "Inventory" },
    { path: "/finance", icon: "DollarSign", label: "Finance" },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-40">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-gray-500 hover:text-primary hover:bg-primary/5"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  <ApperIcon name={item.icon} className="h-5 w-5" />
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.div>
                <span className="text-xs font-medium mt-1">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileBottomNav;