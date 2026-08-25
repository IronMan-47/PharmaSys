import React, { useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { LayoutDashboard, Package, Stethoscope, LogOut, ClipboardList, Pill, Receipt } from 'lucide-react';

import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Login from './pages/Login';
import Logs from './pages/Logs';
import Sales from './pages/Sales';
import { AuthProvider, AuthContext } from './context/AuthContext';

function NavLink({ to, icon: Icon, children }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        isActive 
          ? 'bg-black text-white shadow-md' 
          : 'text-gray-500 hover:text-black hover:bg-gray-100'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{children}</span>
    </Link>
  );
}

function Sidebar() {
  const { logout } = useContext(AuthContext);

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-100 flex items-center space-x-3">
        <div className="bg-black text-white p-2 rounded-lg">
          <Stethoscope size={24} />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-black">
          PharmaSys
        </h1>
      </div>
      
      <nav className="p-4 space-y-2 flex-1 mt-4">
        <NavLink to="/" icon={LayoutDashboard}>Dashboard & POS</NavLink>
        <NavLink to="/sales" icon={Receipt}>Sales History</NavLink>
        <NavLink to="/inventory" icon={Package}>Inventory (Stock)</NavLink>
        <NavLink to="/logs" icon={ClipboardList}>Stock Logs</NavLink>
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={logout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
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

  useEffect(() => {
    setIsNavigating(true);
    const timer = setTimeout(() => setIsNavigating(false), 400); // 400ms rolling pill loading screen
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8 relative">
        {isNavigating && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50/80 backdrop-blur-sm z-50">
            <Pill className="text-black rolling-pill mb-4" size={48} />
            <p className="text-gray-500 font-medium animate-pulse">Loading workspace...</p>
          </div>
        )}
        
        <div className={isNavigating ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/logs" element={<Logs />} />
          </Routes>
        </div>
      </main>
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
