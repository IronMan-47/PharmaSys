import React, { useState, useEffect } from 'react';
import api from '../api';
import { ClipboardList, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';


function Logs() {
  const { t } = useTranslation();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const response = await api.get("/api/logs");
      setLogs(response.data);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this log?')) return;
    try {
      await api.delete(`/api/logs/${id}`);
      fetchLogs(); // Refresh the list
    } catch (error) {
      console.error('Error deleting log:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Stock Entry Logs</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track receiving and expiry dates for all incoming batches.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center bg-gray-50 dark:bg-gray-950">
          <ClipboardList className="mr-3 text-black dark:text-white" size={24} />
          <h3 className="text-lg font-semibold">Incoming Stock History</h3>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-400">Loading logs...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
                <tr>
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-400">Medicine Name</th>
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-400">Quantity Added</th>
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-400">Receival Date</th>
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-400">Expiry Date</th>
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-400 text-right">Logged At</th>
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-400 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {logs.length > 0 ? (
                  logs.map(log => (
                    <tr key={log._id} className="hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-950 transition-colors group">
                      <td className="p-4 font-medium text-gray-900 dark:text-gray-100">{log.medicineName}</td>
                      <td className="p-4 font-mono text-green-600 font-bold">+{log.quantityAdded}</td>
                      <td className="p-4 text-gray-600 dark:text-gray-400">
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
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => handleDelete(log._id)}
                          className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          title="Delete Log"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-10 text-center text-gray-400">
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
