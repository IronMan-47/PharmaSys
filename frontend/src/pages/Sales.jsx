import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { Receipt, Calendar, User, MapPin, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';


function Sales() {
  const { t } = useTranslation();

  const { token } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await api.get("/api/transactions");
      // Ensure it's an array to prevent crashes
      setTransactions(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (!window.confirm('Are you sure you want to delete this receipt? This action cannot be undone.')) return;
    try {
      await api.delete(`/api/transactions/${id}`);
      fetchTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('Failed to delete transaction.');
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you absolutely sure you want to delete ALL sales history? This cannot be undone.')) return;
    try {
      await api.delete("/api/transactions");
      fetchTransactions();
    } catch (error) {
      console.error('Error clearing transactions:', error);
      alert('Failed to clear transactions.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">{t("Sales History")}</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">View all past transaction receipts and billing records.</p>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleClearAll}
            className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center"
          >
            <Trash2 size={16} className="mr-2" />
            Clear All
          </button>
          <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg font-semibold flex items-center shadow-sm border border-green-100">
            <span className="mr-1">₹</span>
            {Array.isArray(transactions) ? transactions.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0).toFixed(2) : "0.00"} Total Revenue
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {transactions.map((tx) => (
          <div key={tx._id} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4 border-b border-gray-50 pb-4">
              <div>
                <div className="flex items-center text-gray-900 dark:text-gray-100 font-semibold text-lg">
                  <User size={18} className="mr-2 text-gray-400" />
                  {tx.customerName || 'Walk-in Customer'}
                </div>
                {tx.zipCode && tx.zipCode !== 'Unknown' && (
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <MapPin size={14} className="mr-1" />
                    {tx.zipCode}
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <span className="font-medium mr-1">Condition:</span> 
                  <span className={tx.condition ? "text-red-500 dark:text-red-400 font-medium" : ""}>
                    {tx.condition || 'Not Entered'}
                  </span>
                </div>
              </div>
              <div className="bg-black text-white px-3 py-1 rounded-full font-bold text-sm flex items-center shadow-sm">
                ₹{tx.totalAmount.toFixed(2)}
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Items Billed</h4>
              {(tx.items || []).map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm items-center bg-gray-50 dark:bg-gray-950 px-3 py-2 rounded-lg">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{item.name}</span>
                  <span className="text-gray-500 dark:text-gray-400 font-mono bg-white dark:bg-gray-900 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700">
                    x{item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 mt-auto border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 font-medium">
              <div className="flex items-center">
                <Calendar size={14} className="mr-1.5" />
                {new Date(tx.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <div className="flex items-center">
                  <Receipt size={14} className="mr-1.5" />
                  #{tx._id.substring(tx._id.length - 6)}
                </div>
                <button 
                  onClick={() => handleDeleteTransaction(tx._id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title="Delete Receipt"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {transactions.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 border-dashed">
            <Receipt className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">No sales recorded yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sales;
