import React, { useState, useRef, useCallback } from 'react';
import { Icons } from './Icons';
import { InferenceResult } from '../types';
import { analyzeFlowerImage } from '../services/geminiService';

const InferenceTool: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [base64Data, setBase64Data] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<InferenceResult | null>(null);
  const [showGradCam, setShowGradCam] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setMimeType(file.type);
      setResult(null);
      setError(null);
      setShowGradCam(false);

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setBase64Data(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInference = useCallback(async () => {
    if (!base64Data) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const data = await analyzeFlowerImage(base64Data, mimeType);
      
      setResult({
        className: data.className,
        confidence: data.confidence,
        heatmapIntensity: 0.75,
        fullReport: data.fullReport
      });
      
      setShowGradCam(true);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }, [base64Data, mimeType]);

  // Helper to format the research report text
  const renderReport = (text: string) => {
    return text.split('\n').map((line, i) => {
      // Handle Headers (Lines with emojis)
      if (line.match(/^[🔍📊🧬🔥📁📎]/)) {
        return (
          <div key={i} className="mt-6 mb-2 text-lg font-bold text-white border-b border-slate-700 pb-1">
            {line}
          </div>
        );
      }
      // Handle Sub-headers or Key-Value pairs (e.g., "Species: Name")
      if (line.includes(':')) {
        const parts = line.split(':');
        const label = parts[0];
        const value = parts.slice(1).join(':');
        
        // Check for bullet points
        const isBullet = line.trim().startsWith('-');
        
        return (
          <div key={i} className={`flex flex-col sm:flex-row sm:gap-2 mb-1 text-sm md:text-base ${isBullet ? 'pl-4' : ''}`}>
            <span className={`${isBullet ? 'text-slate-400' : 'text-cyan-400 font-bold'} sm:min-w-[180px]`}>
              {label}:
            </span>
            <span className="text-slate-300">{value}</span>
          </div>
        );
      }
      // Regular text
      if (line.trim() === '') return <div key={i} className="h-2"></div>;
      
      return <div key={i} className="text-slate-300 text-sm md:text-base mb-1 pl-4">{line}</div>;
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Left Panel: Upload and Controls */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Icons.Inference className="text-cyan-400" />
              Live Inference
            </h2>
          </div>
          
          <div className="flex flex-wrap gap-4 mb-6">
             <button 
               onClick={() => fileInputRef.current?.click()}
               className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
             >
               <Icons.Upload size={18} />
               Upload Flower Image
             </button>
             <input 
               type="file" 
               ref={fileInputRef} 
               className="hidden" 
               accept="image/*" 
               onChange={handleFileSelect}
             />
             
             <button 
               onClick={handleInference}
               disabled={!base64Data || isProcessing}
               className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all ${
                 !base64Data || isProcessing 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/20'
               }`}
             >
               {isProcessing ? (
                 <>
                   <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                   Analyzing...
                 </>
               ) : (
                 <>Run Analysis</>
               )}
             </button>
          </div>

          {/* Image Viewport */}
          <div className="relative aspect-video w-full bg-slate-950 rounded-lg border-2 border-dashed border-slate-700 flex items-center justify-center overflow-hidden group">
            {selectedImage ? (
              <>
                <img 
                  src={selectedImage} 
                  alt="Input" 
                  className="w-full h-full object-contain z-10 relative" 
                />
                
                {/* Simulated Grad-CAM Overlay */}
                {showGradCam && (
                  <div 
                    className="absolute inset-0 z-20 mix-blend-overlay opacity-70 pointer-events-none transition-opacity duration-500"
                    style={{
                      background: 'radial-gradient(circle at 50% 50%, rgba(255, 0, 0, 0.8) 0%, rgba(255, 255, 0, 0.4) 30%, rgba(0, 0, 255, 0) 70%)'
                    }}
                  ></div>
                )}

                {/* Overlay Toggle */}
                {result && (
                  <div className="absolute bottom-4 right-4 z-30 flex gap-2">
                    <button
                       onClick={() => setShowGradCam(!showGradCam)}
                       className="bg-black/70 backdrop-blur-md text-xs text-white px-3 py-1 rounded-full border border-white/20 hover:bg-black/90 transition-colors"
                    >
                      {showGradCam ? 'Hide Heatmap' : 'Show Heatmap'}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center text-slate-500">
                <Icons.Inference size={48} className="mx-auto mb-2 opacity-20" />
                <p>Upload an image to start live analysis</p>
                <p className="text-xs opacity-50 mt-2">Supports JPEG, PNG, WEBP</p>
              </div>
            )}
          </div>
          {error && (
              <div className="mt-4 p-3 bg-rose-900/30 border border-rose-500/30 rounded-lg text-rose-200 text-sm flex items-center gap-2">
                  <Icons.Alert size={16} />
                  {error}
              </div>
          )}
        </div>
      </div>

      {/* Right Panel: Results & AI */}
      <div className="space-y-6">
        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 h-full flex flex-col overflow-y-auto max-h-[calc(100vh-6rem)]">
           <h3 className="text-lg font-semibold text-white mb-4 border-b border-slate-700 pb-2 flex justify-between items-center sticky top-0 bg-slate-900/95 py-2 backdrop-blur-sm z-10">
               <span>Analysis Results</span>
               {result && <span className="text-xs font-mono text-emerald-400 bg-emerald-900/30 px-2 py-1 rounded border border-emerald-500/30">CONFIDENCE: {(result.confidence * 100).toFixed(1)}%</span>}
           </h3>
           
           {result ? (
             <div className="flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="font-mono text-sm leading-relaxed">
                   {renderReport(result.fullReport)}
                </div>
             </div>
           ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-slate-600">
                <div className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-cyan-500 animate-spin mb-6" style={{ opacity: isProcessing ? 1 : 0 }}></div>
                <p className="text-sm font-medium">{isProcessing ? 'Analyzing morphological features...' : 'Upload image to analyze'}</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default InferenceTool;