import React from 'react';
import { useAppContext } from '../store';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { RefreshCw, Factory } from 'lucide-react';
import { useTranslation } from '../i18n';

export function Dashboard() {
  const { yields } = useAppContext();
  const { t, language } = useTranslation();
  const isRtl = language === 'ar';

  // Multiplicative Rolling Yield formula
  const dicing = yields.dicing / 100;
  const bonding = yields.bonding / 100;
  const wire = yields.wire / 100;
  const molding = yields.molding / 100;
  const test = yields.test / 100;

  const rollingYield = (dicing * bonding * wire * molding * test) * 100;

  const data = [
    { name: t('1. Wafer Dicing'), yield: yields.dicing, step: 1 },
    { name: t('2. Die Bonding'), yield: yields.bonding, step: 2 },
    { name: t('3. Wire Bonding'), yield: yields.wire, step: 3 },
    { name: t('4. Molding Process'), yield: yields.molding, step: 4 },
    { name: t('5. Inspection & Test'), yield: yields.test, step: 5 },
  ];

  const getColor = (y: number) => {
    if(y >= 98) return '#10b981'; // green-500
    if(y >= 90) return '#f59e0b'; // amber-500
    return '#ef4444'; // red-500
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <Factory className="w-8 h-8 text-blue-600" /> {t('Executive Dashboard')}
          </h2>
          <p className="text-slate-500 mt-2">{t('Integrated Rolling Yield & Process Summary')}</p>
        </div>
        <div className="bg-slate-900 text-white rounded-2xl px-6 py-4 flex items-center gap-6 shadow-xl">
          <div>
            <p className="text-sm text-slate-400 font-medium uppercase tracking-wider">{t('Final Rolling Yield')}</p>
            <div className={`text-4xl font-mono font-bold tracking-tighter mt-1 flex items-baseline ${isRtl ? 'flex-row-reverse justify-end' : ''}`}>
              {rollingYield.toFixed(2)}
              <span className={`text-2xl ${isRtl ? 'mr-1' : 'ml-1'} text-slate-500`}>%</span>
            </div>
          </div>
          <RefreshCw className="w-8 h-8 text-blue-500 opacity-50" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
         <Card className="col-span-1 lg:col-span-2">
           <CardHeader title={t('Process Step Yields')} subtitle={t('Individual yield rates per station')} />
           <CardContent className="h-80">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 13}} dy={10} />
                  <YAxis domain={[80, 100]} axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 13}} dx={isRtl ? 10 : -10} orientation={isRtl ? 'right' : 'left'} />
                  <Tooltip cursor={{fill: '#F8FAFC'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Bar dataKey="yield" radius={[6, 6, 0, 0]} maxBarSize={60}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getColor(entry.yield)} />
                    ))}
                  </Bar>
                </BarChart>
             </ResponsiveContainer>
           </CardContent>
         </Card>

         <Card>
           <CardHeader title={t('Yield Chain Equation')} />
           <CardContent>
             <div className={`space-y-4 font-mono text-sm ${isRtl ? 'text-right' : ''}`}>
                <div className="flex justify-between items-center text-slate-600"><span dir="ltr">Y_dicing</span> <span>{dicing.toFixed(4)}</span></div>
                <div className="flex justify-between items-center text-slate-600"><span dir="ltr">&times; Y_bonding</span> <span>{bonding.toFixed(4)}</span></div>
                <div className="flex justify-between items-center text-slate-600"><span dir="ltr">&times; Y_wire</span> <span>{wire.toFixed(4)}</span></div>
                <div className="flex justify-between items-center text-slate-600"><span dir="ltr">&times; Y_molding</span> <span>{molding.toFixed(4)}</span></div>
                <div className="flex justify-between items-center text-slate-600 border-b border-dashed border-slate-300 pb-2"><span dir="ltr">&times; Y_test</span> <span>{test.toFixed(4)}</span></div>
                <div className="flex justify-between items-center font-bold text-slate-900 pt-2 text-lg"><span>{t('= Final Yield')}</span> <span dir="ltr">{rollingYield.toFixed(2)}%</span></div>
             </div>
           </CardContent>
         </Card>
      </div>

    </div>
  );
}

