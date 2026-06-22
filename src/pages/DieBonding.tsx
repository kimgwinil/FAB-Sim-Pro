import React, { useEffect, useState } from 'react';
import { useAppContext } from '../store';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { SliderInput, ResultRow } from './WaferDicing';
import { ShieldAlert, ArrowDown } from 'lucide-react';
import { useTranslation } from '../i18n';
import { Quiz } from '../components/Quiz';
import { bondingQuestions } from '../data/quizData';
import { getTheoryChapter } from '../data/theoryData';
import { TheoryView } from '../components/TheoryView';
import { Callout } from '../components/SvgCallout';

export function DieBonding({ mode }: { mode: 'sim'|'theory'|'fa'|'quiz' }) {
  const { bondingInputs, setBondingInputs, setYields } = useAppContext();
  const { t, language } = useTranslation();

  const { dispense, temp, time, pressure } = bondingInputs;
  const theory = getTheoryChapter('dieBonding', language);

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
             <CardContent>
                <TheoryView title={theory.title} content={theory.content} />
             </CardContent>
           </Card>
        )}

        {mode === 'sim' && <div className="flex flex-col gap-4">
          <div className="mx-auto w-full max-w-[760px]">
            <BondingVisualizer dispense={dispense} time={time} pressure={pressure} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
  const dieY = Math.max(108, 176 - pressure * 1.35);
  const epoxyWidth = Math.min(150, 54 + dispense * 150 + pressure * 0.9);
  const epoxyHeight = Math.max(6, 18 + dispense * 20 - pressure * 0.16);
  const curePct = Math.min(100, (time / 120) * 100);
  return (
    <Card className="bg-[#0f172a] border-slate-700 shadow-2xl relative overflow-hidden">
      <CardContent className="p-0">
        <svg viewBox="0 0 760 300" className="w-full block select-none" style={{ aspectRatio: '760 / 300' }}>
          <defs>
            <pattern id="bond-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M20 0H0V20" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            </pattern>
            <linearGradient id="leadframe-metal" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="55%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
            <linearGradient id="collet-metal" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
            <radialGradient id="epoxy-glow">
              <stop offset="0%" stopColor="#fb7185" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#991b1b" stopOpacity="0.9" />
            </radialGradient>
          </defs>
          <rect width="760" height="300" fill="url(#bond-grid)" />
          <rect x="238" y="232" width="284" height="18" rx="3" fill="url(#leadframe-metal)" stroke="#f59e0b" strokeWidth="1.3" />
          <rect x="272" y="220" width="216" height="10" rx="5" fill="#fbbf24" opacity="0.32" />
          <ellipse cx="380" cy="224" rx={epoxyWidth / 2} ry={epoxyHeight} fill="url(#epoxy-glow)" stroke="#fecaca" strokeWidth="1" opacity="0.96" />
          <rect x="308" y={dieY} width="144" height="18" rx="2" fill="#cbd5e1" stroke="#f8fafc" strokeWidth="1.2" />
          <g opacity="0.85">
            {Array.from({ length: 8 }).map((_, i) => (
              <line key={i} x1={318 + i * 18} y1={dieY + 4} x2={318 + i * 18} y2={dieY + 14} stroke="#64748b" strokeWidth="0.8" />
            ))}
          </g>
          <rect x="352" y="54" width="56" height={Math.max(42, dieY - 56)} rx="5" fill="url(#collet-metal)" stroke="#94a3b8" strokeWidth="1.5" />
          <rect x="362" y="54" width="36" height={Math.max(42, dieY - 56)} fill="#0f172a" opacity="0.22" />
          <path d={`M352 ${dieY - 4} L408 ${dieY - 4} L452 ${dieY} L308 ${dieY} Z`} fill="#64748b" stroke="#cbd5e1" strokeWidth="1" />
          <g opacity={curePct / 120 + 0.2}>
            <rect x="232" y="250" width="296" height="22" fill="#f97316" opacity="0.12" />
            {[285, 330, 375, 420, 465].map((x, i) => (
              <rect key={x} x={x} y="260" width="28" height="4" rx="2" fill="#fb923c" opacity="0.75">
                <animate attributeName="opacity" values="0.35;0.9;0.35" dur="1.4s" begin={`${i * 0.18}s`} repeatCount="indefinite" />
              </rect>
            ))}
          </g>
          <path d={`M454 ${dieY + 8} C496 ${dieY + 20}, 504 212, 522 232`} fill="none" stroke="#fb7185" strokeWidth="2" strokeDasharray="5 5" opacity="0.55" />

          <Callout x={380} y={Math.max(68, dieY - 40)} lx={20} ly={28} anchor="start" dot="#cbd5e1">{t('Pick & Place Collet')}</Callout>
          <Callout x={452} y={dieY + 10} lx={740} ly={28} anchor="end" dot="#e2e8f0">{t('Silicon Die')}</Callout>
          <Callout x={380} y={224} lx={20} ly={218} anchor="start" dot="#f87171">{t('Conductive Epoxy')}</Callout>
          <Callout x={500} y={240} lx={740} ly={218} anchor="end" dot="#f59e0b">{t('Leadframe (Alloy 42)')}</Callout>
        </svg>
        <div className="w-full bg-slate-950/80 px-4 py-2 border-t border-slate-800 flex justify-between text-[11px] font-mono text-slate-300">
           <span>{t('Epoxy Vol')}: <span className="text-white font-bold">{(dispense*100).toFixed(0)} μL</span></span>
           <span>{t('Applied Pressure')}: <span className="text-white font-bold">{pressure} gf</span></span>
           <span>{t('Curing Status')}: <span className="text-amber-400 font-bold">{curePct.toFixed(0)}%</span></span>
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
