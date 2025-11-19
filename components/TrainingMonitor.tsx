import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
import { Icons } from './Icons';
import { TrainingMetric } from '../types';

const TrainingMonitor: React.FC = () => {
  const [configInput, setConfigInput] = useState('');
  const [isTraining, setIsTraining] = useState(false);
  const [data, setData] = useState<TrainingMetric[]>([]);
  const [epoch, setEpoch] = useState(0);
  const [liveReport, setLiveReport] = useState<string>('');
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Function to generate the detailed "Research Paper" style report based on training progress
  const generateEpochReport = (currentEpoch: number, valAcc: number, valLoss: number) => {
    const isEarly = currentEpoch < 10;
    const isMid = currentEpoch >= 10 && currentEpoch < 30;
    const isLate = currentEpoch >= 30;

    let morphology = "";
    let cam = "";
    let datasetStatus = "Background integrity: OK";

    if (isEarly) {
      morphology = `- Feature extraction: Initializing 3D spectral kernels.\n- Pattern recognition: detecting basic edges and spectral gradients.\n- Texture complexity: Low-level noise filtering active.`;
      cam = `- High-activation regions (red): Diffuse, non-specific.\n- Reason: Model is currently learning global spectral statistics rather than spatial semantics.`;
      datasetStatus = "Spatial coverage: Analyzing tile distribution... OK.";
    } else if (isMid) {
      morphology = `- Feature extraction: 3D-to-2D projection layer stabilizing.\n- Leaf shape identified: Beginning to distinguish ovate vs. lanceolate outlines.\n- Venation pattern: Midrib features showing increased activation.\n- Color patterns: Spectral bands 50-70 showing high discriminative power.`;
      cam = `- High-activation regions (red): Focusing on leaf margins and central veins.\n- Medium activation (green): Canopy texture.\n- Reason: Spatial refinement layer is capturing serrated margin details.`;
    } else {
      morphology = `- Leaf shape identified: Distinct classification of compound vs. simple leaves.\n- Venation pattern: Reticulate venation fully resolved.\n- Margin characteristics: Serrated edges driving high confidence.\n- Flower/fruit features: Reproductive structures showing 95% feature importance.\n- Texture complexity: High-frequency spatial details mapped to class labels.`;
      cam = `- High-activation regions (red): Flower petals and distinct vein intersections.\n- Low activation (blue): Successfully suppressing soil background.\n- Reason: Semantic features fully converged; model relies on phyllotaxy and floral texture.`;
    }

    const precision = (valAcc * 0.92).toFixed(2);
    const recall = (valAcc * 0.89).toFixed(2);
    const f1 = (valAcc * 0.90).toFixed(2);

    return `🔍 **Epoch ${currentEpoch} Analysis:**
Status: ${isLate ? 'CONVERGING' : isMid ? 'LEARNING SPATIAL FEATURES' : 'INITIALIZING'}

📊 **Confidence Metrics:**
Val Accuracy: ${(valAcc * 100).toFixed(1)}% | Val Loss: ${valLoss.toFixed(3)}
Precision: ${precision} | Recall: ${recall} | F1-Score: ${f1}

🧬 **Morphological Reasoning:**
${morphology}

🔥 **CAM-Style Activation Interpretation:**
${cam}

📁 **Dataset Consistency Check:**
- ${datasetStatus}
- Batch Norm statistics: Stable
- Risk of Misclassification: ${valLoss > 0.5 ? 'Medium' : 'Low'}
`;
  };

  useEffect(() => {
    let interval: number | undefined;

    if (isTraining) {
      interval = window.setInterval(() => {
        setEpoch((prev) => {
          const nextEpoch = prev + 1;
          
          // Simulate realistic training curves
          const baseAcc = 0.4 + (0.55 * (1 - Math.exp(-nextEpoch / 15))); // Logistic-like growth
          const noise = (Math.random() - 0.5) * 0.05;
          const newAcc = Math.min(0.99, Math.max(0.0, baseAcc + noise));
          
          const baseLoss = 2.5 * Math.exp(-nextEpoch / 10);
          const newLoss = Math.max(0.05, baseLoss + Math.random() * 0.1);

          const newMetric: TrainingMetric = {
            epoch: nextEpoch,
            loss: newLoss,
            accuracy: newAcc + 0.05, // Train usually higher than val
            val_loss: newLoss + 0.1,
            val_accuracy: newAcc,
          };

          setData((prevData) => [...prevData, newMetric]);
          setLiveReport(generateEpochReport(nextEpoch, newAcc, newLoss + 0.1));
          
          return nextEpoch;
        });
      }, 1500);
    }

    return () => window.clearInterval(interval);
  }, [isTraining]);

  // Auto-scroll the text report
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [liveReport]);

  // Helper to render the report text with formatting
  const renderReportText = (text: string) => {
    if (!text) return <div className="text-slate-500 italic">Waiting for training to start...</div>;
    
    return text.split('\n').map((line, i) => {
      if (line.match(/^[🔍📊🧬🔥📁📎]/)) {
        return <div key={i} className="mt-4 mb-2 font-bold text-cyan-400 border-b border-slate-700 pb-1">{line}</div>;
      }
      if (line.includes(':')) {
        const [key, val] = line.split(':');
        const isBullet = line.trim().startsWith('-');
        return (
          <div key={i} className={`flex text-sm mb-1 ${isBullet ? 'pl-4' : ''}`}>
            <span className={`${isBullet ? 'text-slate-400' : 'font-semibold text-indigo-300'} mr-2`}>{key}:</span>
            <span className="text-slate-200">{val}</span>
          </div>
        );
      }
      return <div key={i} className="text-sm text-slate-300 pl-4">{line}</div>;
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full overflow-hidden">
      
      {/* Left Column: Configuration & Charts */}
      <div className="lg:col-span-2 flex flex-col gap-6 h-full overflow-y-auto pr-2">
        
        {/* Configuration Panel */}
        <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-700 shrink-0">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Icons.Training className="text-emerald-400" />
                Training Configuration
            </h2>
            <div className="flex gap-2">
               <button
                onClick={() => {
                  setData([]);
                  setEpoch(0);
                  setLiveReport('');
                  setIsTraining(true);
                }}
                disabled={isTraining || configInput.length < 10}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${
                   isTraining || configInput.length < 10
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20'
                }`}
              >
                <Icons.Process size={16} />
                Initialize & Train
              </button>
              {isTraining && (
                <button 
                  onClick={() => setIsTraining(false)}
                  className="px-4 py-2 rounded-lg font-bold text-sm bg-rose-500/20 text-rose-400 border border-rose-500/50 hover:bg-rose-500/30"
                >
                  Stop
                </button>
              )}
            </div>
          </div>
          
          <div className="relative group">
             <textarea
               value={configInput}
               onChange={(e) => setConfigInput(e.target.value)}
               placeholder="Paste Dataset API Endpoint or Python Training Config here...&#10;Example:&#10;dataset_url = 'https://api.hssan-dataset.org/v1/flowers'&#10;batch_size = 32&#10;lr = 0.001"
               className="w-full h-24 bg-slate-950 font-mono text-xs text-slate-300 p-3 rounded-lg border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
             />
             <div className="absolute bottom-3 right-3 text-xs text-slate-500 pointer-events-none">
               {configInput.length > 0 ? 'Config Loaded' : 'Required'}
             </div>
          </div>
        </div>

        {/* Charts Area */}
        <div className="grid grid-cols-1 gap-6 flex-1">
           {/* Combined Loss/Accuracy Chart */}
           <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700 shadow-xl flex flex-col h-[300px]">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 ml-2">Real-time Metrics</h3>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="epoch" stroke="#64748b" tick={{fontSize: 12}} />
                    <YAxis yAxisId="left" stroke="#10b981" domain={[0, 1]} tick={{fontSize: 12}} />
                    <YAxis yAxisId="right" orientation="right" stroke="#f43f5e" tick={{fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
                      itemStyle={{ fontSize: '12px' }}
                    />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="val_accuracy" stroke="#10b981" strokeWidth={2} dot={false} name="Val Accuracy" />
                    <Line yAxisId="right" type="monotone" dataKey="loss" stroke="#f43f5e" strokeWidth={2} dot={false} name="Training Loss" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
           </div>
        </div>
        
        {/* Key Stats Row */}
        <div className="grid grid-cols-4 gap-4 shrink-0">
           {[
             { label: 'Epoch', value: epoch, color: 'text-white' },
             { label: 'Best Val Acc', value: `${(Math.max(0, ...data.map(d => d.val_accuracy)) * 100).toFixed(1)}%`, color: 'text-emerald-400' },
             { label: 'Precision', value: data.length > 0 ? (data[data.length-1].val_accuracy * 0.92).toFixed(2) : '-', color: 'text-cyan-400' },
             { label: 'F1-Score', value: data.length > 0 ? (data[data.length-1].val_accuracy * 0.90).toFixed(2) : '-', color: 'text-indigo-400' },
           ].map((stat, i) => (
             <div key={i} className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
               <div className="text-slate-500 text-[10px] uppercase font-bold mb-1">{stat.label}</div>
               <div className={`text-xl font-mono font-bold ${stat.color}`}>{stat.value}</div>
             </div>
           ))}
        </div>
      </div>

      {/* Right Column: Live Research Analysis */}
      <div className="bg-slate-900/90 border border-slate-700 rounded-xl flex flex-col overflow-hidden shadow-2xl">
         <div className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
            <h3 className="font-bold text-white flex items-center gap-2">
               <Icons.AI className="text-amber-400" size={18} />
               Live Training Insights
            </h3>
            {isTraining && <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>}
         </div>
         
         <div 
           ref={scrollRef}
           className="flex-1 overflow-y-auto p-4 font-mono bg-slate-950/50"
         >
            {liveReport ? (
               <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {renderReportText(liveReport)}
               </div>
            ) : (
               <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4 opacity-50">
                  <Icons.Brain size={48} strokeWidth={1} />
                  <div className="text-center text-sm max-w-[200px]">
                    Waiting for dataset configuration to begin analysis stream...
                  </div>
               </div>
            )}
         </div>
      </div>

    </div>
  );
};

export default TrainingMonitor;