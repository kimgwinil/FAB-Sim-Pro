import React, { useEffect, useState } from 'react';
import { useAppContext } from '../store';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { SliderInput, ResultRow } from './WaferDicing';
import { Layers } from 'lucide-react';
import { useTranslation } from '../i18n';
import { Quiz } from '../components/Quiz';
import { testQuestions } from '../data/quizData';
import { getTheoryChapter } from '../data/theoryData';
import { TheoryView } from '../components/TheoryView';
import { Callout } from '../components/SvgCallout';

export function TestInspection({ mode }: { mode: 'sim'|'theory'|'fa'|'quiz' }) {
  const { testInputs, setTestInputs, yields, setYields } = useAppContext();
  const { t, language } = useTranslation();

  const { testTemp, voltVariation, burninTemp, burninTime } = testInputs;
  const theory = getTheoryChapter('test', language);

  // Visual Inspection
  const dicingDefRate = (100 - yields.dicing) / 100;
  const bondingDefRate = (100 - yields.bonding) / 100;
  const moldingDefRate = (100 - yields.molding) / 100;
  const visualDefectRate = 1 - (1 - dicingDefRate) * (1 - bondingDefRate) * (1 - moldingDefRate);
  
  // Electrical
  let dpmo = 500;
  if(testTemp === -40 || testTemp === 125) dpmo *= 1.5;
  if(voltVariation >= 15) dpmo *= 1.3;
  
  const normSinv = (p: number) => {
    // very basic approximation for sigma level mapping
    if(p >= 0.99999) return 4.5;
    if(p >= 0.999) return 3.0;
    if(p >= 0.99) return 2.3;
    if(p >= 0.90) return 1.2;
    return 0;
  };
  const successProb = 1 - (dpmo / 1000000);
  const sigmaLevel = normSinv(successProb) + 1.5;

  // Burn-in
  const Ea = 0.7; // eV
  const k = 8.617e-5;
  const tempK1 = 298; // 25C
  const tempK2 = burninTemp + 273;
  const af = Math.exp( (Ea/k) * (1/tempK1 - 1/tempK2) );
  const eqLife = burninTime * af;
  
  const removalRate = Math.min(95, (burninTime * af / 1000) * 100);
  const fit = 1000000000 / Math.max(eqLife, 1);
  const mtbf = 1000000000 / fit;

  const testYield = Math.max(0, 100 - (1 - successProb)*100 - (1 - removalRate/100));

  useEffect(() => {
    setYields({ test: testYield });
  }, [testYield]);

  const outputFormat = `━━━━━━━━━━━━━━━━━━━━━━━━━
📊 FINAL YIELD DASHBOARD
━━━━━━━━━━━━━━━━━━━━━━━━━
Input Quantity  : 1,000 ea
Visual Pass     : ${Math.floor(1000 * (1 - visualDefectRate))} ea (${((1-visualDefectRate)*100).toFixed(1)}%)
Elec. Pass      : ${Math.floor(1000 * successProb)} ea (${(successProb*100).toFixed(1)}%)
Burn-in Pass    : ${Math.floor(1000 * (removalRate/100))} ea (${removalRate.toFixed(1)}%)
━━━━━━━━━━━━━━━━━━━━━━━━━
Test Set Yield  : ${testYield.toFixed(2)} %
Sigma Level     : ${sigmaLevel.toFixed(1)} σ
MTBF (Hours)    : ${mtbf.toLocaleString(undefined, {maximumFractionDigits: 0})} hrs
━━━━━━━━━━━━━━━━━━━━━━━━━`;

  return (
    <div className="flex flex-col p-6 max-w-[1600px] mx-auto h-[calc(100vh-64px)] overflow-hidden">
      <div className="mb-6 shrink-0">
        <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">{t('Inspection & Test Simulator')}</h2>
        <p className="text-slate-500 mt-1">{t('Electrical testing, visual inspection, and Arrhenius burn-in screening.')}</p>
      </div>

      <div className="flex-1 overflow-y-auto pb-8">
        {mode === 'theory' && (
           <Card className="bg-slate-50 border-slate-200 shadow-inner max-w-4xl">
             <CardHeader title={t('Practice Theory')} icon={<Layers className="w-5 h-5 text-blue-600" />} />
             <CardContent>
                <TheoryView title={theory.title} content={theory.content} />
             </CardContent>
           </Card>
        )}

        {mode === 'sim' && <div className="flex flex-col gap-4">
          <div className="mx-auto w-full max-w-[760px]">
            <TestVisualizer testTemp={testTemp} testYield={testYield} successProb={successProb} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader title={t('Test Environment Setup')} />
              <CardContent className="space-y-6">
                 <div className="mb-4">
                   <label className="text-sm font-medium text-slate-700 block mb-2">{t('Test Temperature (°C)')}</label>
                   <div className="flex gap-2 text-sm">
                     {[-40, 25, 125].map(tempVal =>(
                       <button key={tempVal} onClick={()=> setTestInputs({...testInputs, testTemp: tempVal})} className={`flex-1 py-2 rounded border focus:outline-none ${testTemp === tempVal ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold' : 'border-slate-200 text-slate-600 bg-white'}`}>{tempVal} °C</button>
                     ))}
                   </div>
                 </div>
                 <div className="mb-4">
                   <label className="text-sm font-medium text-slate-700 block mb-2">{t('Voltage Fluctuation (±%)')}</label>
                   <div className="flex gap-2 text-sm">
                     {[5, 10, 15].map(v =>(
                       <button key={v} onClick={()=> setTestInputs({...testInputs, voltVariation: v})} className={`flex-1 py-2 rounded border focus:outline-none ${voltVariation === v ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold' : 'border-slate-200 text-slate-600 bg-white'}`}>±{v}%</button>
                 ))}
               </div>
             </div>
             <SliderInput label={t('Burn-in Temp (°C)')} min={85} max={150} value={burninTemp} step={5}
              onChange={(v: number) => setTestInputs({...testInputs, burninTemp: v})} />
              <SliderInput label={t('Burn-in Time (Hours)')} min={24} max={168} value={burninTime} step={12}
              onChange={(v: number) => setTestInputs({...testInputs, burninTime: v})} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader title={t('Output Report')} />
          <CardContent>
            <pre className="font-mono text-sm leading-relaxed p-4 bg-slate-900 text-blue-400 rounded-lg overflow-x-auto whitespace-pre-wrap">
              {outputFormat}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>}

      {mode === 'fa' && (
         <Card>
          <CardHeader title={t('Fault Tree Analysis (FTA)')} />
          <CardContent>
            <pre className="text-sm font-mono text-slate-800 bg-slate-50 p-6 rounded-lg leading-6 inline-block">
{`[${t('Functional Failure @ High Temp')}]
       |
       +--> [${t('Open Circuit')}]
       |       |--> ${t('Wire Sweep (Mold flow too high)')}
       |       |--> ${t('Neck Break (Wire loop fatigue)')}
       |
       +--> [${t('Short Circuit')}]
               |--> ${t('Flash over leadframe')}
               |--> ${t('Wire Sag / Droop')}`}
            </pre>
          </CardContent>
         </Card>
      )}

      {mode === 'quiz' && <div className="max-w-4xl"><Quiz questions={testQuestions} /></div>}
      </div>
    </div>
  );
}

function TestVisualizer({ testTemp, testYield, successProb }: { testTemp: number, testYield: number, successProb: number }) {
   const isHot = testTemp > 50;
   const isCold = testTemp < 0;
   const { t } = useTranslation();
   const envColor = isHot ? '#ef4444' : isCold ? '#38bdf8' : '#22c55e';
   const headY = successProb > 0.9 ? 56 : 64;

   return (
    <Card className={`border-slate-700 transition-colors duration-1000 shadow-2xl relative overflow-hidden ${isHot ? 'bg-red-950' : isCold ? 'bg-blue-950' : 'bg-[#0f172a]'}`}>
      <CardContent className="p-0">
         <svg viewBox="0 0 760 300" className="w-full block select-none" style={{ aspectRatio: '760 / 300' }}>
           <defs>
             <pattern id="test-grid" width="20" height="20" patternUnits="userSpaceOnUse">
               <path d="M20 0H0V20" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
             </pattern>
             <linearGradient id="pcb" x1="0" x2="1" y1="0" y2="0">
               <stop offset="0%" stopColor="#065f46" />
               <stop offset="100%" stopColor="#064e3b" />
             </linearGradient>
           </defs>
           <rect width="760" height="300" fill="url(#test-grid)" />
           <rect width="760" height="300" fill={envColor} opacity={isHot || isCold ? 0.08 : 0.02} />
           <rect x="260" y={headY} width="240" height="58" rx="7" fill="#334155" stroke="#94a3b8" strokeWidth="1.3" />
           <rect x="282" y={headY + 12} width="196" height="12" rx="3" fill="#64748b" opacity="0.6" />
           {Array.from({ length: 10 }).map((_, i) => {
             const x = 292 + i * 19;
             return <rect key={x} x={x} y={headY + 52} width="5" height="46" rx="2" fill="#facc15" stroke="#fef08a" strokeWidth="0.8" />;
           })}
           <rect x="278" y="176" width="204" height="26" rx="4" fill="#020617" stroke="#64748b" strokeWidth="1.2" />
           <circle cx="300" cy="189" r="6" fill={successProb > 0.9 ? '#22c55e' : '#ef4444'}>
             {successProb <= 0.9 && <animate attributeName="opacity" values="0.4;1;0.4" dur="0.8s" repeatCount="indefinite" />}
           </circle>
           <text x="380" y="193" fill="#94a3b8" fontSize="11" fontFamily="monospace" textAnchor="middle">DUT-1042</text>
           <rect x="220" y="202" width="320" height="48" rx="5" fill="url(#pcb)" stroke="#34d399" strokeWidth="1.1" />
           <rect x="312" y="212" width="136" height="22" rx="4" fill="#052e2b" stroke="#10b981" strokeWidth="0.8" />
           {[334, 358, 382, 406, 430].map((x, i) => (
             <circle key={x} cx={x} cy="223" r="4" fill={i === 3 && successProb <= 0.9 ? '#ef4444' : '#34d399'} opacity="0.9" />
           ))}
           {(isHot || isCold) && [250, 330, 410, 490].map((x) => (
             <rect key={x} x={x} y="238" width="42" height="5" rx="2" fill={envColor} opacity="0.75" />
           ))}

           <Callout x={382} y={headY + 8} lx={20} ly={28} anchor="start" dot="#cbd5e1">{t('ATE Tester Head')}</Callout>
           <Callout x={382} y={headY + 84} lx={740} ly={28} anchor="end" dot="#fde047">{t('Probe Pins (Pogo)')}</Callout>
           <Callout x={388} y={188} lx={740} ly={220} anchor="end" dot="#94a3b8">{t('DUT')}</Callout>
           <Callout x={455} y={228} lx={20} ly={220} anchor="start" dot="#34d399">{t('Test Socket PCB')}</Callout>
         </svg>
         <div className="w-full bg-slate-950/90 px-4 py-2 border-t border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] font-mono text-slate-300">
            <span>ATE OS: <span className="text-green-400 font-bold">TESTING</span></span>
            <span>ENV_TEMP: <span className="text-white font-bold">{testTemp}°C</span></span>
            <span>EST_YIELD: <span className="text-white font-bold">{testYield.toFixed(1)}%</span></span>
            <span>VERDICT: <span className={successProb > 0.9 ? "text-green-400 font-bold" : successProb > 0.8 ? "text-amber-400 font-bold" : "text-red-400 font-bold"}>
              {successProb > 0.9 ? t('GOOD BATCH') : successProb > 0.8 ? t('MARGINAL') : t('CRITICAL FAIL')}
            </span></span>
         </div>
      </CardContent>
    </Card>
   );
}
