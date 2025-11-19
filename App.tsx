
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TrainingMonitor from './components/TrainingMonitor';
import InferenceTool from './components/InferenceTool';
import { AppView } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);

  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        // The User requested "Inference" be renamed to "Dashboard"
        return <InferenceTool />;
      case AppView.TRAINING:
        return <TrainingMonitor />;
      default:
        return <InferenceTool />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden selection:bg-indigo-500/30">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="flex-1 flex flex-col h-full min-w-0">
        {/* Top bar with API Key Status */}
        <div className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur flex items-center justify-end px-8">
          <div className="flex items-center gap-4">
             {!process.env.API_KEY && (
                <div className="text-amber-500 text-xs bg-amber-950/30 px-3 py-1 rounded-full border border-amber-900/50 flex items-center gap-2">
                   Warning: Gemini API Key missing
                </div>
             )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto p-6 lg:p-8">
           {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;