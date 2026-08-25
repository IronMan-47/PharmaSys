import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ClipboardList } from 'lucide-react';

function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}`}/api/logs`);
        setLogs(response.data);
      } catch (error) {
        console.error('Error fetching logs:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLogs();
  }, []);

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Stock Entry Logs</h2>
          <p className="text-gray-500 mt-1">Track receiving and expiry dates for all incoming batches.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center bg-gray-50">
          <ClipboardList className="mr-3 text-black" size={24} />
          <h3 className="text-lg font-semibold">Incoming Stock History</h3>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-400">Loading logs...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white border-b border-gray-100">
                <tr>
                  <th className="p-4 font-semibold text-gray-600">Medicine Name</th>
                  <th className="p-4 font-semibold text-gray-600">Quantity Added</th>
                  <th className="p-4 font-semibold text-gray-600">Receival Date</th>
                  <th className="p-4 font-semibold text-gray-600">Expiry Date</th>
                  <th className="p-4 font-semibold text-gray-600 text-right">Logged At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {logs.length > 0 ? (
                  logs.map(log => (
                    <tr key={log._id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium text-gray-900">{log.medicineName}</td>
                      <td className="p-4 font-mono text-green-600 font-bold">+{log.quantityAdded}</td>
                      <td className="p-4 text-gray-600">
                        {new Date(log.receivalDate).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        {log.expiryDate ? (
                          <span className="bg-red-50 text-red-600 px-2.5 py-1 rounded-md text-xs font-semibold border border-red-100">
                            {new Date(log.expiryDate).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic">Not set</span>
                        )}
                      </td>
                      <td className="p-4 text-right text-gray-400 text-xs">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-10 text-center text-gray-400">
                      No stock entry logs found. Add stock from the Inventory page to see them here!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Logs;
