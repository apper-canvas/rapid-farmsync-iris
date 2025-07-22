import React from "react";
import DesktopSidebar from "./DesktopSidebar";
import MobileBottomNav from "./MobileBottomNav";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DesktopSidebar />
      
      <main className="flex-1 lg:ml-0">
        <div className="pb-20 lg:pb-0">
          {children}
        </div>
      </main>
      
      <MobileBottomNav />
    </div>
  );
};

export default Layout;