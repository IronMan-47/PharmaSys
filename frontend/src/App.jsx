import React, { useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { LayoutDashboard, Package, Stethoscope, LogOut, ClipboardList, Pill, Receipt, Lightbulb, Map as MapIcon, Moon, Sun, Menu, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from './context/ThemeContext';

import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Login from './pages/Login';
import Logs from './pages/Logs';
import Sales from './pages/Sales';
import Insights from './pages/Insights';
import HealthMap from './pages/HealthMap';
import { AuthProvider, AuthContext } from './context/AuthContext';

function NavLink({ to, icon: Icon, children, collapsed }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      title={collapsed ? children : ""}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        isActive 
          ? 'bg-black text-white dark:bg-white dark:text-black shadow-md' 
          : 'text-gray-500 hover:text-black hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800'
      } ${collapsed ? 'justify-center px-0' : ''}`}
    >
      <Icon size={20} className="shrink-0" />
      {!collapsed && <span className="font-medium truncate">{children}</span>}
    </Link>
  );
}

function Sidebar({ collapsed }) {
  const { logout } = useContext(AuthContext);
  const { t } = useTranslation();

  return (
    <aside className={`${collapsed ? 'w-20' : 'w-64'} transition-all duration-300 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col`}>
      <div className={`p-6 border-b border-gray-100 dark:border-gray-800 flex items-center ${collapsed ? 'justify-center' : 'space-x-3'}`}>
        <div className="bg-black dark:bg-white text-white dark:text-black p-2 rounded-lg shrink-0">
          <Stethoscope size={24} />
        </div>
        {!collapsed && (
          <h1 className="text-xl font-bold tracking-tight text-black dark:text-white truncate">
            {t("PharmaSys")}
          </h1>
        )}
      </div>
      
      <nav className="p-4 space-y-2 flex-1 mt-4 overflow-hidden">
        <NavLink to="/" icon={LayoutDashboard} collapsed={collapsed}>{t("Dashboard")}</NavLink>
        <NavLink to="/sales" icon={Receipt} collapsed={collapsed}>{t("Sales History")}</NavLink>
        <NavLink to="/inventory" icon={Package} collapsed={collapsed}>{t("Inventory")}</NavLink>
        <NavLink to="/insights" icon={Lightbulb} collapsed={collapsed}>{t("Smart Insights")}</NavLink>
        <NavLink to="/heatmap" icon={MapIcon} collapsed={collapsed}>{t("HealthMap")}</NavLink>
        <NavLink to="/logs" icon={ClipboardList} collapsed={collapsed}>{t("Stock Logs")}</NavLink>
      </nav>

      <div className="p-4 border-t border-gray-100 dark:border-gray-800">
        <button 
          onClick={logout}
          title={collapsed ? t("Sign Out") : ""}
          className={`w-full flex items-center px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 rounded-lg transition-colors ${collapsed ? 'justify-center px-0' : 'space-x-3'}`}
        >
          <LogOut size={20} className="shrink-0" />
          {!collapsed && <span className="font-medium">{t("Sign Out")}</span>}
        </button>
      </div>
    </aside>
  );
}

function TopBar({ onToggleSidebar }) {
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  const { i18n } = useTranslation();

  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
    localStorage.setItem('language', e.target.value);
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 h-16 flex items-center justify-between px-4 sticky top-0 z-10">
      <div className="flex items-center">
        <button onClick={onToggleSidebar} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
          <Menu size={24} />
        </button>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
          <Globe size={16} className="text-gray-500 dark:text-gray-400" />
          <select 
            className="bg-transparent border-none focus:ring-0 cursor-pointer outline-none font-medium" 
            onChange={changeLanguage}
            value={i18n.language}
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="mr">मराठी</option>
            <option value="bn">বাংলা</option>
            <option value="ta">தமிழ்</option>
            <option value="te">తెలుగు</option>
          </select>
        </div>
        <button 
          onClick={toggleDarkMode} 
          className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          title="Toggle Dark Mode"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
}

function ProtectedRoute({ children }) {
  const { token } = useContext(AuthContext);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function MainLayout() {
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    setIsNavigating(true);
    const timer = setTimeout(() => setIsNavigating(false), 400); 
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Sidebar collapsed={sidebarCollapsed} />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <TopBar onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <main className="flex-1 overflow-y-auto p-8 relative">
          {isNavigating && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50/80 dark:bg-gray-950/80 backdrop-blur-sm z-50">
              <Pill className="text-black dark:text-white rolling-pill mb-4" size={48} />
              <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">Loading workspace...</p>
            </div>
          )}
          
          <div className={isNavigating ? 'opacity-0' : 'opacity-100 transition-opacity duration-300 h-full'}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/heatmap" element={<HealthMap />} />
              <Route path="/logs" element={<Logs />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/*" 
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
