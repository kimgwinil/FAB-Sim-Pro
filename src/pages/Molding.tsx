import React, { useEffect, useState } from 'react';
import { useAppContext } from '../store';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { SliderInput, ResultRow } from './WaferDicing';
import { useTranslation } from '../i18n';
import { Layers } from 'lucide-react';
import { Quiz } from '../components/Quiz';
import { moldingQuestions } from '../data/quizData';
import { getTheoryChapter } from '../data/theoryData';
import { TheoryView } from '../components/TheoryView';
import { Callout } from '../components/SvgCallout';

export function Molding({ mode }: { mode: 'sim'|'theory'|'fa'|'quiz' }) {
  const { moldingInputs, setMoldingInputs, setYields } = useAppContext();
  const { t, language } = useTranslation();

  const { transferPressure, moldTemp, cureTime, clampForce, preheat } = moldingInputs;
  const theory = getTheoryChapter('molding', language);

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
             <CardContent>
                <TheoryView title={theory.title} content={theory.content} />
             </CardContent>
           </Card>
        )}

        {mode === 'sim' && <div className="flex flex-col gap-4">
          <div className="mx-auto w-full max-w-[760px]">
            <MoldingVisualizer transferPressure={transferPressure} cureDegree={cureDegree} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
  const flowX = 230 + fillWidth * 3.0;
  
  return (
    <Card className="bg-[#0f172a] border-slate-700 shadow-2xl relative overflow-hidden">
      <CardContent className="p-0">
         <svg viewBox="0 0 760 300" className="w-full block select-none" style={{ aspectRatio: '760 / 300' }}>
           <defs>
             <pattern id="mold-grid" width="20" height="20" patternUnits="userSpaceOnUse">
               <path d="M20 0H0V20" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
             </pattern>
             <linearGradient id="mold-steel" x1="0" x2="0" y1="0" y2="1">
               <stop offset="0%" stopColor="#94a3b8" />
               <stop offset="100%" stopColor="#334155" />
             </linearGradient>
             <linearGradient id="emc-flow" x1="0" x2="1" y1="0" y2="0">
               <stop offset="0%" stopColor="#475569" />
               <stop offset="55%" stopColor="#111827" />
               <stop offset="100%" stopColor="#020617" />
             </linearGradient>
           </defs>
           <rect width="760" height="300" fill="url(#mold-grid)" />
           <rect x="200" y="72" width="360" height="44" rx="8" fill="url(#mold-steel)" stroke="#cbd5e1" strokeWidth="1.3" />
           <rect x="200" y="194" width="360" height="44" rx="8" fill="url(#mold-steel)" stroke="#cbd5e1" strokeWidth="1.3" />
           <rect x="220" y="116" width="320" height="78" fill="#111827" stroke="#64748b" strokeWidth="1.2" />
           <rect x="160" y="126" width="60" height="58" rx="5" fill="#475569" stroke="#94a3b8" strokeWidth="1.2" />
           <rect x={164 + fillWidth * 0.32} y="130" width="18" height="50" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" />
           <path d="M220 154 H540" stroke="#92400e" strokeWidth="5" strokeLinecap="round" />
           {[268, 348, 428, 508].map((x, i) => (
             <g key={x}>
               <rect x={x - 25} y="137" width="50" height="26" rx="3" fill="#475569" stroke="#cbd5e1" strokeWidth="0.9" />
               <path d={`M${x - 18} 154 C${x - 18} 126 ${x + 18} 126 ${x + 18} 154`} fill="none" stroke="#facc15" strokeWidth="1.4" opacity="0.9" />
               <text x={x} y="178" fill="#94a3b8" fontSize="9" textAnchor="middle">C{i + 1}</text>
             </g>
           ))}
           <clipPath id="mold-cavity-clip">
             <rect x="220" y="116" width="320" height="78" />
           </clipPath>
           <g clipPath="url(#mold-cavity-clip)">
             <rect x="220" y="116" width={Math.min(320, fillWidth * 3.2)} height="78" fill="url(#emc-flow)" opacity="0.82" />
             <ellipse cx={flowX} cy="155" rx="18" ry="45" fill="#64748b" opacity="0.32">
               <animate attributeName="opacity" values="0.18;0.42;0.18" dur="1.2s" repeatCount="indefinite" />
             </ellipse>
           </g>
           <line x1={Math.min(540, flowX)} y1="118" x2={Math.min(540, flowX)} y2="192" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5 5" opacity="0.8" />
           <path d="M190 155 H220" stroke="#020617" strokeWidth="16" strokeLinecap="round" />
           <path d="M190 155 H220" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />

           <Callout x={380} y={88} lx={20} ly={28} anchor="start" dot="#cbd5e1">{t('Steel Mold Chase')}</Callout>
           <Callout x={Math.min(540, flowX)} y={155} lx={740} ly={28} anchor="end" dot="#94a3b8">{t('EMC Flow Front')}</Callout>
           <Callout x={190} y={155} lx={20} ly={220} anchor="start" dot="#64748b">{t('Plunger Gate')}</Callout>
           <Callout x={428} y={154} lx={740} ly={220} anchor="end" dot="#f59e0b">{t('Leadframe and Dies')}</Callout>
         </svg>
         <div className={`w-full flex justify-between text-[11px] font-mono text-slate-300 bg-slate-950/80 px-4 py-2 border-t border-slate-800`}>
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
