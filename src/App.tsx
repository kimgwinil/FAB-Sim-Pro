import React, { useState } from 'react';
import { AppProvider, useAppContext, Language } from './store';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { WaferDicing } from './pages/WaferDicing';
import { DieBonding } from './pages/DieBonding';
import { WireBonding } from './pages/WireBonding';
import { Molding } from './pages/Molding';
import { TestInspection } from './pages/TestInspection';
import { Globe } from 'lucide-react';

function TopBar() {
  const { language, setLanguage } = useAppContext();
  return (
    <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-end px-6 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
        <Globe className="w-4 h-4 text-slate-400" />
        <select 
          value={language} 
          onChange={(e) => setLanguage(e.target.value as Language)}
          className="bg-transparent border-none focus:ring-0 cursor-pointer outline-none"
        >
          <option value="ko">한국어 (Korean)</option>
          <option value="en">English</option>
          <option value="ar">العربية (Arabic)</option>
        </select>
      </div>
    </div>
  );
}


function AppContent() {
  const [activeTab, setActiveTab] = useState('dicing');
  const [activeMode, setActiveMode] = useState<'sim'|'theory'|'fa'|'quiz'>('sim');
  const { language } = useAppContext();
  const isRTL = language === 'ar';

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} activeMode={activeMode} setActiveMode={setActiveMode} />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <TopBar />
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'dicing' && <WaferDicing mode={activeMode} />}
          {activeTab === 'bonding' && <DieBonding mode={activeMode} />}
          {activeTab === 'wire' && <WireBonding mode={activeMode} />}
          {activeTab === 'molding' && <Molding mode={activeMode} />}
          {activeTab === 'test' && <TestInspection mode={activeMode} />}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

