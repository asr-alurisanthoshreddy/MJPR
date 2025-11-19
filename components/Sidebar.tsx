
import React from 'react';
import { AppView } from '../types';
import { Icons } from './Icons';

interface SidebarProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: AppView.DASHBOARD, label: 'Dashboard', icon: Icons.Dashboard }, // This points to InferenceTool
    { id: AppView.TRAINING, label: 'Training', icon: Icons.Training },
  ];

  return (
    <div className="w-20 lg:w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full">
      <div className="p-6 flex items-center gap-3 justify-center lg:justify-start border-b border-slate-800">
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-lg shrink-0"></div>
        <h1 className="font-bold text-lg text-white hidden lg:block tracking-tight">HSSAN</h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-indigo-300'
              }`}
            >
              <item.icon size={20} className={isActive ? 'animate-pulse' : ''} />
              <span className="hidden lg:block font-medium">{item.label}</span>
              
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white hidden lg:block"></div>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
