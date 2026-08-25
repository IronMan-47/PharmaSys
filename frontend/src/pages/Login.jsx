import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Stethoscope, Lock, User } from 'lucide-react';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const { login, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    const result = await login(username, password);
    if (result.success) {
      navigate('/');
    } else {
      setErrorMsg(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      
      <div className="mb-8 flex flex-col items-center">
        <div className="bg-black text-white p-4 rounded-2xl mb-4 shadow-lg">
          <Stethoscope size={40} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">PharmaSys</h1>
        <p className="text-gray-500 mt-2">Admin Authentication Gateway</p>
      </div>

      <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Secure Login</h2>
        
        {errorMsg && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium mb-6 border border-red-100">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all"
                placeholder="Enter admin username"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all"
                placeholder="Enter password"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-3 mt-4 rounded-xl font-bold text-white transition-all flex items-center justify-center ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800 shadow-md'
            }`}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>

      <p className="text-sm text-gray-400 mt-8">
        PharmaSys v2.0 - Authorized Personnel Only
      </p>

    </div>
  );
}

export default Login;
