import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PackageOpen, Search, Trash2, Plus, PlusCircle, X, Sparkles, Loader2 } from 'lucide-react';

function Inventory() {
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Stock Add Modal State
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockAddData, setStockAddData] = useState({ id: '', name: '', quantity: 10, receivalDate: new Date().toISOString().split('T')[0], expiryDate: '' });
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    targetSpecies: 'Human',
    description: '',
    composition: '',
    shelfNo: '',
    boxNo: ''
  });
  

  // Fetch medicines from our Express backend
  const fetchMedicines = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}`}/api/medicines`);
      setMedicines(response.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  // Run once when the component loads
  useEffect(() => {
    fetchMedicines();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission (Adding new medicine)
  const handleAddMedicine = async (e) => {
    e.preventDefault();
    try {
      // Ensure price and stock are numbers
      const dataToSubmit = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      };

      await axios.post(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}`}/api/medicines`, dataToSubmit);
      
      // Clear the form
      setFormData({ name: '', category: '', price: '', stock: '', targetSpecies: 'Human', description: '', composition: '', shelfNo: '', boxNo: '' });
      
      // Refresh the table
      fetchMedicines();
    } catch (error) {
      console.error('Error adding medicine:', error);
      alert('Failed to add medicine');
    }
  };

  // Handle deleting a medicine (Stock Out / Remove)
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this item completely?')) return;
    
    try {
      await axios.delete(`http://localhost:5001/api/medicines/${id}`);
      fetchMedicines();
    } catch (error) {
      console.error('Error deleting medicine:', error);
    }
  };

  // Quick Add Stock Submission
  const handleQuickAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5001/api/medicines/${stockAddData.id}/add-stock`, {
        quantity: parseInt(stockAddData.quantity),
        receivalDate: stockAddData.receivalDate,
        expiryDate: stockAddData.expiryDate
      });
      setShowStockModal(false);
      fetchMedicines();
    } catch (error) {
      console.error('Error quick adding stock:', error);
      alert('Failed to add stock');
    }
  };

  // Filter medicines based on the search bar
  const filteredMedicines = medicines.filter(med => 
    med.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-300">
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Inventory Management</h2>
          <p className="text-gray-500 mt-1">Add, view, and manage your pharmacy stock.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Side: Stock In Form */}
        <div className="xl:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <PackageOpen className="mr-2 text-black" size={20} />
              Stock In (New Item)
            </h3>
            
            <form onSubmit={handleAddMedicine} className="space-y-4">
              <div>
                <div className="flex justify-between items-end mb-1">
                  <label className="block text-sm font-medium text-gray-700">Medicine Name</label>
                  <button 
                    type="button"
                    disabled={true}
                    className="text-xs flex items-center px-2 py-1 rounded-md font-semibold transition-all bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                    title="This feature is disabled for the prototype review."
                  >
                    <Sparkles size={12} className="mr-1" />
                    ✦ PharmAI (Coming Soon!)
                  </button>
                </div>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black" placeholder="e.g. Paracetamol" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input type="text" name="category" value={formData.category} onChange={handleInputChange} required className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black" placeholder="e.g. Painkiller" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Species</label>
                  <select name="targetSpecies" value={formData.targetSpecies} onChange={handleInputChange} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black bg-white">
                    <option value="Human">Human</option>
                    <option value="Animal">Animal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Composition / Active Drugs</label>
                <input type="text" name="composition" value={formData.composition} onChange={handleInputChange} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black" placeholder="e.g. Paracetamol 500mg" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="2" className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black resize-none" placeholder="Brief details..."></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rs)</label>
                  <input type="number" name="price" step="0.01" value={formData.price} onChange={handleInputChange} required className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} required className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black" placeholder="100" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shelf Number</label>
                  <input type="text" name="shelfNo" value={formData.shelfNo} onChange={handleInputChange} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black" placeholder="e.g. A-12" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Box Number</label>
                  <input type="text" name="boxNo" value={formData.boxNo} onChange={handleInputChange} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black" placeholder="e.g. 5" />
                </div>
              </div>

              <button type="submit" className="w-full bg-black text-white font-medium py-3 rounded-lg hover:bg-gray-800 transition-colors mt-2 flex items-center justify-center">
                <Plus size={18} className="mr-2" /> Add to Inventory
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: Inventory Table */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[700px]">
            
            {/* Search Bar Area */}
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search inventory by name..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black transition-all"
                />
              </div>
            </div>

            {/* Table Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-white sticky top-0 border-b border-gray-100 shadow-sm z-10">
                  <tr>
                    <th className="p-4 font-semibold text-gray-600">Medicine & Details</th>
                    <th className="p-4 font-semibold text-gray-600">Category</th>
                    <th className="p-4 font-semibold text-gray-600">Price</th>
                    <th className="p-4 font-semibold text-gray-600">Stock Level</th>
                    <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredMedicines.length > 0 ? (
                    filteredMedicines.map(med => (
                      <tr key={med._id} className="hover:bg-gray-50 transition-colors group">
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <div>
                              <div className="font-medium text-gray-900 flex items-center">
                                {med.name}
                                <span className={`ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${med.targetSpecies === 'Human' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                                  {med.targetSpecies || 'Human'}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500 mt-1 max-w-[200px] truncate" title={med.composition}>
                                {med.composition || 'No composition listed'}
                              </div>
                              {(med.shelfNo || med.boxNo) && (
                                <div className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wide">
                                  {med.shelfNo && `Shelf: ${med.shelfNo}`}
                                  {med.shelfNo && med.boxNo && ' • '}
                                  {med.boxNo && `Box: ${med.boxNo}`}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-gray-500">
                          <span className="bg-gray-100 px-2.5 py-1 rounded-md text-xs border border-gray-200">
                            {med.category}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-gray-600">₹{med.price.toFixed(2)}</td>
                        <td className="p-4">
                          <span className={`font-mono px-2 py-1 rounded text-xs font-bold ${
                            med.stock < 10 
                              ? 'bg-red-50 text-red-600 border border-red-100' 
                              : 'bg-green-50 text-green-700 border border-green-100'
                          }`}>
                            {med.stock} Units
                          </span>
                        </td>
                        <td className="p-4 text-right flex justify-end space-x-2">
                          <button 
                            onClick={() => {
                              setStockAddData({ id: med._id, name: med.name, quantity: 10, receivalDate: new Date().toISOString().split('T')[0], expiryDate: '' });
                              setShowStockModal(true);
                            }}
                            className="text-gray-400 hover:text-green-600 p-2 hover:bg-green-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            title="Quick Add Stock"
                          >
                            <PlusCircle size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(med._id)}
                            className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            title="Delete Item"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="p-10 text-center text-gray-400">
                        No medicines found in inventory.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>

      </div>

      {/* Quick Add Modal */}
      {showStockModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Quick Add Stock</h3>
              <button onClick={() => setShowStockModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <p className="text-sm text-gray-500 mb-4">Adding stock for <strong className="text-gray-900">{stockAddData.name}</strong></p>
            
            <form onSubmit={handleQuickAddSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity to Add</label>
                <input 
                  type="number" 
                  value={stockAddData.quantity}
                  onChange={(e) => setStockAddData({...stockAddData, quantity: e.target.value})}
                  required min="1"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Receival Date</label>
                <input 
                  type="date" 
                  value={stockAddData.receivalDate}
                  onChange={(e) => setStockAddData({...stockAddData, receivalDate: e.target.value})}
                  required
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                <input 
                  type="date" 
                  value={stockAddData.expiryDate}
                  onChange={(e) => setStockAddData({...stockAddData, expiryDate: e.target.value})}
                  required
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black"
                />
              </div>

              <button type="submit" className="w-full bg-black text-white font-medium py-3 rounded-lg hover:bg-gray-800 transition-colors mt-4">
                Confirm Addition
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Inventory;
