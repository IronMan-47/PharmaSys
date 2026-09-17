import React, { useState, useEffect } from 'react';
import api, { pythonApi } from '../api';
import { PackageOpen, Search, Trash2, Plus, PlusCircle, X, Sparkles, Loader2, GitCompare, CheckCircle, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';


function Inventory() {
  const { t } = useTranslation();

  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Stock Add Modal State
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockAddData, setStockAddData] = useState({ id: '', name: '', quantity: 10, receivalDate: new Date().toISOString().split('T')[0], expiryDate: '' });

  // Alternatives Modal State
  const [showAltModal, setShowAltModal] = useState(false);
  const [altData, setAltData] = useState(null);
  const [loadingAlts, setLoadingAlts] = useState(false);
  
  // PharmAI State
  const [isPharmAILoading, setIsPharmAILoading] = useState(false);

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
      const response = await api.get("/api/medicines");
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

      await api.post("/api/medicines", dataToSubmit);
      
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
      await api.delete(`/api/medicines/${id}`);
      fetchMedicines();
    } catch (error) {
      console.error('Error deleting medicine:', error);
    }
  };

  // Quick Add Stock Submission
  const handleQuickAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/medicines/${stockAddData.id}/add-stock`, {
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

  const handleFindAlternatives = async (id) => {
    setShowAltModal(true);
    setLoadingAlts(true);
    setAltData(null);
    try {
      const response = await pythonApi.get(`/api/alternatives/${id}`);
      setAltData(response.data);
    } catch (error) {
      console.error('Error fetching alternatives:', error);
    } finally {
      setLoadingAlts(false);
    }
  };

  const handlePharmAIClick = async () => {
    if (!formData.name) return;
    setIsPharmAILoading(true);
    try {
      const response = await api.post("/api/pharmai/fetch-details", {
        medicineName: formData.name
      });
      
      setFormData(prev => ({
        ...prev,
        composition: response.data.composition || prev.composition,
        category: response.data.category || prev.category,
        targetSpecies: response.data.targetSpecies || prev.targetSpecies,
        description: response.data.description || prev.description
      }));
    } catch (error) {
      console.error('Error fetching PharmAI details:', error);
      alert(error.response?.data?.error || 'Failed to auto-fill. Please check API key setup or try again.');
    } finally {
      setIsPharmAILoading(false);
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
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Inventory Management</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Add, view, and manage your pharmacy stock.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Side: Stock In Form */}
        <div className="xl:col-span-1">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <PackageOpen className="mr-2 text-black dark:text-white" size={20} />
              Stock In (New Item)
            </h3>
            
            <form onSubmit={handleAddMedicine} className="space-y-4">
              <div>
                <div className="flex justify-between items-end mb-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Medicine Name</label>
                  <button 
                    type="button"
                    onClick={handlePharmAIClick}
                    disabled={isPharmAILoading || !formData.name}
                    className={`text-xs flex items-center px-2 py-1 rounded-md font-semibold transition-all border ${
                      isPharmAILoading || !formData.name
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 border-gray-200 dark:border-gray-700 cursor-not-allowed'
                        : 'bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100 cursor-pointer shadow-sm'
                    }`}
                    title="Auto-fill details using PharmAI"
                  >
                    {isPharmAILoading ? (
                      <Loader2 size={12} className="mr-1 animate-spin" />
                    ) : (
                      <Sparkles size={12} className="mr-1" />
                    )}
                    Auto-fill with PharmAI
                  </button>
                </div>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black" placeholder="e.g. Paracetamol" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <input type="text" name="category" value={formData.category} onChange={handleInputChange} required className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black" placeholder="e.g. Painkiller" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Species</label>
                  <select name="targetSpecies" value={formData.targetSpecies} onChange={handleInputChange} className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black bg-white dark:bg-gray-900">
                    <option value="Human">Human</option>
                    <option value="Animal">Animal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Composition / Active Drugs</label>
                <input type="text" name="composition" value={formData.composition} onChange={handleInputChange} className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black" placeholder="e.g. Paracetamol 500mg" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="2" className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black resize-none" placeholder="Brief details..."></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (Rs)</label>
                  <input type="number" name="price" step="0.01" value={formData.price} onChange={handleInputChange} required className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quantity</label>
                  <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} required className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black" placeholder="100" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Shelf Number</label>
                  <input type="text" name="shelfNo" value={formData.shelfNo} onChange={handleInputChange} className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black" placeholder="e.g. A-12" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Box Number</label>
                  <input type="text" name="boxNo" value={formData.boxNo} onChange={handleInputChange} className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black" placeholder="e.g. 5" />
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
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col h-[700px]">
            
            {/* Search Bar Area */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 flex items-center">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search inventory by name..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-black transition-all"
                />
              </div>
            </div>

            {/* Table Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-white dark:bg-gray-900 sticky top-0 border-b border-gray-100 dark:border-gray-800 shadow-sm z-10">
                  <tr>
                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-400">Medicine & Details</th>
                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-400">Category</th>
                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-400">Price</th>
                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-400">Stock Level</th>
                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredMedicines.length > 0 ? (
                    filteredMedicines.map(med => (
                      <tr key={med._id} className="hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-950 transition-colors group">
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <div>
                              <div className="font-medium text-gray-900 dark:text-gray-100 flex items-center">
                                {med.name}
                                <span className={`ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${med.targetSpecies === 'Human' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                                  {med.targetSpecies || 'Human'}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-[200px] truncate" title={med.composition}>
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
                        <td className="p-4 text-gray-500 dark:text-gray-400">
                          <span className="bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-md text-xs border border-gray-200 dark:border-gray-700">
                            {med.category}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-gray-600 dark:text-gray-400">₹{med.price.toFixed(2)}</td>
                        <td className="p-4">
                          <div className="flex flex-col items-start gap-2">
                            <span className={`font-mono px-2 py-1 rounded text-xs font-bold ${
                              med.stock < 10 
                                ? 'bg-red-50 text-red-600 border border-red-100' 
                                : 'bg-green-50 text-green-700 border border-green-100'
                            }`}>
                              {med.stock} Units
                            </span>
                            {med.stock === 0 && (
                              <button 
                                onClick={() => handleFindAlternatives(med._id)}
                                className="flex items-center text-[10px] font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded transition-colors"
                              >
                                <Search size={12} className="mr-1" /> Find Alternatives
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-right flex justify-end space-x-2">
                          <button 
                            onClick={() => handleFindAlternatives(med._id)}
                            className="text-gray-400 hover:text-blue-600 p-2 hover:bg-blue-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            title="Find Alternatives"
                          >
                            <GitCompare size={18} />
                          </button>
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
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-100 dark:border-gray-800">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Quick Add Stock</h3>
              <button onClick={() => setShowStockModal(false)} className="text-gray-400 hover:text-gray-600 dark:text-gray-400">
                <X size={20} />
              </button>
            </div>
            
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Adding stock for <strong className="text-gray-900 dark:text-gray-100">{stockAddData.name}</strong></p>
            
            <form onSubmit={handleQuickAddSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quantity to Add</label>
                <input 
                  type="number" 
                  value={stockAddData.quantity}
                  onChange={(e) => setStockAddData({...stockAddData, quantity: e.target.value})}
                  required min="1"
                  className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Receival Date</label>
                <input 
                  type="date" 
                  value={stockAddData.receivalDate}
                  onChange={(e) => setStockAddData({...stockAddData, receivalDate: e.target.value})}
                  required
                  className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expiry Date</label>
                <input 
                  type="date" 
                  value={stockAddData.expiryDate}
                  onChange={(e) => setStockAddData({...stockAddData, expiryDate: e.target.value})}
                  required
                  className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black"
                />
              </div>

              <button type="submit" className="w-full bg-black text-white font-medium py-3 rounded-lg hover:bg-gray-800 transition-colors mt-4">
                Confirm Addition
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Alternatives Modal */}
      {showAltModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-2xl shadow-xl border border-gray-100 dark:border-gray-800 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold flex items-center">
                <GitCompare className="mr-2 text-blue-600" size={24} /> 
                Find Alternatives
              </h3>
              <button onClick={() => setShowAltModal(false)} className="text-gray-400 hover:text-gray-600 dark:text-gray-400">
                <X size={20} />
              </button>
            </div>
            
            {loadingAlts ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="animate-spin text-gray-400 mb-4" size={32} />
                <p className="text-gray-500 dark:text-gray-400">Analyzing compositions...</p>
              </div>
            ) : altData ? (
              <div>
                <div className="bg-gray-50 dark:bg-gray-950 p-4 rounded-xl border border-gray-200 dark:border-gray-700 mb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-gray-100 text-lg">{altData.sourceMedicine.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Composition: {altData.sourceMedicine.composition}</p>
                    </div>
                    <span className="text-xs font-bold px-2 py-1 bg-gray-200 text-gray-700 dark:text-gray-300 rounded-md uppercase">
                      {altData.sourceMedicine.targetSpecies}
                    </span>
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">
                  <AlertTriangle size={16} className="text-amber-500 mr-2" />
                  <span>Potential alternatives are composition-based suggestions. Pharmacist verification is required before dispensing.</span>
                </div>

                {altData.alternatives.length > 0 ? (
                  <div className="space-y-4">
                    {altData.alternatives.map((alt, idx) => (
                      <div key={idx} className={`p-4 rounded-xl border ${alt.matchScore >= 100 ? 'bg-green-50/50 border-green-200' : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-bold text-gray-900 dark:text-gray-100">{alt.name}</h4>
                            <div className="flex items-center mt-1 space-x-2">
                              {alt.matchScore >= 100 ? (
                                <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded flex items-center">
                                  <CheckCircle size={12} className="mr-1" /> Exact Composition
                                </span>
                              ) : (
                                <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                                  {alt.matchType}
                                </span>
                              )}
                              <span className="text-xs text-gray-500 dark:text-gray-400">{alt.targetSpecies}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-mono font-bold text-gray-900 dark:text-gray-100">₹{alt.price.toFixed(2)}</div>
                            <div className={`text-xs font-bold mt-1 ${alt.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                              Stock: {alt.stock}
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">{alt.reason}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-950 rounded-xl border border-dashed border-gray-300">
                    No suitable alternatives found for this medicine.
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-red-500">Error loading data.</div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default Inventory;
