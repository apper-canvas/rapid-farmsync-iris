import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import LanguageSelector from "@/components/molecules/LanguageSelector";
import LogoutButton from "@/components/organisms/LogoutButton";
import { useTranslation } from "@/i18n";
import ApperIcon from "@/components/ApperIcon";
const MobileBottomNav = () => {
  const { t } = useTranslation();
  const [showSettings, setShowSettings] = useState(false);
const navItems = [
    { path: "/", icon: "Home", label: t('dashboard') },
    { path: "/fields", icon: "MapPin", label: t('fields') },
    { path: "/tasks", icon: "CheckSquare", label: t('tasks') },
    { path: "/inventory", icon: "Package", label: t('inventory') },
    { path: "/crops", icon: "Wheat", label: t('crops') }
  ];

return (
    <>
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="lg:hidden fixed bottom-20 left-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{t('settings')}</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <ApperIcon name="X" className="h-5 w-5" />
</button>
            </div>
            <LanguageSelector />
            <div className="mt-4 pt-4 border-t border-gray-200">
              <LogoutButton />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
          
          {/* Settings Button */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
              showSettings
                ? "text-primary bg-primary/10"
                : "text-gray-500 hover:text-primary hover:bg-primary/5"
            }`}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <ApperIcon name="Settings" className="h-5 w-5" />
              {showSettings && (
                <motion.div
                  layoutId="activeSettingsTab"
                  className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.div>
            <span className="text-xs font-medium mt-1">{t('settings')}</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default MobileBottomNav;