import React from 'react';
import { Icons } from './Icons';
import { LayerNode } from '../types';

const layers: LayerNode[] = [
  { id: '1', name: 'Input Cube', type: '3d', details: '(H, W, Bands) - Hyperspectral' },
  { id: '2', name: '3D Conv Block', type: '3d', details: 'Spectral-Spatial Feat. Extraction' },
  { id: '3', name: 'Projection Layer', type: 'projection', details: '1x1 Conv / Adaptive Pool (3D->2D)' },
  { id: '4', name: '2D Lt-CNN', type: '2d', details: 'Spatial Refinement (Edges/Shapes)' },
  { id: '5', name: 'Global Avg Pool', type: 'dense', details: 'Feature Aggregation' },
  { id: '6', name: 'Classifier', type: 'dense', details: 'Softmax Output' },
];

const ArchitectureView: React.FC = () => {
  return (
    <div className="p-6 bg-slate-900/50 rounded-xl border border-slate-700 h-full overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Icons.Architecture className="text-indigo-400" />
          Hybrid-LtCNN Architecture
        </h2>
        <p className="text-slate-400 mt-2">
          Visualizing the flow from Hyperspectral 3D Cubes to 2D Semantic Features as defined in "Existing System 2".
        </p>
      </div>

      <div className="relative flex flex-col items-center gap-8 max-w-4xl mx-auto">
        {/* Connection Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-slate-700 -z-10 transform -translate-x-1/2 hidden md:block"></div>

        {layers.map((layer, index) => {
          let colorClass = 'bg-slate-800 border-slate-600';
          let icon = <Icons.Process size={24} />;
          
          if (layer.type === '3d') {
            colorClass = 'bg-indigo-900/40 border-indigo-500/50 text-indigo-200';
            icon = <div className="w-6 h-6 grid grid-cols-2 gap-0.5 opacity-80"><div className="bg-current rounded-sm"></div><div className="bg-current rounded-sm"></div><div className="bg-current rounded-sm"></div><div className="bg-current rounded-sm"></div></div>;
          } else if (layer.type === 'projection') {
            colorClass = 'bg-fuchsia-900/40 border-fuchsia-500/50 text-fuchsia-200';
            icon = <Icons.Brain size={24} />;
          } else if (layer.type === '2d') {
            colorClass = 'bg-cyan-900/40 border-cyan-500/50 text-cyan-200';
            icon = <div className="w-6 h-6 border-2 border-current rounded-md"></div>;
          } else if (layer.type === 'dense') {
            colorClass = 'bg-emerald-900/40 border-emerald-500/50 text-emerald-200';
            icon = <Icons.Success size={24} />;
          }

          return (
            <div key={layer.id} className="relative w-full md:w-2/3 group">
              <div className={`p-6 rounded-lg border-2 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${colorClass}`}>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-white/10 shadow-inner">
                    {icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold tracking-wide">{layer.name}</h3>
                    <p className="text-sm opacity-80 font-mono mt-1">{layer.details}</p>
                  </div>
                  <div className="text-4xl font-black opacity-5 text-white absolute right-4 top-2 pointer-events-none">
                    0{index + 1}
                  </div>
                </div>
              </div>
              {/* Arrow for mobile */}
              {index < layers.length - 1 && (
                 <div className="md:hidden flex justify-center my-2 text-slate-600">↓</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ArchitectureView;