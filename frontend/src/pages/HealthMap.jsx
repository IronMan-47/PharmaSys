import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { Search, Map as MapIcon, Loader2, RefreshCw, X } from 'lucide-react';
import api from '../api';
import { useTranslation } from 'react-i18next';

const geoUrl = "/src/assets/india-states.json";
const INDIA_CENTER = [80.0, 22.0];

const PIN_TO_STATE = {
  '11': 'Delhi', '12': 'Haryana', '13': 'Haryana', '14': 'Punjab', '15': 'Punjab',
  '16': 'Chandigarh', '17': 'Himachal Pradesh', '18': 'Jammu and Kashmir', '19': 'Jammu and Kashmir',
  '20': 'Uttar Pradesh', '21': 'Uttar Pradesh', '22': 'Uttar Pradesh', '23': 'Uttar Pradesh', '24': 'Uttar Pradesh', '25': 'Uttar Pradesh', '26': 'Uttar Pradesh', '27': 'Uttar Pradesh', '28': 'Uttar Pradesh',
  '30': 'Rajasthan', '31': 'Rajasthan', '32': 'Rajasthan', '33': 'Rajasthan', '34': 'Rajasthan',
  '36': 'Gujarat', '37': 'Gujarat', '38': 'Gujarat', '39': 'Gujarat',
  '40': 'Maharashtra', '41': 'Maharashtra', '42': 'Maharashtra', '43': 'Maharashtra', '44': 'Maharashtra',
  '45': 'Madhya Pradesh', '46': 'Madhya Pradesh', '47': 'Madhya Pradesh', '48': 'Madhya Pradesh',
  '49': 'Chhattisgarh', '50': 'Telangana', '51': 'Andhra Pradesh', '52': 'Andhra Pradesh', '53': 'Andhra Pradesh',
  '56': 'Karnataka', '57': 'Karnataka', '58': 'Karnataka', '59': 'Karnataka',
  '60': 'Tamil Nadu', '61': 'Tamil Nadu', '62': 'Tamil Nadu', '63': 'Tamil Nadu', '64': 'Tamil Nadu',
  '67': 'Kerala', '68': 'Kerala', '69': 'Kerala',
  '70': 'West Bengal', '71': 'West Bengal', '72': 'West Bengal', '73': 'West Bengal', '74': 'West Bengal',
  '75': 'Odisha', '76': 'Odisha', '77': 'Odisha',
  '78': 'Assam', '79': 'North Eastern',
  '80': 'Bihar', '81': 'Bihar', '82': 'Bihar', '83': 'Bihar', '84': 'Bihar', '85': 'Bihar',
  '82': 'Jharkhand', '83': 'Jharkhand'
};

function HealthMap() {
  const { t } = useTranslation();
  const [conditions, setConditions] = useState(['Fever']); 
  const [selectedCondition, setSelectedCondition] = useState('Fever');
  const [allTransactions, setAllTransactions] = useState([]);
  
  // Data structures for the map
  const [heatmapData, setHeatmapData] = useState({}); // Counts for the current selected condition
  const [stateBreakdown, setStateBreakdown] = useState({}); // Detailed breakdown for all conditions per state
  
  const [loading, setLoading] = useState(false);
  const [tooltipContent, setTooltipContent] = useState("");
  const [selectedStateForDetails, setSelectedStateForDetails] = useState(null);

  // Check dark mode for proper 0-case fill color
  const isDark = document.documentElement.classList.contains('dark');

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/transactions');
      setAllTransactions(res.data);
      
      const uniqueConditions = [...new Set(res.data.map(t => t.condition?.trim()).filter(Boolean))];
      if (uniqueConditions.length > 0) {
        setConditions(uniqueConditions);
        if (!uniqueConditions.includes(selectedCondition)) {
          setSelectedCondition(uniqueConditions[0]);
        }
      }
    } catch (err) {
      console.error("Failed to load map data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Listen for dark mode changes specifically for the map colors
    const observer = new MutationObserver(() => {
      // Force re-render if dark mode toggles to update 0-case map fill
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!allTransactions.length) return;
    
    const conditionCounts = {};
    const fullBreakdown = {};

    allTransactions.forEach(curr => {
      const zip = curr.zipCode || '';
      const cond = curr.condition?.trim() || 'General';
      
      let stateName = 'Unknown';
      if (zip.length >= 2) {
        const prefix = zip.substring(0, 2);
        stateName = PIN_TO_STATE[prefix] || 'Unknown';
      }
      
      if (stateName !== 'Unknown') {
        // Track condition-specific counts for the map colors
        if (cond.toLowerCase() === selectedCondition.toLowerCase()) {
          conditionCounts[stateName] = (conditionCounts[stateName] || 0) + 1;
        }

        // Track full breakdown for the inspection panel
        if (!fullBreakdown[stateName]) fullBreakdown[stateName] = {};
        fullBreakdown[stateName][cond] = (fullBreakdown[stateName][cond] || 0) + 1;
      }
    });

    setHeatmapData(conditionCounts);
    setStateBreakdown(fullBreakdown);
  }, [selectedCondition, allTransactions]);

  const maxCount = Math.max(...Object.values(heatmapData), 10);
  
  const colorScale = scaleLinear()
    .domain([0, maxCount])
    .range(["#fecaca", "#7f1d1d"]); // red-200 to red-900

  return (
    <div className="h-full flex flex-col relative">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
            <MapIcon size={32} />
            {t("Epidemiological HealthMap") || "Epidemiological HealthMap"}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Click on any state to inspect the spread of all diseases based on patient ZIP codes.
          </p>
        </div>
        <button onClick={loadData} className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-2">
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          Refresh Live Data
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden flex-1 flex flex-col relative">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex gap-4 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <select 
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-white outline-none font-medium text-gray-900 dark:text-gray-100"
            >
              {conditions.length === 0 ? <option value="Fever">Fever</option> : null}
              {conditions.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          {loading && <Loader2 className="animate-spin text-blue-500" size={20} />}
          
          <div className="ml-auto flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span>0 Cases</span>
            <div className="w-4 h-4 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mx-1"></div>
            <span className="ml-2">Low</span>
            <div className="w-24 h-3 rounded-full bg-gradient-to-r from-red-200 to-red-900 border border-gray-200 dark:border-gray-700"></div>
            <span>High</span>
          </div>
        </div>

        <div className="flex-1 relative bg-[#f8fafc] dark:bg-gray-950">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ scale: 1000 }}
            className="w-full h-full"
          >
            <ZoomableGroup center={INDIA_CENTER} zoom={1}>
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const stateName = geo.properties.NAME_1 || geo.properties.st_nm || geo.properties.name || "Unknown";
                    
                    const matchKey = Object.keys(heatmapData).find(k => stateName.toLowerCase().includes(k.toLowerCase()));
                    const cases = matchKey ? heatmapData[matchKey] : 0;
                    
                    // Fixed the bug: 0 cases should be neutral gray, not dark pink!
                    const emptyColor = isDark ? "#1f2937" : "#e2e8f0"; // gray-800 or gray-200
                    const fill = cases > 0 ? colorScale(cases) : emptyColor;
                    
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={fill}
                        stroke={isDark ? "#374151" : "#ffffff"} // gray-700 or white border
                        strokeWidth={0.5}
                        onClick={() => {
                          const properName = matchKey || Object.keys(stateBreakdown).find(k => stateName.toLowerCase().includes(k.toLowerCase())) || stateName;
                          setSelectedStateForDetails({ name: properName, rawName: stateName });
                        }}
                        onMouseEnter={() => {
                          setTooltipContent(`${stateName}: ${cases} cases of ${selectedCondition}`);
                        }}
                        onMouseLeave={() => {
                          setTooltipContent("");
                        }}
                        style={{
                          default: { outline: "none", transition: "all 250ms" },
                          hover: { fill: cases > 0 ? "#7f1d1d" : (isDark ? "#374151" : "#cbd5e1"), outline: "none", cursor: "pointer", strokeWidth: 1.5 },
                          pressed: { outline: "none" },
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
          
          {tooltipContent && (
            <div className="absolute top-4 left-4 bg-black/90 text-white px-3 py-2 rounded-lg text-sm shadow-lg pointer-events-none z-10 font-medium">
              {tooltipContent}
            </div>
          )}
          
          {/* Detailed State Inspection Modal */}
          {selectedStateForDetails && (
            <div className="absolute top-4 right-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200 dark:border-gray-800 p-5 rounded-xl shadow-2xl w-80 z-20 animate-in slide-in-from-right-8">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white border-b-2 border-red-500 pb-1">
                  {selectedStateForDetails.name}
                </h3>
                <button onClick={() => setSelectedStateForDetails(null)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-3">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Disease Breakdown based on ZIP tracking:</p>
                
                {!stateBreakdown[selectedStateForDetails.name] || Object.keys(stateBreakdown[selectedStateForDetails.name]).length === 0 ? (
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm text-gray-500 text-center italic">
                    No cases reported in this region yet.
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {Object.entries(stateBreakdown[selectedStateForDetails.name])
                      .sort((a,b) => b[1]-a[1])
                      .map(([disease, count]) => (
                        <li key={disease} className="flex justify-between items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                          <span className="font-medium text-gray-700 dark:text-gray-300">{disease}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-sm font-bold ${disease === selectedCondition ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>
                            {count}
                          </span>
                        </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HealthMap;
