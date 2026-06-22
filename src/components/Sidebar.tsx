import { ChevronDown, Disc3, Microchip, Activity, Layers, SearchCheck, LayoutDashboard } from 'lucide-react';
import { useTranslation } from '../i18n';

export const tabs = [
  { id: 'dashboard', nameKey: 'Rolling Yield', icon: LayoutDashboard },
  { id: 'dicing', nameKey: '1. Wafer Dicing', icon: Disc3 },
  { id: 'bonding', nameKey: '2. Die Bonding', icon: Layers },
  { id: 'wire', nameKey: '3. Wire Bonding', icon: Activity },
  { id: 'molding', nameKey: '4. Molding Process', icon: Microchip },
  { id: 'test', nameKey: '5. Inspection & Test', icon: SearchCheck },
];

const subMenus = [
  { id: 'theory', nameKey: 'Practice Theory' },
  { id: 'sim', nameKey: 'Simulator' },
  { id: 'fa', nameKey: 'Failure Analysis' },
  { id: 'quiz', nameKey: 'Training Quiz' }
] as const;

interface SidebarProps {
  activeTab: string;
  setActiveTab: (id: string) => void;
  activeMode: 'sim'|'theory'|'fa'|'quiz';
  setActiveMode: (mode: 'sim'|'theory'|'fa'|'quiz') => void;
}

export function Sidebar({ activeTab, setActiveTab, activeMode, setActiveMode }: SidebarProps) {
  const { t, language } = useTranslation();
  const isRtl = language === 'ar';

  return (
    <div className={`w-64 bg-[#0f172a] text-slate-300 flex flex-col h-screen shrink-0 ${isRtl ? 'border-l' : 'border-r'} border-slate-800`}>
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-semibold text-white tracking-tight">{t('FAB Sim Pro')}</h1>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{t('Packaging Simulator')}</p>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.id === activeTab;
            const hasSubMenu = tab.id !== 'dashboard';
            return (
              <li key={tab.id} className="mb-1">
                <button
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (!isActive && hasSubMenu) setActiveMode('theory');
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                    isActive 
                      ? 'bg-blue-600/10 text-blue-400' 
                      : 'hover:bg-slate-800 hover:text-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                    {t(tab.nameKey)}
                  </div>
                  {hasSubMenu && <ChevronDown className={`w-4 h-4 transition-transform ${isActive ? 'rotate-180 text-blue-400' : 'text-slate-600'}`} />}
                </button>
                {isActive && hasSubMenu && (
                  <ul className="mt-1 mb-2 ml-4 pl-4 border-l border-slate-800 space-y-1">
                    {subMenus.map((sub) => (
                      <li key={sub.id}>
                        <button
                          onClick={() => setActiveMode(sub.id)}
                          className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors text-sm ${
                            activeMode === sub.id
                              ? 'bg-slate-800 text-white font-medium'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                          }`}
                        >
                          {t(sub.nameKey)}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-6 border-t border-slate-800">
        <div className={`text-xs text-slate-500 font-mono ${isRtl ? 'text-right' : 'text-left'}`}>SYS_CORE_OP_v2.0</div>
      </div>
    </div>
  );
}

