import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Dashboard from "@/components/pages/Dashboard";
import Fields from "@/components/pages/Fields";
import Tasks from "@/components/pages/Tasks";
import Inventory from "@/components/pages/Inventory";
import Finance from "@/components/pages/Finance";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/fields" element={<Fields />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/finance" element={<Finance />} />
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="z-[9999]"
        />
      </div>
    </Router>
  );
}

export default App;