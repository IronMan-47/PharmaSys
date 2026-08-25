import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, Plus, Minus, X, AlertTriangle, Printer, Search, PackageOpen } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function Dashboard() {
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecies, setFilterSpecies] = useState('All');
  const [cart, setCart] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({ name: '', zipCode: '' });
  
  // Dashboard states
  const [lowStockMeds, setLowStockMeds] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);

  // Fetch data
  const fetchData = async () => {
    try {
      const medRes = await axios.get(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}`}/api/medicines`);
      setMedicines(medRes.data);
      
      // Calculate low stock items (less than 10 units)
      const lowStock = medRes.data.filter(m => m.stock > 0 && m.stock < 10);
      setLowStockMeds(lowStock);

      const transRes = await axios.get(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}`}/api/transactions`);
      // Just take the latest 5 for the mini dashboard
      setRecentTransactions(transRes.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter medicines for POS search and species
  const filteredMeds = medicines.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecies = filterSpecies === 'All' || med.targetSpecies === filterSpecies;
    return med.stock > 0 && matchesSearch && matchesSpecies;
  });

  // Cart operations
  const addToCart = (med) => {
    const existingItem = cart.find(item => item.medicineId === med._id);
    if (existingItem) {
      if (existingItem.quantity >= med.stock) {
        alert('Not enough stock available!');
        return;
      }
      setCart(cart.map(item => 
        item.medicineId === med._id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { medicineId: med._id, name: med.name, price: med.price, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.medicineId !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    // If the user types a string, parse it. If empty or invalid, just ignore or set to 1.
    let parsedQty = parseInt(newQuantity);
    if (isNaN(parsedQty) || parsedQty < 1) return; // Ignore negative or invalid text

    const medInStock = medicines.find(m => m._id === id);
    if (medInStock && parsedQty > medInStock.stock) {
      alert(`Cannot exceed available stock (${medInStock.stock} units)!`);
      parsedQty = medInStock.stock;
    }

    setCart(cart.map(item => 
      item.medicineId === id ? { ...item, quantity: parsedQty } : item
    ));
  };

  const addPresetQuantity = (id, amount) => {
    const item = cart.find(i => i.medicineId === id);
    if (item) {
      updateQuantity(id, item.quantity + amount);
    }
  };

  const cartTotal = cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);

  // PDF Generation function
  const generateReceipt = (transactionId) => {
    const doc = new jsPDF();
    
    // Receipt Header
    doc.setFontSize(20);
    doc.text('PharmaSys Receipt', 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Transaction ID: ${transactionId}`, 14, 30);
    doc.text(`Date: ${new Date().toLocaleString()}`, 14, 36);
    doc.text(`Customer: ${customerInfo.name || 'Walk-in Customer'}`, 14, 42);
    doc.text(`Location Zip: ${customerInfo.zipCode || 'N/A'}`, 14, 48);

    // Table Data
    const tableColumn = ["Medicine Name", "Quantity", "Price", "Total"];
    const tableRows = cart.map(item => [
      item.name,
      item.quantity.toString(),
      `Rs ${item.price.toFixed(2)}`,
      `Rs ${(item.price * item.quantity).toFixed(2)}`
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 55,
      theme: 'plain', // Very clean monochrome theme for PDF
      headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });

    // Total Amount
    const finalY = doc.lastAutoTable.finalY || 55;
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text(`Grand Total: Rs ${cartTotal.toFixed(2)}`, 14, finalY + 15);
    
    // Save PDF
    doc.save(`Receipt-${transactionId}.pdf`);
  };

  // Checkout process
  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}`}/api/transactions`, {
        items: cart,
        customerName: customerInfo.name,
        zipCode: customerInfo.zipCode
      });
      
      // Trigger PDF download
      generateReceipt(res.data._id);
      
      // Reset POS state
      setCart([]);
      setCustomerInfo({ name: '', zipCode: '' });
      setSearchTerm('');
      
      // Refresh Dashboard data
      fetchData();
      
      alert('Checkout successful! Receipt downloaded.');
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Checkout failed. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-300">
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard & POS</h2>
          <p className="text-gray-500 mt-1">Overview and active billing calculator.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Overview & Item Selection */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* Dashboard Mini-Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Low Stock Alert Widget */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-gray-500 font-medium">Low Stock Alerts</h3>
                <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                  <AlertTriangle size={20} />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{lowStockMeds.length} Items</div>
              <p className="text-sm text-gray-400">Need immediate restock</p>
            </div>
            
            {/* Recent Sales Widget */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-gray-500 font-medium">Recent Sales</h3>
                <div className="p-2 bg-gray-50 text-gray-600 rounded-lg">
                  <ShoppingCart size={20} />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{recentTransactions.length}</div>
              <p className="text-sm text-gray-400">Transactions processed recently</p>
            </div>

          </div>

          {/* POS Item Selector */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-6 flex items-center">
              <Search className="mr-2 text-gray-400" size={20} />
              Search & Add Items
            </h3>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <input 
                type="text" 
                placeholder="Search inventory by name to add to cart..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all text-lg"
              />
              <div className="flex bg-gray-100 p-1 rounded-xl">
                {['All', 'Human', 'Animal'].map(species => (
                  <button
                    key={species}
                    onClick={() => setFilterSpecies(species)}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                      filterSpecies === species 
                        ? 'bg-white text-black shadow-sm' 
                        : 'text-gray-500 hover:text-black hover:bg-gray-200/50'
                    }`}
                  >
                    {species}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
              {filteredMeds.map(med => (
                <button 
                  key={med._id}
                  onClick={() => addToCart(med)}
                  className="text-left p-4 rounded-xl border border-gray-200 hover:border-black hover:shadow-md transition-all group bg-white"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 truncate pr-2">{med.name}</h4>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase shrink-0 ${med.targetSpecies === 'Human' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                      {med.targetSpecies || 'Human'}
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-500 truncate mb-1">
                    {med.composition || 'No composition'}
                  </div>
                  <div className="flex justify-between items-end mt-4">
                    <span className="text-sm font-mono font-bold text-gray-600">₹{med.price.toFixed(2)}</span>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">Stock: {med.stock}</span>
                  </div>
                </button>
              ))}
              {filteredMeds.length === 0 && (
                <div className="col-span-full py-8 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                  No items found in stock.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Billing Calculator (Cart) */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[800px] sticky top-8">
            
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold flex items-center">
                <ShoppingCart className="mr-2 text-black" size={24} />
                Current Order
              </h3>
            </div>

            {/* Customer Data (AI Prep) */}
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 space-y-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Customer Details (Optional)</p>
              <input 
                type="text" 
                placeholder="Customer Name" 
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
              />
              <input 
                type="text" 
                placeholder="Zip / Pin Code (For AI geographic tracking)" 
                value={customerInfo.zipCode}
                onChange={(e) => setCustomerInfo({...customerInfo, zipCode: e.target.value})}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <PackageOpen size={48} className="mb-4 text-gray-200" />
                  <p>Cart is empty</p>
                  <p className="text-sm mt-1">Select items from the left to begin</p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {cart.map(item => (
                    <li key={item.medicineId} className="flex flex-col p-3 border border-gray-100 rounded-xl bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-gray-900">{item.name}</span>
                        <button 
                          onClick={() => removeFromCart(item.medicineId)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex flex-col space-y-2">
                          {/* Main Quantity Controls */}
                          <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-lg p-1 w-max">
                            <button onClick={() => updateQuantity(item.medicineId, item.quantity - 1)} className="p-1.5 hover:bg-gray-100 rounded text-gray-500"><Minus size={14}/></button>
                            <input 
                              type="number" 
                              value={item.quantity} 
                              onChange={(e) => {
                                // Allow them to clear the box while typing
                                if (e.target.value === '') {
                                  setCart(cart.map(i => i.medicineId === item.medicineId ? { ...i, quantity: '' } : i));
                                } else {
                                  updateQuantity(item.medicineId, e.target.value);
                                }
                              }}
                              onBlur={(e) => {
                                // If they leave it empty, reset to 1
                                if (e.target.value === '') updateQuantity(item.medicineId, 1);
                              }}
                              className="font-mono text-sm w-12 text-center focus:outline-none focus:ring-0 bg-transparent hide-spinners"
                            />
                            <button onClick={() => updateQuantity(item.medicineId, item.quantity + 1)} className="p-1.5 hover:bg-gray-100 rounded text-gray-500"><Plus size={14}/></button>
                          </div>
                          
                          {/* Preset Quick Add Buttons */}
                          <div className="flex space-x-1">
                            {[5, 10, 12, 20].map(amount => (
                              <button 
                                key={amount}
                                onClick={() => addPresetQuantity(item.medicineId, amount)}
                                className="text-[10px] bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold px-2 py-1 rounded transition-colors"
                              >
                                +{amount}
                              </button>
                            ))}
                          </div>
                        </div>
                        <span className="font-mono font-bold text-gray-800 text-lg">₹{(item.price * (parseInt(item.quantity) || 1)).toFixed(2)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Checkout Section */}
            <div className="p-6 border-t border-gray-100 bg-white rounded-b-2xl">
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-500 font-medium">Total Amount</span>
                <span className="text-3xl font-bold font-mono text-black">₹{cartTotal.toFixed(2)}</span>
              </div>
              
              <button 
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center space-x-2 ${
                  cart.length === 0 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-black text-white hover:bg-gray-800 shadow-md hover:shadow-lg'
                }`}
              >
                <Printer size={20} />
                <span>Complete & Generate PDF</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
