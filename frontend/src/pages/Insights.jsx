import React, { useState, useEffect } from 'react';
import { pythonApi } from '../api';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Package, ArrowRight, Loader2, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


function Insights() {
  const { t } = useTranslation();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await pythonApi.get("/api/analytics/sales");
        setData(response.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-gray-500 dark:text-gray-400 mr-2" size={24} />
        <span className="text-gray-500 dark:text-gray-400 font-medium">Loading Smart Insights...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center mt-20 text-gray-500 dark:text-gray-400">
        Failed to load insights. Make sure the Python intelligence service is running on port 8000.
      </div>
    );
  }

  const { periods, analytics } = data;

  // Derive categories for the dashboard
  const topSelling = [...analytics].sort((a, b) => b.lastMonthSales - a.lastMonthSales).slice(0, 5);
  const trendingUp = analytics.filter(a => a.trendPercentage > 10).sort((a, b) => b.trendPercentage - a.trendPercentage).slice(0, 5);
  const restockRecommendations = analytics.filter(a => a.restockRecommended);
  const lowDemand = analytics.filter(a => a.demandLevel === "Low" && a.lastMonthSales > 0).sort((a, b) => a.lastMonthSales - b.lastMonthSales).slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-300">
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 flex items-center">
            <Lightbulb className="mr-3 text-black dark:text-white" size={28} />
            Pharmacy Insights
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Data-driven sales analytics and restock intelligence.</p>
        </div>
        <div className="bg-white dark:bg-gray-900 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm text-sm">
          <div className="flex items-center space-x-4">
            <div>
              <span className="text-gray-400 font-medium">Last Month: </span>
              <span className="font-semibold text-gray-700 dark:text-gray-300">{periods.lastMonth}</span>
            </div>
            <div className="w-px h-4 bg-gray-200"></div>
            <div>
              <span className="text-gray-400 font-medium">Last 3 Months: </span>
              <span className="font-semibold text-gray-700 dark:text-gray-300">{periods.lastQuarter}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        
        {/* Top Selling */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <Package className="mr-2 text-black dark:text-white" size={20} />
            Top Selling Medicines (Last Month)
          </h3>
          <div className="space-y-3">
            {topSelling.map((med, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-950 rounded-lg transition-colors border border-gray-50">
                <div className="flex items-center">
                  <span className="font-bold text-gray-400 w-6">{idx + 1}.</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{med.medicine}</span>
                </div>
                <div className="text-sm font-semibold bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                  {med.lastMonthSales} units
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Up */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-bold mb-4 flex items-center text-black dark:text-white">
            <TrendingUp className="mr-2 text-green-600" size={20} />
            Trending Medicines
          </h3>
          <div className="space-y-3">
            {trendingUp.length > 0 ? trendingUp.map((med, idx) => (
              <div key={idx} className="flex flex-col p-3 hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-950 rounded-lg transition-colors border border-gray-50">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900 dark:text-gray-100">{med.medicine}</span>
                  <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded flex items-center">
                    +{med.trendPercentage.toFixed(1)}%
                  </span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Demand is above the 3-month average of {med.monthlyAverage} units.</span>
              </div>
            )) : <div className="text-gray-400 text-sm">No significant upward trends detected.</div>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Restock Recommendations */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-red-100">
          <h3 className="text-lg font-bold mb-4 flex items-center text-red-600">
            <AlertTriangle className="mr-2" size={20} />
            Restock Recommendations
          </h3>
          <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar pr-2">
            {restockRecommendations.map((med, idx) => (
              <div key={idx} className="bg-red-50/50 p-4 rounded-xl border border-red-100">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-gray-900 dark:text-gray-100">{med.medicine}</h4>
                  <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-100 px-2 py-1 rounded">
                    {med.restockStatus}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-3 mb-3">
                  <div className="bg-white dark:bg-gray-900 p-2 rounded border border-red-50 text-center">
                    <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-semibold">Current Stock</div>
                    <div className="font-bold text-lg text-gray-800 dark:text-gray-200">{med.currentStock}</div>
                  </div>
                  <div className="bg-white dark:bg-gray-900 p-2 rounded border border-red-50 text-center">
                    <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-semibold">Monthly Demand</div>
                    <div className="font-bold text-lg text-gray-800 dark:text-gray-200">{med.monthlyAverage}</div>
                  </div>
                  <div className="bg-white dark:bg-gray-900 p-2 rounded border border-red-50 text-center">
                    <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-semibold">Suggested Restock</div>
                    <div className="font-bold text-lg text-red-600">{med.suggestedRestock}</div>
                  </div>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 italic border-l-2 border-red-300 pl-2">
                  {med.reason}
                </p>
                <div className="mt-3 text-right">
                  <Link to="/inventory" className="text-xs font-semibold text-black dark:text-white hover:underline flex items-center justify-end">
                    View in Inventory <ArrowRight size={14} className="ml-1" />
                  </Link>
                </div>
              </div>
            ))}
            {restockRecommendations.length === 0 && (
              <div className="text-gray-500 dark:text-gray-400 text-sm flex items-center">
                <CheckCircle className="text-green-500 mr-2" size={16} /> All popular medicines are sufficiently stocked.
              </div>
            )}
          </div>
        </div>

        {/* Low Demand */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-bold mb-4 flex items-center text-gray-600 dark:text-gray-400">
            <TrendingDown className="mr-2" size={20} />
            Low Demand / Slow Moving
          </h3>
          <div className="space-y-3">
            {lowDemand.map((med, idx) => (
              <div key={idx} className="flex flex-col p-3 hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-950 rounded-lg transition-colors border border-gray-50">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900 dark:text-gray-100">{med.medicine}</span>
                </div>
                <div className="flex space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <span>Last month: <strong>{med.lastMonthSales}</strong></span>
                  <span>3-month avg: <strong>{med.monthlyAverage}</strong></span>
                  <span>Stock: <strong>{med.currentStock}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

export default Insights;
