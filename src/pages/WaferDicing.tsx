import React, { useEffect, useState } from 'react';
import { useAppContext } from '../store';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { AlertCircle, FileText, Activity, Disc3 } from 'lucide-react';
import { useTranslation } from '../i18n';
import { Quiz } from '../components/Quiz';
import { dicingQuestions } from '../data/quizData';
import { theoryData } from '../data/theoryData';

export function WaferDicing({ mode }: { mode: 'sim'|'theory'|'fa'|'quiz' }) {
  const { dicingInputs, setDicingInputs, setYields } = useAppContext();
  const { t, language } = useTranslation();

  const { rpm, feedRate, coolant, bladeWear } = dicingInputs;

  // Calculators
  const chipping = (feedRate / rpm * 1000) + (bladeWear * 0.5);
  const temp = 150 + (rpm / 1000 * 2) + (feedRate * 0.8) - (coolant * 30);
  const tempExcess = Math.max(0, temp - 180);
  const calculatedYield = Math.max(0, 100 - (chipping * 2) - (tempExcess * 0.5));

  // Determine bounds & statuses
  const chippingStatus = chipping < 5 ? 'Good' : chipping <= 15 ? 'Warning' : 'Bad';
  const tempStatus = temp < 180 ? 'Good' : temp <= 220 ? 'Warning' : 'Bad';
  const processStatus = chippingStatus === 'Bad' || tempStatus === 'Bad' ? 'Fail' : 
                        chippingStatus === 'Warning' || tempStatus === 'Warning' ? 'Warning' : 'Pass';

  const getStatusText = (s: string) => {
    if(s === 'Good' || s === 'Pass') return t('PASS');
    if(s === 'Warning') return t('WARNING');
    return t('FAIL');
  };

  useEffect(() => {
    setYields({ dicing: calculatedYield });
  }, [calculatedYield]);

  return (
    <div className="flex flex-col p-6 max-w-[1600px] mx-auto h-[calc(100vh-64px)] overflow-hidden">
      <div className="mb-6 shrink-0">
        <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">{t('Wafer Dicing Simulator')}</h2>
        <p className="text-slate-500 mt-1">{t('Simulate mechanical sawing of 200mm Si wafer (775μm thickness).')}</p>
      </div>

      <div className="flex-1 overflow-y-auto pb-8">
        {mode === 'theory' && (
           <Card className="bg-slate-50 border-slate-200 shadow-inner max-w-4xl">
             <CardHeader title={t('Practice Theory')} icon={<FileText className="w-5 h-5 text-blue-600" />} />
             <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-slate-900 leading-tight mb-3 text-lg border-b pb-2">
                    {theoryData.dicing[language as 'en'|'ko'|'ar']?.title || theoryData.dicing.en.title}
                  </h4>
                  <div className="prose prose-sm prose-slate text-sm text-slate-700">
                    {(theoryData.dicing[language as 'en'|'ko'|'ar']?.content || theoryData.dicing.en.content).split('\n\n').map((paragraph, idx) => (
                        <p key={idx} className="leading-relaxed mb-3 break-keep">{paragraph}</p>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                 <h4 className="font-semibold text-slate-900 mb-4">{t('Key Control Variables')}</h4>
                 <div className="overflow-x-auto border border-slate-200 rounded-lg bg-white">
                   <table className="w-full text-sm text-left">
                     <thead className="bg-slate-100">
                       <tr><th className="px-4 py-3 border">{t('Variable')}</th><th className="px-4 py-3 border">{t('Effect')}</th><th className="px-4 py-3 border">{t('Risk')}</th></tr>
                     </thead>
                     <tbody>
                       <tr><td className="px-4 py-3 border font-medium">Blade RPM</td><td className="px-4 py-3 border">{t('Cutting force')}</td><td className="px-4 py-3 border">{t('Overheat / Chipping')}</td></tr>
                       <tr><td className="px-4 py-3 border font-medium">Feed Rate</td><td className="px-4 py-3 border">{t('Throughput, Load')}</td><td className="px-4 py-3 border">{t('Die Crack')}</td></tr>
                       <tr><td className="px-4 py-3 border font-medium">Coolant</td><td className="px-4 py-3 border">{t('Heat dissipation, cleaning')}</td><td className="px-4 py-3 border">{t('Blade warping')}</td></tr>
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
              <DicingVisualizer rpm={rpm} feedRate={feedRate} coolant={coolant} />
            </div>
          </div>
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Card>
              <CardHeader title={t('Process Parameters')} subtitle={t('Adjust blade and feed inputs')} />
              <CardContent className="space-y-6" >
                <SliderInput label={t('Blade RPM (RPM)')} min={20000} max={40000} value={rpm} step={100}
                  onChange={(v: number) => setDicingInputs({...dicingInputs, rpm: v})} />
                <SliderInput label={t('Feed Rate (mm/s)')} min={10} max={100} value={feedRate} step={1}
                  onChange={(v: number) => setDicingInputs({...dicingInputs, feedRate: v})} />
                <SliderInput label={t('Coolant Flow (L/min)')} min={0.5} max={3.0} value={coolant} step={0.1}
                  onChange={(v: number) => setDicingInputs({...dicingInputs, coolant: v})} />
                <SliderInput label={t('Blade Wear (%)')} min={0} max={100} value={bladeWear} step={1}
                  onChange={(v: number) => setDicingInputs({...dicingInputs, bladeWear: v})} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader title={t('Process Results')} subtitle={t('Calculated output variables')} />
              <CardContent className="space-y-6">
                <ResultRow label={t('Estimated Chipping')} value={`${chipping.toFixed(2)} μm`} status={getStatusText(chippingStatus)} rawStatus={chippingStatus} />
                <ResultRow label={t('Cutting Temperature')} value={`${temp.toFixed(1)} °C`} status={getStatusText(tempStatus)} rawStatus={tempStatus} />
                <ResultRow label={t('Die Yield Prediction')} value={`${calculatedYield.toFixed(2)} %`} status={getStatusText(processStatus)} rawStatus={processStatus === 'Pass' ? 'Good' : processStatus} />
                
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-sm font-medium text-slate-900 mb-2">{t('Process Verdict')}</h4>
                  <div className={`p-4 rounded-lg flex items-start gap-3 ${processStatus === 'Pass' ? 'bg-green-50 text-green-800' : processStatus === 'Warning' ? 'bg-amber-50 text-amber-800' : 'bg-red-50 text-red-800'}`}>
                    <Activity className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">{processStatus.toUpperCase()}</p>
                      <p className="text-sm mt-1 opacity-90">
                        {processStatus === 'Pass' ? t('Process is within optimal operating limits.') : 
                         processStatus === 'Warning' ? t('Chipping or temperature is approaching critical limits. Consider replacing blade or increasing coolant.') :
                         t('Critical failure predicted. Reduce feed rate or RPM, or increase coolant immediately.')}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>}

        {mode === 'fa' && (
          <Card className="max-w-4xl">
            <CardHeader title={t('Failure Analysis')} />
            <CardContent className="space-y-4">
              <ScenarioCard title={t('Backside Chipping')} cause={t('Excessive feed rate, dull blade')} 
                solution={t('Decrease feed rate, apply dressing to blade.')} />
              <ScenarioCard title={t('Thermomechanical Damage')} cause={t('Insufficient coolant, high RPM')} 
                solution={t('Check nozzle alignment, increase flow to >1.5 L/min.')} />
              <ScenarioCard title={t('Die Crack')} cause={t('Wafer stress, vibration')} 
                solution={t('Check tape tension and chuck table vacuum.')} />
            </CardContent>
          </Card>
        )}

        {mode === 'quiz' && <div className="max-w-4xl"><Quiz questions={dicingQuestions} /></div>}
      </div>
    </div>
  );
}

export function SliderInput({ label, min, max, value, step, onChange }: any) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <span className="text-sm font-mono text-blue-600">{value}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} 
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
    </div>
  );
}

export function ResultRow({ label, value, status, rawStatus }: any) {
  const getColors = (s: string) => {
    if(s === 'Good' || s === 'Pass') return 'text-green-700 bg-green-50 border-green-200';
    if(s === 'Warning') return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-red-700 bg-red-50 border-red-200';
  };
  const colorKey = rawStatus || status;
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
      <span className="text-slate-600 text-sm">{label}</span>
      <div className="flex items-center gap-3">
        <span className="font-mono text-slate-900 font-medium">{value}</span>
        <span className={`px-2 py-0.5 text-xs font-semibold uppercase rounded border ${getColors(colorKey)}`}>{status}</span>
      </div>
    </div>
  );
}

function ScenarioCard({title, cause, solution}: any) {
  const { t } = useTranslation();
  return (
    <div className="p-4 border border-slate-200 rounded-lg">
      <h4 className="font-semibold text-slate-900 flex items-center gap-2"><AlertCircle className="w-4 h-4 text-red-500" /> {title}</h4>
      <p className="text-sm text-slate-600 mt-2"><strong>{t('Cause')}:</strong> {cause}</p>
      <p className="text-sm text-slate-600 mt-1"><strong>{t('Action')}:</strong> {solution}</p>
    </div>
  );
}

export function DicingVisualizer({ rpm, feedRate, coolant }: { rpm: number, feedRate: number, coolant: number }) {
  const { t } = useTranslation();
  
  return (
    <Card className="bg-[#0f172a] border-slate-700 shadow-2xl relative overflow-hidden">
      <CardContent className="h-72 relative p-0 flex flex-col justify-end items-center">
        {/* Background grid for engineering look */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20 pointer-events-none"></div>

        {/* --- Labels (Positioned at edges so they don't block the visual) --- */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1 items-start">
          <div className="text-white text-[10px] bg-slate-800/80 px-2 py-1 rounded border border-slate-600 backdrop-blur-sm flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>{t('Coolant Nozzle')}
          </div>
          <div className="text-white text-[10px] bg-slate-800/80 px-2 py-1 rounded border border-slate-600 backdrop-blur-sm flex items-center gap-2 mt-2">
            <div className="w-2 h-2 rounded-full bg-slate-300"></div>{t('Diamond Blade')}
          </div>
        </div>

        <div className="absolute top-4 right-4 z-10 flex flex-col gap-1 items-end">
          <div className="text-white text-[10px] bg-slate-800/80 px-2 py-1 rounded border border-slate-600 backdrop-blur-sm flex items-center gap-2">
            {t('Silicon Wafer')} (775μm)<div className="w-2 h-2 rounded-full bg-slate-400"></div>
          </div>
          <div className="text-white text-[10px] bg-slate-800/80 px-2 py-1 rounded border border-slate-600 backdrop-blur-sm flex items-center gap-2 mt-2">
            {t('Chuck Table')}<div className="w-2 h-2 rounded-full bg-slate-700"></div>
          </div>
        </div>

        {/* --- Animated Simulator Elements --- */}
        <div className="relative w-full h-[180px] z-0 flex justify-center items-end pb-8">
          
          {/* Coolant Stream Array (Left Side) */}
          <div className="absolute left-[38%] top-[-20px] w-6 h-28 transform origin-top -rotate-[25deg] flex flex-col items-center">
            <div className="w-4 h-6 border-2 border-slate-500 bg-slate-700 rounded-sm shadow-xl z-20"></div> {/* Nozzle */}
            <div className={`w-3 h-full bg-cyan-400/50 blur-[2px] transition-opacity duration-300 ${coolant > 1.2 ? 'opacity-100' : 'opacity-20'}`}></div> {/* Water Stream */}
            {coolant > 1.2 && (
               <div className="w-16 h-8 bg-cyan-400/30 blur-[6px] rounded-full absolute bottom-[-10px] right-[-10px]"></div>
            )}
          </div>

          {/* Spindle & Blade */}
          <div className="absolute top-[-10px] left-1/2 -ml-[65px] flex flex-col items-center z-10">
            {/* Spindle head */}
            <div className="w-16 h-6 bg-gradient-to-r from-slate-600 to-slate-400 rounded-t-lg border-x-2 border-t-2 border-slate-500 shadow-2xl z-20"></div>
            {/* Blade Center Mount */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-slate-300 to-slate-100 absolute top-[14px] z-30 shadow-[0_0_10px_black] border-2 border-slate-500 flex items-center justify-center">
               <div className="w-3 h-3 bg-slate-800 rounded-full"></div>
            </div>
            {/* Blade itself */}
            <div className={`w-[130px] h-[130px] rounded-full border-[14px] border-slate-300 border-dashed absolute top-2 shadow-[0_0_20px_rgba(0,0,0,0.8)] z-10 
              ${rpm > 35000 ? 'animate-[spin_0.2s_linear_infinite]' : rpm > 25000 ? 'animate-[spin_0.4s_linear_infinite]' : 'animate-[spin_0.8s_linear_infinite]'}`}>
            </div>
          </div>

          {/* Wafer & Wafer Mount (Moving horizontally to simulate feed rate) */}
          {/* We animate this layer dragging left using keyframes based on feedrate, but we'll use an infinite sliding background trick or just keep static with chips to represent relative motion */}
          <div className="relative w-full overflow-hidden flex justify-center z-0">
             {/* Chuck Table */}
             <div className="absolute bottom-0 w-[600px] h-4 bg-gradient-to-r from-slate-800 to-slate-700 border-t-2 border-slate-600 flex justify-center items-start overflow-hidden">
                {/* Horizontal slide effect to simulate table moving */}
                <div className={`w-[200%] h-full flex bg-[linear-gradient(90deg,transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:40px_10px] 
                  ${feedRate > 50 ? 'animate-[slide_0.5s_linear_infinite]' : feedRate > 20 ? 'animate-[slide_1s_linear_infinite]' : 'animate-[slide_2s_linear_infinite]'}`}>
                </div>
             </div>
             
             {/* Wafer */}
             <div className="absolute bottom-4 w-[480px] h-3 bg-gradient-to-r from-slate-400 via-slate-300 to-slate-400 border-y border-slate-500 z-10 flex justify-center shadow-lg">
                {/* The Cut Kerf */}
                <div className="w-[4px] h-[10px] bg-slate-900 absolute top-0 shadow-inner"></div>
             </div>

             {/* Debris / Chips (Ejecting from cut point) */}
             <div className="absolute bottom-6 ml-[15px] z-20">
                <div className={`text-slate-100 text-[8px] font-bold opacity-80 ${feedRate > 50 ? 'animate-[bounce_0.2s_infinite]' : 'animate-[bounce_0.5s_infinite]'}`}>. : </div>
                <div className={`text-slate-200 text-[6px] font-bold opacity-60 ml-4 ${feedRate > 50 ? 'animate-[bounce_0.3s_infinite]' : 'animate-[bounce_0.6s_infinite]'}`}>* . </div>
             </div>
          </div>
        </div>

        {/* Dashboard parameters footer */}
        <div className="w-full bg-slate-950/80 px-4 py-2 border-t border-slate-800 flex justify-between text-[11px] font-mono text-slate-300 z-20">
           <span>{t('Blade RPM')}: <span className="text-white font-bold">{rpm}</span></span>
           <span>{t('Feed Rate')}: <span className="text-white font-bold">{feedRate} mm/s</span></span>
           <span className={coolant >= 1.5 ? "text-cyan-400 font-bold" : "text-amber-400 font-bold"}>{coolant >= 1.5 ? t('COOLANT OK') : t('COOLANT LOW')}</span>
        </div>
      </CardContent>
    </Card>
  );
}

