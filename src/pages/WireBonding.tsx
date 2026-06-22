import React, { useEffect, useState } from 'react';
import { useAppContext } from '../store';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { SliderInput, ResultRow } from './WaferDicing';
import { useTranslation } from '../i18n';
import { Disc3 } from 'lucide-react';
import { Quiz } from '../components/Quiz';
import { wireQuestions } from '../data/quizData';
import { theoryData } from '../data/theoryData';

export function WireBonding({ mode }: { mode: 'sim'|'theory'|'fa'|'quiz' }) {
  const { wireInputs, setWireInputs, setYields } = useAppContext();
  const { t, language } = useTranslation();

  const { power, temp, force, loopHeight, length } = wireInputs;

  // Calculators
  const initialBall = 25 * 2.5; // 62.5 um
  const deformation = initialBall * (1 + force / 500 * 0.3 + power / 1000);
  const defRatio = deformation / initialBall;
  
  const imcThickness = Math.max(0, (temp - 150) * 0.5 + power * 0.1);
  
  const tension = power * 0.5;
  const gravityConstant = 9.8e-3;
  const sag = (Math.pow(length, 2) * gravityConstant) / (8 * tension);
  const isValidLoop = loopHeight > sag * 1.5;

  const strength = power * 0.3 + temp * 0.2 + force * 0.4;
  
  // Calculate Yield Penalty
  let penalty = 0;
  if(defRatio < 1.2 || defRatio > 1.8) penalty += 5;
  if(imcThickness > 2) penalty += 15;
  if(!isValidLoop) penalty += 20;
  const calculatedYield = Math.max(0, 100 - penalty);

  useEffect(() => {
    setYields({ wire: calculatedYield });
  }, [calculatedYield]);

  const defStatus = defRatio >= 1.2 && defRatio <= 1.8 ? 'Good' : 'Bad';
  const imcStatus = imcThickness >= 0.1 && imcThickness <= 1.0 ? 'Good' : imcThickness > 2 ? 'Bad' : 'Warning';
  
  // Ascii loop shape
  const renderAscii = () => {
    const lines = [];
    const heightIndex = Math.floor(loopHeight / 30);
    for(let i=0; i<10; i++) {
        if (i === 10 - heightIndex) {
           lines.push("       ___------___      ");
        } else if (i > 10 - heightIndex && i < 9) {
           lines.push("      /            \\     ");
        } else if (i === 9) {
           lines.push("[PAD]O              \\___[WEDGE]");
        } else {
           lines.push("");
        }
    }
    return lines.join('\n');
  }

  const getStatusText = (s: string) => {
    if(s === 'Good' || s === 'Pass') return t('PASS');
    if(s === 'Warning') return t('WARNING');
    return t('FAIL');
  };

  return (
    <div className="flex flex-col p-6 max-w-[1600px] mx-auto h-[calc(100vh-64px)] overflow-hidden">
      <div className="mb-6 shrink-0">
        <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">{t('Wire Bonding Simulator')}</h2>
        <p className="text-slate-500 mt-1">{t('Au 25μm Wire, Thermosonic Ball-Wedge Process.')}</p>
      </div>

      <div className="flex-1 overflow-y-auto pb-8">
        {mode === 'theory' && (
           <Card className="bg-slate-50 border-slate-200 shadow-inner max-w-4xl">
             <CardHeader title={t('Practice Theory')} icon={<Disc3 className="w-5 h-5 text-blue-600" />} />
             <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-slate-900 leading-tight mb-3 text-lg border-b pb-2">
                    {theoryData.wireBonding[language as 'en'|'ko'|'ar']?.title || theoryData.wireBonding.en.title}
                  </h4>
                  <div className="prose prose-sm prose-slate text-sm text-slate-700">
                    {(theoryData.wireBonding[language as 'en'|'ko'|'ar']?.content || theoryData.wireBonding.en.content).split('\n\n').map((paragraph, idx) => (
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
                       <tr><td className="px-4 py-3 border font-medium">US Power</td><td className="px-4 py-3 border">{t('Deformation, friction heat')}</td></tr>
                       <tr><td className="px-4 py-3 border font-medium">Temp</td><td className="px-4 py-3 border">{t('Atomic diffusion, IMC')}</td></tr>
                       <tr><td className="px-4 py-3 border font-medium">Force</td><td className="px-4 py-3 border">{t('Weld area, oxide cracking')}</td></tr>
                       <tr><td className="px-4 py-3 border font-medium">Loop Height</td><td className="px-4 py-3 border">{t('Wire sway, sag risk')}</td></tr>
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
              <WireVisualizer loopHeight={loopHeight} length={length} isValidLoop={isValidLoop} />
            </div>
          </div>
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Card>
              <CardHeader title={t('Ultrasonic & Thermal Params')} />
              <CardContent className="space-y-6">
                <SliderInput label={t('US Power (mW)')} min={50} max={150} value={power} step={1}
                  onChange={(v: number) => setWireInputs({...wireInputs, power: v})} />
                <SliderInput label={t('Bonding Temp (°C)')} min={150} max={200} value={temp} step={1}
                  onChange={(v: number) => setWireInputs({...wireInputs, temp: v})} />
                <SliderInput label={t('Bonding Force (gf)')} min={20} max={80} value={force} step={1}
                  onChange={(v: number) => setWireInputs({...wireInputs, force: v})} />
                <SliderInput label={t('Loop Height (μm)')} min={100} max={300} value={loopHeight} step={5}
                  onChange={(v: number) => setWireInputs({...wireInputs, loopHeight: v})} />
                <SliderInput label={t('Wire Length (μm)')} min={500} max={3000} value={length} step={50}
                  onChange={(v: number) => setWireInputs({...wireInputs, length: v})} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader title={t('Intermetallic & Mechanical')} />
              <CardContent className="space-y-6">
                <ResultRow label={t('Squashed Ball Diameter')} value={`${deformation.toFixed(1)} μm (${defRatio.toFixed(2)}x)`} status={getStatusText(defStatus)} rawStatus={defStatus} />
                <ResultRow label={t('IMC Growth Zone')} value={`${imcThickness.toFixed(2)} nm`} status={getStatusText(imcStatus)} rawStatus={imcStatus} />
                <ResultRow label={t('Loop Sag Risk')} value={`${sag.toFixed(1)} μm`} status={getStatusText(isValidLoop ? 'Good' : 'Bad')} rawStatus={isValidLoop ? 'Good' : 'Bad'} />
                <ResultRow label={t('Ball Shear Strength')} value={`${strength.toFixed(1)} gf`} status={getStatusText(strength >= 30 ? 'Good' : 'Warning')} rawStatus={strength >= 30 ? 'Good' : 'Warning'} />
                
                <div className="mt-4 p-4 bg-slate-100 rounded-lg flex justify-between items-center">
                  <span className="font-medium text-slate-700">{t('Rolling WB Yield')}</span>
                  <span className={`text-xl font-mono font-bold ${calculatedYield > 95 ? 'text-green-600' : 'text-amber-600'}`}>
                    {calculatedYield.toFixed(2)} %
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>}

        {mode === 'fa' && (
          <Card className="max-w-4xl">
            <CardHeader title={t('Failure Analysis Logs')} />
            <CardContent className="space-y-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <h4 className="font-mono font-bold text-slate-800">{t('CASE #WB-001: Kirkendall Voiding')}</h4>
              <p className="text-sm mt-2"><strong>{t('Symptom')}:</strong> {t('Wire lifting after high-temp storage testing.')}<br/>
              <strong>{t('Mechanism')}:</strong> {t('Over-temperature during bonding (>200C) accelerates Au-Al intermetallic diffusion, creating vacancies (voids) at the interface.')}<br/>
              <strong>{t('Fix')}:</strong> {t('Lower block temp, ensure clean Al pad.')}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {mode === 'quiz' && <div className="max-w-4xl"><Quiz questions={wireQuestions} /></div>}
      </div>
    </div>
  );
}

function WireVisualizer({ loopHeight, length, isValidLoop }: { loopHeight: number, length: number, isValidLoop: boolean }) {
  const { t, language } = useTranslation();
  const isRtl = language === 'ar';
  
  return (
    <Card className="bg-[#0f172a] border-slate-700 shadow-2xl relative overflow-hidden">
      <CardContent className="h-72 relative flex items-center justify-center p-0 flex-col">
         {/* Engineering Background Grid */}
         <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20 pointer-events-none"></div>

         {/* --- Labels (Positioned at edges) --- */}
         <div className="absolute top-4 left-4 z-10 flex flex-col gap-1 items-start">
            <div className="text-white text-[10px] bg-slate-800/80 px-2 py-1 rounded border border-slate-600 backdrop-blur-sm flex items-center gap-2">
               <div className="w-2 h-2 rounded-sm bg-slate-300"></div>{t('Ceramic Capillary')}
            </div>
            <div className="text-[10px] text-yellow-200 bg-slate-800/80 px-2 py-1 rounded border border-yellow-700/50 backdrop-blur-sm flex items-center gap-2 mt-2">
               <div className="w-2 h-2 rounded-full bg-yellow-400"></div>{t('Gold Wire (25μm)')}
            </div>
         </div>

         <div className="absolute top-4 right-4 z-10 flex flex-col gap-1 items-end">
            <div className="text-[10px] text-blue-200 bg-slate-800/80 px-2 py-1 rounded border border-blue-700/50 backdrop-blur-sm flex items-center gap-2">
               {t('Al Pad (FAB)')}<div className="w-2 h-2 rounded-sm bg-sky-300"></div>
            </div>
            <div className="text-[10px] text-amber-200 bg-slate-800/80 px-2 py-1 rounded border border-amber-700/50 backdrop-blur-sm flex items-center gap-2 mt-2">
               {t('Stitch Wedge Bond')}<div className="w-4 h-1 rounded-sm bg-yellow-500"></div>
            </div>
         </div>

         {/* Visual Loop structure using SVG */}
         <div className="absolute inset-x-0 bottom-[60px] flex justify-center z-10 w-full">
            {/* Pad Area (Silicon Die side) */}
            <div className="w-32 h-6 bg-gradient-to-b from-slate-400 to-slate-500 absolute bottom-0 -ml-[220px] flex justify-end flex-col items-center rounded-sm border-t border-slate-300 shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
              {/* Aluminum Pad */}
              <div className="w-16 h-3 bg-gradient-to-r from-sky-200 to-sky-400 absolute top-0 shadow-inner"></div>
              {/* Squash Ball (FAB) */}
              <div className="w-10 h-4 rounded-t-[20px] bg-gradient-to-b from-yellow-300 to-yellow-500 absolute -top-[16px] shadow-[0_0_15px_rgba(250,204,21,0.6)] flex items-end justify-center"></div>
            </div>

            {/* Leadframe Area (Substrate side) */}
            <div className="w-48 h-6 bg-gradient-to-b from-amber-700 to-amber-900 absolute bottom-0 ml-[180px] rounded-sm shadow-[0_10px_20px_rgba(0,0,0,0.5)] border-t border-amber-500">
              {/* Plating Area */}
              <div className="w-24 h-2 bg-gradient-to-r from-yellow-600 to-yellow-800 absolute top-0 left-4 shadow-inner"></div>
              {/* Wedge Tail */}
              <div className="w-14 h-2 bg-yellow-400 absolute left-8 -top-2 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)] transform -rotate-[10deg] origin-right"></div>
            </div>

            {/* SVG Wire Path */}
            <svg className="absolute w-[600px] h-[300px] bottom-[2px] left-1/2 -ml-[300px] pointer-events-none overflow-visible z-20">
               {/* Loop representation using Quadratic/Cubic Beziers */}
               <path 
                 d={`M 220 280 C 220 ${280 - loopHeight/1.1} 310 ${280 - loopHeight/1.2} ${375 + length/15} 295`} 
                 fill="none" 
                 stroke="url(#goldGradient)" 
                 strokeWidth="4" 
                 strokeLinecap="round"
                 filter="drop-shadow(0px 8px 6px rgba(0,0,0,0.6))"
                 className={`${!isValidLoop ? 'opacity-30' : ''}`}
               />
               {!isValidLoop && (
                 <path 
                   d={`M 220 280 Q 295 320 ${375 + length/15} 295`} 
                   fill="none" 
                   stroke="#ef4444" 
                   strokeWidth="3"
                   strokeDasharray="4 4" 
                 />
               )}
               <defs>
                 <linearGradient id="goldGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                   <stop offset="0%" stopColor="#fbbf24" />
                   <stop offset="30%" stopColor="#fef08a" />
                   <stop offset="70%" stopColor="#eab308" />
                   <stop offset="100%" stopColor="#b45309" />
                 </linearGradient>
               </defs>
            </svg>
         </div>

         {/* Capillary Tool Indicator hovering/animating */}
         <div className="absolute bottom-[200px] ml-[240px] z-30 flex flex-col items-center opacity-80 pointer-events-none">
            <div className="w-8 h-20 bg-gradient-to-b from-slate-200 to-slate-400 rounded-b opacity-40"></div>
         </div>

         {/* Dashboard parameters */}
         <div className={`absolute w-full bottom-0 ${isRtl ? 'right-4 left-4' : 'left-0 right-0'} flex justify-between text-[11px] font-mono text-slate-300 bg-slate-950/80 px-4 py-2 border-t border-slate-800 z-40`}>
            <span>{t('Height constraint')}: <span className="text-white font-bold">{loopHeight}μm</span></span>
            <span>{t('Length')}: <span className="text-white font-bold">{length}μm</span></span>
            <span className={isValidLoop ? "text-green-400 font-bold" : "text-red-400 font-bold"}>
              {isValidLoop ? t('PASS') : t('SAG FAIL')}
            </span>
         </div>
      </CardContent>
    </Card>
  );
}
