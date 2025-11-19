import React from 'react';
import { Icons } from './Icons';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-white mb-2">System Overview</h1>
        <p className="text-slate-400">Existing System 2: 3D-2D Hybrid Lightweight CNN for Flower Classification</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Model Accuracy', value: '98.2%', sub: '+1.4% vs SVM', color: 'text-emerald-400', icon: Icons.Success },
          { label: 'Params', value: '0.8M', sub: 'Lightweight', color: 'text-indigo-400', icon: Icons.Process },
          { label: 'Inference Time', value: '24ms', sub: 'Real-time capable', color: 'text-cyan-400', icon: Icons.Training },
          { label: 'Dataset Size', value: '12,400', sub: 'Hyperspectral Cubes', color: 'text-fuchsia-400', icon: Icons.Dashboard },
        ].map((stat, idx) => (
          <div key={idx} className="bg-slate-900/50 border border-slate-700 p-6 rounded-xl hover:border-slate-600 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-lg bg-slate-800 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-slate-400">{stat.label}</div>
            <div className="text-xs text-slate-500 mt-2 font-mono">{stat.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { action: 'Training Job #402 Completed', time: '2 mins ago', status: 'success' },
              { action: 'New Dataset "Orchids_HS" Uploaded', time: '1 hour ago', status: 'neutral' },
              { action: 'Model Checkpoint Saved (Epoch 50)', time: '3 hours ago', status: 'neutral' },
              { action: 'Validation Accuracy Drop Detected', time: '5 hours ago', status: 'warning' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 text-sm border-b border-slate-800 pb-3 last:border-0">
                <div className={`w-2 h-2 rounded-full ${item.status === 'success' ? 'bg-emerald-500' : item.status === 'warning' ? 'bg-amber-500' : 'bg-indigo-500'}`}></div>
                <span className="text-slate-300 flex-1">{item.action}</span>
                <span className="text-slate-500">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900/50 border border-indigo-500/20 rounded-xl p-6 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-lg font-bold text-white mb-2">Deployment Ready</h3>
            <p className="text-slate-300 mb-6 text-sm max-w-md">
              The Hybrid-LtCNN model has been exported to ONNX format and is optimized for edge deployment on NVIDIA Jetson.
            </p>
            <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Download ONNX Model
            </button>
          </div>
          <Icons.Brain className="absolute -right-6 -bottom-6 text-indigo-500/10 w-48 h-48" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;