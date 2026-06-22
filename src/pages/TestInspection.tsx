import React, { useEffect, useState } from 'react';
import { useAppContext } from '../store';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { SliderInput, ResultRow } from './WaferDicing';
import { Layers } from 'lucide-react';
import { useTranslation } from '../i18n';
import { Quiz } from '../components/Quiz';
import { testQuestions } from '../data/quizData';
import { theoryData } from '../data/theoryData';

export function TestInspection({ mode }: { mode: 'sim'|'theory'|'fa'|'quiz' }) {
  const { testInputs, setTestInputs, yields, setYields } = useAppContext();
  const { t, language } = useTranslation();

  const { testTemp, voltVariation, burninTemp, burninTime } = testInputs;

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
             <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-slate-900 leading-tight mb-3 text-lg border-b pb-2">
                    {theoryData.test[language as 'en'|'ko'|'ar']?.title || theoryData.test.en.title}
                  </h4>
                  <div className="prose prose-sm prose-slate text-sm text-slate-700">
                    {(theoryData.test[language as 'en'|'ko'|'ar']?.content || theoryData.test.en.content).split('\n\n').map((paragraph, idx) => (
                        <p key={idx} className="leading-relaxed mb-3 break-keep">{paragraph}</p>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                 <h4 className="font-semibold text-slate-900 mb-4">{t('Key Control Variables')}</h4>
                 <div className="overflow-x-auto border border-slate-200 rounded-lg bg-white">
                   <table className="w-full text-sm text-left">
                     <thead className="bg-slate-100">
                       <tr><th className="px-4 py-3 border">{t('Variable')}</th><th className="px-4 py-3 border">{t('Impact')}</th></tr>
                     </thead>
                     <tbody>
                       <tr><td className="px-4 py-3 border font-medium">Test Temp</td><td className="px-4 py-3 border">{t('Marginality screening')}</td></tr>
                       <tr><td className="px-4 py-3 border font-medium">Voltage Fluctuation</td><td className="px-4 py-3 border">{t('Parametric boundaries')}</td></tr>
                       <tr><td className="px-4 py-3 border font-medium">Burn-in Temp</td><td className="px-4 py-3 border">{t('Activation energy limit')}</td></tr>
                       <tr><td className="px-4 py-3 border font-medium">Burn-in Time</td><td className="px-4 py-3 border">{t('Infant mortality removal')}</td></tr>
                     </tbody>
                   </table>
                 </div>
                </div>
             </CardContent>
           </Card>
        )}

        {mode === 'sim' && <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
          <div className="lg:col-span-8 flex flex-col">
            <div className="flex-1 min-h-[300px]">
              <TestVisualizer testTemp={testTemp} testYield={testYield} successProb={successProb} />
            </div>
          </div>
          <div className="lg:col-span-4 flex flex-col gap-6">
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

   return (
    <Card className={`border-slate-700 transition-colors duration-1000 shadow-2xl relative overflow-hidden ${isHot ? 'bg-red-950' : isCold ? 'bg-blue-950' : 'bg-[#0f172a]'}`}>
      <CardContent className="h-72 relative flex items-center justify-center p-0 flex-col">
         {/* Engineering Background Grid */}
         <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20 pointer-events-none"></div>

         {/* Overlay Effects for harsh environment */}
         {isHot && <div className="absolute inset-0 bg-red-600/10 pointer-events-none mix-blend-overlay animate-pulse"></div>}
         {isCold && <div className="absolute inset-0 bg-blue-400/10 pointer-events-none mix-blend-overlay"></div>}

         {/* --- Labels (Positioned at edges) --- */}
         <div className="absolute top-4 right-4 z-20 flex flex-col gap-1 items-end">
            <div className="text-white text-[10px] bg-slate-800/80 px-2 py-1 rounded border border-slate-600 backdrop-blur-sm flex items-center gap-2">
               {t('ATE Tester Head')}<div className="w-2 h-2 rounded-sm bg-slate-400"></div>
            </div>
            <div className="text-[10px] text-yellow-200 bg-slate-800/80 px-2 py-1 rounded border border-yellow-700/50 backdrop-blur-sm flex items-center gap-2 mt-2">
               {t('Probe Pins (Pogo)')}<div className="w-2 h-2 rounded-full bg-yellow-400"></div>
            </div>
         </div>

         <div className="absolute top-4 left-4 z-20 flex flex-col gap-1 items-start">
            <div className="text-[10px] text-emerald-200 bg-slate-800/80 px-2 py-1 rounded border border-emerald-700/50 backdrop-blur-sm flex items-center gap-2">
               <div className="w-2 h-2 rounded-sm bg-emerald-700"></div>{t('Test Socket PCB')}
            </div>
         </div>


         {/* --- Animated Simulator Elements --- */}
         <div className="relative w-full h-[200px] z-10 flex flex-col items-center justify-center mt-6">
            
            {/* Tester Head moving up and down */}
            <div className="absolute top-0 w-64 h-16 bg-gradient-to-b from-slate-600 to-slate-800 border-x-2 border-t-2 border-slate-500 rounded-t-lg z-20 flex justify-center items-end shadow-2xl animate-[bounce_2s_infinite]">
               {/* Pogo Pins */}
               <div className="flex gap-4 mb-[-12px]">
                 {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="w-1.5 h-8 bg-yellow-400 rounded-b-sm shadow-[0_0_8px_rgba(250,204,21,0.6)]"></div>)}
               </div>
            </div>

            {/* Device Under Test (DUT) */}
            <div className="absolute top-[80px] w-48 h-6 bg-slate-900 border border-slate-700 rounded-sm z-10 flex justify-between items-center px-4 shadow-[0_0_15px_black]">
                {/* Visual Pass/Fail indicator on DUT */}
                <div className={`w-3 h-3 rounded-full ${successProb > 0.9 ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-500 shadow-[0_0_10px_#ef4444] animate-pulse'}`}></div>
                <div className="text-slate-500 font-mono text-[8px]">DUT-1042</div>
            </div>

            {/* Socket Board */}
            <div className="absolute top-[86px] w-80 h-12 bg-gradient-to-r from-emerald-800 to-emerald-900 border-y-2 border-emerald-700 z-0 flex justify-center items-end pb-2 shadow-xl">
               <div className="w-32 h-6 bg-black/80 rounded flex justify-around items-center px-2 border border-slate-700 shadow-inner">
                 <div className="w-3 h-3 rounded-sm bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]"></div>
                 <div className="w-3 h-3 rounded-sm bg-emerald-600"></div>
                 <div className="w-3 h-3 rounded-sm bg-red-500 animate-[bounce_1s_infinite] shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
               </div>
               
               {/* Heating/Cooling elements in the chuck */}
               {(isHot || isCold) && (
                 <div className="absolute inset-x-0 bottom-0 h-1/2 flex justify-around px-8 opacity-50">
                    {[1,2,3,4].map(i => (
                       <div key={i} className={`w-8 h-2 rounded ${isHot ? 'bg-red-500 blur-sm animate-pulse' : 'bg-blue-400 blur-sm'}`}></div>
                    ))}
                 </div>
               )}
            </div>

         </div>

         {/* Internal Monitor Screen overlay */}
         <div className="absolute bottom-4 left-4 w-64 h-32 bg-black/90 border border-slate-700 rounded-lg p-3 font-mono text-[11px] text-green-400 flex flex-col justify-center shadow-2xl backdrop-blur-md z-30">
            <div className="border-b border-green-900/50 pb-1 mb-1 font-bold text-green-300">ATE SYSTEM OS V9.2</div>
            <div>[STATUS] TESTING_IN_PROGRESS</div>
            <div className="mt-1">ENV_TEMP : {testTemp}°C</div>
            <div>EST_YIELD: <span className="text-white">{(testYield).toFixed(1)}%</span></div>
            <div>PROB_PASS: {(successProb * 100).toFixed(1)}%</div>
            <div className="mt-2 text-xs font-bold bg-slate-900 rounded p-1 text-center border border-slate-800 flex justify-center items-center gap-2 text-white">
              VERDICT: 
              {successProb > 0.9 ? <span className="text-green-500">GOOD BATCH</span> :
               successProb > 0.8 ? <span className="text-amber-500">MARGINAL</span> :
               <span className="text-red-500 animate-[pulse_0.5s_infinite]">CRITICAL FAIL</span>}
            </div>
         </div>

      </CardContent>
    </Card>
   );
}
