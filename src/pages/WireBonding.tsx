import React, { useEffect, useState } from 'react';
import { useAppContext } from '../store';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { SliderInput, ResultRow } from './WaferDicing';
import { useTranslation } from '../i18n';
import { Disc3 } from 'lucide-react';
import { Quiz } from '../components/Quiz';
import { wireQuestions } from '../data/quizData';
import { getTheoryChapter } from '../data/theoryData';
import { TheoryView } from '../components/TheoryView';
import { Callout } from '../components/SvgCallout';

export function WireBonding({ mode }: { mode: 'sim'|'theory'|'fa'|'quiz' }) {
  const { wireInputs, setWireInputs, setYields } = useAppContext();
  const { t, language } = useTranslation();

  const { power, temp, force, loopHeight, length } = wireInputs;
  const theory = getTheoryChapter('wireBonding', language);

  // Calculators
  const initialBall = 25 * 2.5; // 62.5 um
  const deformation = initialBall * (1 + force / 500 * 0.3 + power / 1000);
  const defRatio = deformation / initialBall;
  
  const imcThickness = Math.max(0, (temp - 150) * 0.02 + power * 0.003);
  
  const tension = power * 0.5;
  const gravityConstant = 9.8e-3;
  const sag = (Math.pow(length, 2) * gravityConstant) / (8 * tension);
  const isValidLoop = loopHeight > sag * 1.5;

  const strength = power * 0.3 + temp * 0.2 + force * 0.4;
  
  // Calculate Yield Penalty
  let penalty = 0;
  if(defRatio < 1.1 || defRatio > 1.8) penalty += 5;
  if(imcThickness > 2) penalty += 15;
  if(!isValidLoop) penalty += 20;
  const calculatedYield = Math.max(0, 100 - penalty);

  useEffect(() => {
    setYields({ wire: calculatedYield });
  }, [calculatedYield]);

  const defStatus = defRatio >= 1.1 && defRatio <= 1.8 ? 'Good' : 'Bad';
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
             <CardContent>
                <TheoryView title={theory.title} content={theory.content} />
             </CardContent>
           </Card>
        )}

        {mode === 'sim' && <div className="flex flex-col gap-4 lg:gap-5">
          <div className="mx-auto w-full max-w-[700px] lg:sticky lg:top-0 lg:z-20 lg:bg-slate-50 lg:pt-1 lg:pb-3">
            <WireVisualizer loopHeight={loopHeight} length={length} isValidLoop={isValidLoop} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
            <Card>
              <CardHeader title={t('Ultrasonic & Thermal Params')} />
              <CardContent className="space-y-5 lg:space-y-4">
                <SliderInput label={t('US Power (mW)')} min={50} max={150} value={power} step={1} passRange={{ min: 80, max: 140 }}
                  onChange={(v: number) => setWireInputs({...wireInputs, power: v})} />
                <SliderInput label={t('Bonding Temp (°C)')} min={150} max={200} value={temp} step={1} passRange={{ min: 160, max: 175 }}
                  onChange={(v: number) => setWireInputs({...wireInputs, temp: v})} />
                <SliderInput label={t('Bonding Force (gf)')} min={20} max={80} value={force} step={1} passRange={{ min: 35, max: 75 }}
                  onChange={(v: number) => setWireInputs({...wireInputs, force: v})} />
                <SliderInput label={t('Loop Height (μm)')} min={100} max={300} value={loopHeight} step={5} passRange={{ min: 180, max: 300 }}
                  onChange={(v: number) => setWireInputs({...wireInputs, loopHeight: v})} />
                <SliderInput label={t('Wire Length (μm)')} min={500} max={3000} value={length} step={50} passRange={{ min: 500, max: 1800 }}
                  onChange={(v: number) => setWireInputs({...wireInputs, length: v})} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader title={t('Intermetallic & Mechanical')} />
              <CardContent className="space-y-5 lg:space-y-4">
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
  const endX = Math.min(548, 430 + length / 24);
  const controlY = Math.max(74, 218 - loopHeight / 1.55);
  
  return (
    <Card className="bg-[#0f172a] border-slate-700 shadow-2xl relative overflow-hidden">
      <CardContent className="p-0">
         <svg viewBox="0 0 760 300" className="w-full block select-none" style={{ aspectRatio: '760 / 300' }}>
           <defs>
             <pattern id="wire-grid" width="20" height="20" patternUnits="userSpaceOnUse">
               <path d="M20 0H0V20" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
             </pattern>
             <linearGradient id="wire-gold" x1="0%" y1="100%" x2="100%" y2="0%">
               <stop offset="0%" stopColor="#f59e0b" />
               <stop offset="35%" stopColor="#fef08a" />
               <stop offset="72%" stopColor="#eab308" />
               <stop offset="100%" stopColor="#92400e" />
             </linearGradient>
             <linearGradient id="capillary-ceramic" x1="0" x2="0" y1="0" y2="1">
               <stop offset="0%" stopColor="#f8fafc" />
               <stop offset="100%" stopColor="#94a3b8" />
             </linearGradient>
           </defs>
           <rect width="760" height="300" fill="url(#wire-grid)" />
           <rect x="206" y="222" width="146" height="28" rx="3" fill="#475569" stroke="#94a3b8" strokeWidth="1.2" />
           <rect x="244" y="214" width="64" height="10" rx="2" fill="#7dd3fc" stroke="#bae6fd" strokeWidth="1" />
           <ellipse cx="276" cy="210" rx="22" ry="10" fill="url(#wire-gold)" stroke="#fef3c7" strokeWidth="1.2" />
           <rect x="476" y="224" width="168" height="26" rx="3" fill="#78350f" stroke="#f59e0b" strokeWidth="1.2" />
           <rect x="502" y="216" width="78" height="8" rx="4" fill="#ca8a04" />
           <path d={`M276 208 C304 ${controlY}, 386 ${controlY - 6}, ${endX} 218`} fill="none" stroke="url(#wire-gold)" strokeWidth="5" strokeLinecap="round" filter="drop-shadow(0 8px 6px rgba(0,0,0,0.55))" opacity={isValidLoop ? 1 : 0.35} />
           {!isValidLoop && <path d={`M276 208 Q390 252 ${endX} 218`} fill="none" stroke="#ef4444" strokeWidth="3" strokeDasharray="7 6" />}
           <path d={`M${endX - 22} 218 L${endX + 30} 214`} stroke="url(#wire-gold)" strokeWidth="6" strokeLinecap="round" />
           <path d="M518 72 L548 72 L540 164 L526 198 L512 164 Z" fill="url(#capillary-ceramic)" stroke="#cbd5e1" strokeWidth="1.4" opacity="0.9" />
           <circle cx="526" cy="198" r="5" fill="#fef08a" stroke="#92400e" strokeWidth="1" />
           <line x1="526" y1="198" x2={endX} y2="218" stroke="#fef08a" strokeWidth="2.2" strokeLinecap="round" />

           <Callout x={530} y={118} lx={20} ly={28} anchor="start" dot="#cbd5e1">{t('Ceramic Capillary')}</Callout>
           <Callout x={392} y={controlY} lx={740} ly={28} anchor="end" dot="#fde047">{t('Gold Wire (25μm)')}</Callout>
           <Callout x={276} y={218} lx={20} ly={220} anchor="start" dot="#7dd3fc">{t('Al Pad (FAB)')}</Callout>
           <Callout x={endX} y={218} lx={740} ly={220} anchor="end" dot="#eab308">{t('Stitch Wedge Bond')}</Callout>
         </svg>
         <div className={`w-full ${isRtl ? 'flex-row-reverse' : ''} flex justify-between text-[11px] font-mono text-slate-300 bg-slate-950/80 px-4 py-2 border-t border-slate-800`}>
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
