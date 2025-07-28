import React, { useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LanguageContext } from "@/contexts/LanguageContext";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
const location = useLocation();
  
const { t } = useContext(LanguageContext);
  const { isAuthenticated, isLoading } = useAuth();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/") return t('navigation.dashboard');
    if (path.startsWith("/clients")) return t('navigation.clients');
    if (path.startsWith("/bills")) return t('navigation.bills');
    if (path.startsWith("/quotations")) return t('navigation.quotations');
    if (path.startsWith("/payments")) return t('navigation.payments');
    if (path.startsWith("/services")) return t('navigation.services');
    if (path.startsWith("/settings")) return t('navigation.settings');
    return "BillFlow Pro";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Header 
          onMenuClick={() => setSidebarOpen(true)} 
          title={getPageTitle()}
        />
        
        <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;