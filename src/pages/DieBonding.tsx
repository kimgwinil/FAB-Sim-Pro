import React, { useEffect, useState } from 'react';
import { useAppContext } from '../store';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { SliderInput, ResultRow } from './WaferDicing';
import { ShieldAlert, ArrowDown } from 'lucide-react';
import { useTranslation } from '../i18n';
import { Quiz } from '../components/Quiz';
import { bondingQuestions } from '../data/quizData';
import { theoryData } from '../data/theoryData';

export function DieBonding({ mode }: { mode: 'sim'|'theory'|'fa'|'quiz' }) {
  const { bondingInputs, setBondingInputs, setYields } = useAppContext();
  const { t, language } = useTranslation();

  const { dispense, temp, time, pressure } = bondingInputs;

  // Calculators
  const dieArea = 100; // 10x10 mm
  const pressureCorrection = (pressure / 25) * 0.8;
  const thickness = (dispense * 1000) / (dieArea * pressureCorrection);
  
  const voidRate = Math.max(0, 15 - (pressure * 0.2) - (temp - 150) * 0.1);
  const cureDegree = Math.min(100, (temp - 140) * time * 0.05);
  
  const rTh = thickness / (3 * dieArea); // Thermal cond = 3 W/mK
  const shearStrength = (cureDegree / 100) * 2 * dieArea;

  const yieldPenaltyVoide = voidRate > 10 ? 15 : voidRate > 5 ? 5 : 0;
  const yieldPenaltyCure = cureDegree < 80 ? 10 : cureDegree < 95 ? 2 : 0;
  const yieldPenaltyThickness = (thickness < 10 || thickness > 30) ? 5 : 0;
  
  const calculatedYield = Math.max(0, 100 - yieldPenaltyVoide - yieldPenaltyCure - yieldPenaltyThickness);

  // Status bounds
  const thicknessStatus = thickness >= 10 && thickness <= 30 ? 'Good' : 'Warning';
  const voidStatus = voidRate < 5 ? 'Good' : voidRate <= 10 ? 'Warning' : 'Bad';
  const cureStatus = cureDegree >= 95 ? 'Good' : cureDegree >= 80 ? 'Warning' : 'Bad';

  useEffect(() => {
    setYields({ bonding: calculatedYield });
  }, [calculatedYield]);

  const getStatusText = (s: string) => {
    if(s === 'Good' || s === 'Pass') return t('PASS');
    if(s === 'Warning') return t('WARNING');
    return t('FAIL');
  };

  return (
    <div className="flex flex-col p-6 max-w-[1600px] mx-auto h-[calc(100vh-64px)] overflow-hidden">
      <div className="mb-6 shrink-0">
        <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">{t('Die Bonding Simulator')}</h2>
        <p className="text-slate-500 mt-1">{t('Epoxy paste attach, 10x10mm die on Alloy 42 Leadframe.')}</p>
      </div>

      <div className="flex-1 overflow-y-auto pb-8">
        {mode === 'theory' && (
           <Card className="bg-slate-50 border-slate-200 shadow-inner max-w-4xl">
             <CardHeader title={t('Practice Theory')} icon={<ShieldAlert className="w-5 h-5 text-blue-600" />} />
             <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-slate-900 leading-tight mb-3 text-lg border-b pb-2">
                    {theoryData.dieBonding[language as 'en'|'ko'|'ar']?.title || theoryData.dieBonding.en.title}
                  </h4>
                  <div className="prose prose-sm prose-slate text-sm text-slate-700">
                    {(theoryData.dieBonding[language as 'en'|'ko'|'ar']?.content || theoryData.dieBonding.en.content).split('\n\n').map((paragraph, idx) => (
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
                       <tr><td className="px-4 py-3 border font-medium">Dispense Amt</td><td className="px-4 py-3 border">{t('Voids, fillet shape')}</td></tr>
                       <tr><td className="px-4 py-3 border font-medium">Cure Temp</td><td className="px-4 py-3 border">{t('Cure degree, stress')}</td></tr>
                       <tr><td className="px-4 py-3 border font-medium">Cure Time</td><td className="px-4 py-3 border">{t('Adhesion strength')}</td></tr>
                       <tr><td className="px-4 py-3 border font-medium">Bond Pressure</td><td className="px-4 py-3 border">{t('Adhesion thickness')}</td></tr>
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
              <BondingVisualizer dispense={dispense} time={time} pressure={pressure} />
            </div>
          </div>
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Card>
              <CardHeader title={t('Bonding Parameters')} />
              <CardContent className="space-y-6">
                <SliderInput label={t('Epoxy Dispense (mg)')} min={0.1} max={0.5} value={dispense} step={0.01}
                  onChange={(v: number) => setBondingInputs({...bondingInputs, dispense: v})} />
                <SliderInput label={t('Cure Temp (°C)')} min={150} max={200} value={temp} step={1}
                  onChange={(v: number) => setBondingInputs({...bondingInputs, temp: v})} />
                <SliderInput label={t('Cure Time (min)')} min={30} max={120} value={time} step={1}
                  onChange={(v: number) => setBondingInputs({...bondingInputs, time: v})} />
                <SliderInput label={t('Bonding Pressure (gf)')} min={10} max={50} value={pressure} step={1}
                  onChange={(v: number) => setBondingInputs({...bondingInputs, pressure: v})} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader title={t('Output Analytics')} />
              <CardContent className="space-y-6">
                <ResultRow label={t('Adhesion Thickness (opt: 10-30μm)')} value={`${thickness.toFixed(1)} μm`} status={getStatusText(thicknessStatus)} rawStatus={thicknessStatus} />
                <ResultRow label={t('Expected Void Rate')} value={`${voidRate.toFixed(1)} %`} status={getStatusText(voidStatus)} rawStatus={voidStatus} />
                <ResultRow label={t('Epoxy Cure Degree')} value={`${cureDegree.toFixed(1)} %`} status={getStatusText(cureStatus)} rawStatus={cureStatus} />
                <ResultRow label={t('Thermal Resistance (R_th)')} value={`${rTh.toFixed(3)} °C/W`} status={getStatusText('Good')} rawStatus="Good" />
                <ResultRow label={t('Shear Strength')} value={`${shearStrength.toFixed(0)} gf`} status={getStatusText(shearStrength > 100 ? 'Good' : 'Warning')} rawStatus={shearStrength > 100 ? 'Good' : 'Warning'} />
                
                <div className="mt-4 p-4 bg-slate-100 rounded-lg flex justify-between items-center">
                  <span className="font-medium text-slate-700">{t('Calculated Yield')}</span>
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
            <CardHeader title={t('Failure Analysis')} />
            <CardContent className="space-y-6">

            <DefectCard mode={t('Void / Bubbles')}
              cause={t('Moisture absorption, improper dispense pattern.')}
              mech={t('Air entrapped during die placement expands during cure.')}
              detect={t('SAM (Scanning Acoustic Microscopy), X-ray.')}
              cm={t('Use asterisk/shower pattern, control ambient humidity.')} />
            <DefectCard mode={t('Incomplete Cure')}
              cause={t('Low oven temp, short duration, expired epoxy.')}
              mech={t('Cross-linking chains fail to form fully (Arrhenius failure).')}
              detect={t('DSC (Differential Scanning Calorimetry).')}
              cm={t('Calibrate oven profiles, implement FIFO material control.')} />
          </CardContent>
        </Card>
      )}

      {mode === 'quiz' && <Quiz questions={bondingQuestions} />}
      </div>
    </div>
  );
}

function BondingVisualizer({ dispense, time, pressure }: { dispense: number, time: number, pressure: number }) {
  const { t } = useTranslation();
  return (
    <Card className="bg-[#0f172a] border-slate-700 shadow-2xl relative overflow-hidden">
      <CardContent className="h-72 relative flex items-center justify-center p-0 flex-col">
        {/* Engineering Background Grid */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20 pointer-events-none"></div>

        {/* --- Labels (Positioned at edges) --- */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1 items-start">
          <div className="text-white text-[10px] bg-slate-800/80 px-2 py-1 rounded border border-slate-600 backdrop-blur-sm flex items-center gap-2">
            <div className="w-2 h-2 rounded-sm bg-slate-400"></div>{t('Pick & Place Collet')}
          </div>
          <div className="text-white text-[10px] bg-slate-800/80 px-2 py-1 rounded border border-slate-600 backdrop-blur-sm flex items-center gap-2 mt-2">
            <div className="w-2 h-2 rounded-sm bg-slate-200"></div>{t('Silicon Die')}
          </div>
        </div>

        <div className="absolute top-4 right-4 z-10 flex flex-col gap-1 items-end">
          <div className="text-[10px] bg-slate-800/80 px-2 py-1 rounded border border-red-500/50 backdrop-blur-sm flex items-center gap-2 text-red-200">
            {t('Conductive Epoxy')}<div className="w-2 h-2 rounded-full bg-red-600 shadow-[0_0_5px_red]"></div>
          </div>
          <div className="text-[10px] text-amber-200 bg-slate-800/80 px-2 py-1 rounded border border-amber-600/50 backdrop-blur-sm flex items-center gap-2 mt-2">
            {t('Leadframe (Alloy 42)')}<div className="w-2 h-2 rounded-sm bg-amber-700"></div>
          </div>
        </div>

        {/* --- Animated Simulator Elements --- */}
        
        {/* Heat Effect from Oven */}
        <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-orange-600 to-transparent z-0 transition-opacity duration-700 pointer-events-none mix-blend-screen" style={{ opacity: time / 200 }}></div>

        {/* Leadframe Base Layout */}
        <div className="absolute bottom-[40px] w-full flex justify-center z-10">
           {/* Leadframe Segment */}
           <div className="w-72 h-4 bg-gradient-to-b from-amber-600 to-amber-800 shadow-lg border-y border-amber-900 rounded-sm relative flex justify-center">
             
             {/* Epoxy Dispense Dot (expands based on dispense amt and pressure) */}
             <div className="absolute bottom-full bg-red-600/90 rounded-t-full transition-all duration-300 z-10 shadow-[0_0_15px_rgba(220,38,38,0.7)]" 
               style={{ 
                 width: `${dispense * 150 + pressure * 1.5}px`, 
                 height: `${dispense * 40 - (pressure / 2) + 5}px`, 
                 marginBottom: '-1px' 
               }}>
             </div>

             {/* Heating Elements (glowing wires below Leadframe) */}
             <div className="absolute top-full w-48 h-2 flex justify-around mt-2 opacity-60">
                 <div className="w-6 h-1 rounded bg-orange-500 animate-pulse shadow-[0_0_8px_rgba(249,115,22,1)]"></div>
                 <div className="w-6 h-1 rounded bg-orange-500 animate-pulse shadow-[0_0_8px_rgba(249,115,22,1)]" style={{animationDelay: '200ms'}}></div>
                 <div className="w-6 h-1 rounded bg-orange-500 animate-pulse shadow-[0_0_8px_rgba(249,115,22,1)]" style={{animationDelay: '400ms'}}></div>
             </div>

           </div>
        </div>

        {/* Pick & Place Collet hovering above or pressing down */}
        <div className="absolute bottom-[44px] flex flex-col items-center z-20 transition-transform duration-[2000ms] ease-in-out" style={{ transform: `translateY(-${Math.max(0, 100 - pressure * 2)}px)` }}>
          {/* Suction Collet Tool */}
          <div className="w-12 h-20 bg-gradient-to-b from-slate-600 to-slate-400 rounded-b-sm border-x border-b border-slate-700 flex justify-center items-end pb-1 shadow-2xl relative">
             {/* Vacuum Channel Indication */}
             <div className="w-2 h-full bg-slate-800 absolute opacity-30 shadow-inner"></div>
             <ArrowDown className={`text-white w-5 h-5 absolute -left-6 bottom-4 opacity-80 block ${pressure < 30 ? 'animate-bounce' : 'opacity-0'}`} />
          </div>
          {/* Silicon Die */}
          <div className="w-32 h-3 bg-gradient-to-b from-slate-200 to-slate-400 shadow-2xl border border-slate-600"></div>
        </div>

        {/* Dashboard parameters footer */}
        <div className="w-full absolute bottom-0 bg-slate-950/80 px-4 py-2 border-t border-slate-800 flex justify-between text-[11px] font-mono text-slate-300 z-30">
           <span>{t('Epoxy Vol')}: <span className="text-white font-bold">{(dispense*100).toFixed(0)} μL</span></span>
           <span>{t('Applied Pressure')}: <span className="text-white font-bold">{pressure} gf</span></span>
           <span>{t('Curing Status')}: <span className="text-amber-400 font-bold">{((time/120)*100).toFixed(0)}%</span></span>
        </div>
      </CardContent>
    </Card>
  );
}

function DefectCard({mode, cause, mech, detect, cm}: any) {
  const { t } = useTranslation();
  return (
    <div className="border border-slate-200 rounded-lg p-4">
      <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-3"><ShieldAlert className="w-4 h-4 text-orange-500" /> {mode}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="bg-slate-50 p-3 rounded"><strong>{t('Cause')}:</strong> <span className="text-slate-600">{cause}</span></div>
        <div className="bg-slate-50 p-3 rounded"><strong>{t('Mechanism')}:</strong> <span className="text-slate-600">{mech}</span></div>
        <div className="bg-slate-50 p-3 rounded"><strong>{t('Detection')}:</strong> <span className="text-slate-600">{detect}</span></div>
        <div className="bg-slate-50 p-3 rounded"><strong>{t('Countermeasure')}:</strong> <span className="text-slate-600">{cm}</span></div>
      </div>
    </div>
  );
}
