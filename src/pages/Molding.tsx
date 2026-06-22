import React, { useEffect, useState } from 'react';
import { useAppContext } from '../store';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { SliderInput, ResultRow } from './WaferDicing';
import { useTranslation } from '../i18n';
import { Layers } from 'lucide-react';
import { Quiz } from '../components/Quiz';
import { moldingQuestions } from '../data/quizData';
import { theoryData } from '../data/theoryData';

export function Molding({ mode }: { mode: 'sim'|'theory'|'fa'|'quiz' }) {
  const { moldingInputs, setMoldingInputs, setYields } = useAppContext();
  const { t, language } = useTranslation();

  const { transferPressure, moldTemp, cureTime, clampForce, preheat } = moldingInputs;

  // Calculators
  const viscosity = 50 * Math.exp(3000 / (moldTemp + 273)) * Math.exp(-preheat / 100);
  const cavityVolume = 14 * 20 * 2.7 * 4; // 4 cavities
  const gateArea = 2.0; 
  const fillTime = (viscosity * cavityVolume) / (transferPressure * 1e6 * gateArea) * 10; // Normalized for display scaling

  // Void risk
  const voidRisk = Math.max(0, 100 - transferPressure * 5 - (moldTemp - 165) * 2 + fillTime * 3);
  
  // Cure 
  const cureDegree = Math.min(100, (moldTemp - 160) * cureTime * 0.01);
  
  // Stress
  const deltaT = moldTemp - 25;
  const residualStress = (15000 * 12e-6 * deltaT) / (1 - 0.3);

  // Flash
  const projArea = 14 * 20 * 4; // 1120 mm2
  const cavityPressure = transferPressure * 0.6; // MPa
  const isFlash = (clampForce * 1000) < (cavityPressure * projArea); // clamp is kN, convert to N

  let penalty = 0;
  if(voidRisk > 20) penalty += 10;
  if(cureDegree < 85) penalty += 5;
  if(isFlash) penalty += 8;
  const calculatedYield = Math.max(0, 100 - penalty);

  useEffect(() => {
    setYields({ molding: calculatedYield });
  }, [calculatedYield]);

  const getStatusText = (s: string) => {
    if(s === 'Good' || s === 'Pass') return t('PASS');
    if(s === 'Warning') return t('WARNING');
    return t('FAIL');
  };

  return (
    <div className="flex flex-col p-6 max-w-[1600px] mx-auto h-[calc(100vh-64px)] overflow-hidden">
      <div className="mb-6 shrink-0">
        <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">{t('Transfer Molding')}</h2>
        <p className="text-slate-500 mt-1">{t('EMC encapsulation process (Silica 85wt%, 4-cavity QFP).')}</p>
      </div>

      <div className="flex-1 overflow-y-auto pb-8">
        {mode === 'theory' && (
           <Card className="bg-slate-50 border-slate-200 shadow-inner max-w-4xl">
             <CardHeader title={t('Practice Theory')} icon={<Layers className="w-5 h-5 text-blue-600" />} />
             <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-slate-900 leading-tight mb-3 text-lg border-b pb-2">
                    {theoryData.molding[language as 'en'|'ko'|'ar']?.title || theoryData.molding.en.title}
                  </h4>
                  <div className="prose prose-sm prose-slate text-sm text-slate-700">
                    {(theoryData.molding[language as 'en'|'ko'|'ar']?.content || theoryData.molding.en.content).split('\n\n').map((paragraph, idx) => (
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
                       <tr><td className="px-4 py-3 border font-medium">Transfer Pressure</td><td className="px-4 py-3 border">{t('Fill completion')}</td></tr>
                       <tr><td className="px-4 py-3 border font-medium">Mold Temp</td><td className="px-4 py-3 border">{t('Viscosity, Cure speed')}</td></tr>
                       <tr><td className="px-4 py-3 border font-medium">Cure Time</td><td className="px-4 py-3 border">{t('Cure Degree')}</td></tr>
                       <tr><td className="px-4 py-3 border font-medium">Clamping Force</td><td className="px-4 py-3 border">{t('Flash prevention')}</td></tr>
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
              <MoldingVisualizer transferPressure={transferPressure} cureDegree={cureDegree} />
            </div>
          </div>
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Card>
              <CardHeader title={t('Mold Parameters')} />
              <CardContent className="space-y-6">
                <SliderInput label={t('Transfer Pressure (MPa)')} min={5} max={15} value={transferPressure} step={0.5}
                  onChange={(v: number) => setMoldingInputs({...moldingInputs, transferPressure: v})} />
                 <SliderInput label={t('Mold Temp (°C)')} min={165} max={185} value={moldTemp} step={1}
                  onChange={(v: number) => setMoldingInputs({...moldingInputs, moldTemp: v})} />
                 <SliderInput label={t('Pre-heat Temp (°C)')} min={70} max={100} value={preheat} step={1}
                  onChange={(v: number) => setMoldingInputs({...moldingInputs, preheat: v})} />
                <SliderInput label={t('Cure Time (sec)')} min={60} max={180} value={cureTime} step={5}
                  onChange={(v: number) => setMoldingInputs({...moldingInputs, cureTime: v})} />
                 <SliderInput label={t('Clamping Force (kN)')} min={50} max={200} value={clampForce} step={10}
                  onChange={(v: number) => setMoldingInputs({...moldingInputs, clampForce: v})} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader title={t('Rheology & Thermomechanics')} />
              <CardContent className="space-y-6">
                <ResultRow label={t('Fill Time')} value={`${fillTime.toFixed(1)} sec`} status={getStatusText(fillTime >= 5 && fillTime <= 15 ? 'Good' : 'Warning')} rawStatus={fillTime >= 5 && fillTime <= 15 ? 'Good' : 'Warning'} />
                <ResultRow label={t('Void Trapping Risk')} value={`${voidRisk.toFixed(1)} %`} status={getStatusText(voidRisk < 20 ? 'Good' : 'Bad')} rawStatus={voidRisk < 20 ? 'Good' : 'Bad'} />
                <ResultRow label={t('Resin Cure Degree')} value={`${cureDegree.toFixed(1)} %`} status={getStatusText(cureDegree >= 85 ? 'Good' : 'Bad')} rawStatus={cureDegree >= 85 ? 'Good' : 'Bad'} />
                <ResultRow label={t('Internal Residual Stress')} value={`${residualStress.toFixed(1)} MPa`} status={getStatusText('Good')} rawStatus={'Good'} />
                <ResultRow label={t('Mold Flash Warning')} value={isFlash ? t('FLASH OCCURRED') : t('SAFE')} status={getStatusText(isFlash ? 'Bad' : 'Good')} rawStatus={isFlash ? 'Bad' : 'Good'} />
                
                <div className="mt-4 p-4 bg-slate-100 rounded-lg flex justify-between items-center">
                  <span className="font-medium text-slate-700">{t('Molding Yield')}</span>
                  <span className={`text-xl font-mono font-bold ${calculatedYield > 95 ? 'text-green-600' : 'text-red-600'}`}>
                    {calculatedYield.toFixed(2)} %
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>}

        {mode === 'fa' && (
          <Card className="max-w-4xl">
            <CardHeader title={t('Failure Analysis & DOE')} />
            <CardContent className="space-y-6">
            <p className="text-sm text-slate-600">{t('Recommended optimization matrix for avoiding Voids & Flash simultaneously:')}</p>
            <table className="w-full text-sm text-left border">
              <thead className="bg-slate-50">
                <tr><th className="px-4 py-2 border">{t('Run')}</th><th className="px-4 py-2 border">{t('Mold Temp')}</th><th className="px-4 py-2 border">{t('Transfer Press')}</th><th className="px-4 py-2 border">{t('Prediction')}</th></tr>
              </thead>
              <tbody>
                <tr><td className="px-4 py-2 border">1</td><td className="px-4 py-2 border">165°C</td><td className="px-4 py-2 border">5 MPa</td><td className="px-4 py-2 border text-red-600">{t('High Void')}</td></tr>
                <tr><td className="px-4 py-2 border">2</td><td className="px-4 py-2 border">175°C</td><td className="px-4 py-2 border">10 MPa</td><td className="px-4 py-2 border text-green-600">{t('Optimal')}</td></tr>
                <tr><td className="px-4 py-2 border">3</td><td className="px-4 py-2 border">185°C</td><td className="px-4 py-2 border">15 MPa</td><td className="px-4 py-2 border text-red-600">{t('High Flash')}</td></tr>
              </tbody>
            </table>
          </CardContent>
         </Card>
      )}

      {mode === 'quiz' && <div className="max-w-4xl"><Quiz questions={moldingQuestions} /></div>}
      </div>
    </div>
  );
}

function MoldingVisualizer({ transferPressure, cureDegree }: { transferPressure: number, cureDegree: number }) {
  const { t } = useTranslation();
  const fillWidth = Math.min(100, transferPressure * 10);
  
  return (
    <Card className="bg-[#0f172a] border-slate-700 shadow-2xl relative overflow-hidden">
      <CardContent className="h-72 relative flex items-center justify-center p-0 flex-col">
         {/* Engineering Background Grid */}
         <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20 pointer-events-none"></div>

         {/* --- Labels (Positioned at edges with pointers contextually) --- */}
         <div className="absolute top-2 left-6 z-20 flex flex-col gap-1 items-start">
            <div className="text-white text-[10px] bg-slate-800/80 px-2 py-1 rounded border border-slate-600 backdrop-blur-sm flex items-center gap-2">
               <div className="w-2 h-2 rounded-sm bg-slate-400"></div>{t('Steel Mold Chase')}
            </div>
         </div>

         <div className="absolute top-2 right-6 z-20 flex flex-col gap-1 items-end">
            <div className="text-[10px] text-amber-200 bg-slate-800/80 px-2 py-1 rounded border border-amber-700/50 backdrop-blur-sm flex items-center gap-2">
               {t('EMC Flow Front')}<div className="w-2 h-2 rounded-full bg-slate-700 animate-pulse"></div>
            </div>
         </div>


         {/* --- Central Mold Component --- */}
         <div className="relative w-[400px] h-[160px] z-10 flex flex-col items-center justify-center mt-4">
            
            {/* Top Mold Half */}
            <div className="absolute top-0 w-full h-10 bg-gradient-to-b from-slate-600 to-slate-700 border-x-2 border-t-2 border-slate-500 rounded-t-lg z-20 shadow-[0_10px_20px_rgba(0,0,0,0.5)]"></div>

            {/* Cavity & Flow Overlay (Between molds) */}
            <div className="absolute w-[360px] h-[60px] border border-slate-500 flex overflow-hidden bg-slate-800/80 top-10 z-30 shadow-inner">
               
               {/* Leadframe inside Cavity */}
               <div className="absolute w-full h-1 bg-gradient-to-r from-amber-700 to-amber-900 bottom-2"></div>
               {/* Die on Leadframe */}
               <div className="absolute w-24 h-6 bg-gradient-to-b from-slate-400 to-slate-500 bottom-3 right-20 rounded-sm border border-slate-600 shadow-md"></div>
               
               {/* Gold Wires */}
               <svg className="absolute w-full h-full bottom-3 z-10">
                 <path d="M 230 40 C 230 10 280 15 285 45" fill="none" stroke="gold" strokeWidth="1.5" filter="drop-shadow(0px 2px 2px rgba(0,0,0,0.8))" />
                 <path d="M 240 40 C 240 5 295 10 300 45" fill="none" stroke="gold" strokeWidth="1.5" filter="drop-shadow(0px 2px 2px rgba(0,0,0,0.8))" />
               </svg>

               {/* Black Epoxy Molding Compound Flow */}
               <div className="absolute h-full z-20 transition-all duration-700 ease-out flex items-center justify-end" 
                    style={{ 
                         width: `${fillWidth}%`, 
                         background: `linear-gradient(to right, #1e293b, #0f172a, #020617)`,
                         borderRight: '1px solid #334155'
                    }}>
                  <div className="w-12 h-full bg-slate-600 blur-xl mix-blend-screen opacity-20"></div>
                  {/* Flow front turbulence */}
                  <div className="absolute right-0 h-full w-4 bg-slate-800 animate-pulse mix-blend-overlay"></div>
               </div>
            </div>

            {/* Bottom Mold Half */}
            <div className="absolute bottom-6 w-full h-10 bg-gradient-to-t from-slate-600 to-slate-700 border-x-2 border-b-2 border-slate-500 rounded-b-lg z-20 shadow-[0_-10px_20px_rgba(0,0,0,0.5)]"></div>
            
            {/* Plunger/Gate area (Left connecting) */}
            <div className="absolute left-[-20px] top-[40px] w-8 h-[60px] bg-gradient-to-r from-slate-500 to-slate-700 border-y-2 border-l-2 border-slate-400 rounded-l-md z-10 shadow-xl overflow-hidden">
               {/* Piston pushing */}
               <div className="absolute w-full h-full bg-slate-800 transition-transform duration-700 ease-out border-r-2 border-slate-400"
                    style={{ transform: `translateX(${-100 + fillWidth}%)` }}></div>
            </div>
         </div>


         {/* Dashboard parameters */}
         <div className={`absolute w-full bottom-0 left-0 right-0 flex justify-between text-[11px] font-mono text-slate-300 bg-slate-950/80 px-4 py-2 border-t border-slate-800 z-40`}>
            <span>{t('Transfer Pressure')}: <span className="text-white font-bold">{transferPressure} MPa</span></span>
            <span>{t('Fill status')}: <span className="text-white font-bold">{fillWidth.toFixed(0)}%</span></span>
            <span className={cureDegree > 80 ? "text-green-400 font-bold" : "text-amber-400 font-bold"}>
              {cureDegree > 80 ? t('CURED') : `${cureDegree.toFixed(0)}% CURE`}
            </span>
         </div>
      </CardContent>
    </Card>
  );
}
