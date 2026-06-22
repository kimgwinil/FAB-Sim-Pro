import React, { useEffect, useState } from 'react';
import { useAppContext } from '../store';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { AlertCircle, FileText, Activity, Disc3 } from 'lucide-react';
import { useTranslation } from '../i18n';
import { Quiz } from '../components/Quiz';
import { dicingQuestions } from '../data/quizData';
import { getTheoryChapter } from '../data/theoryData';
import { TheoryView } from '../components/TheoryView';

export function WaferDicing({ mode }: { mode: 'sim'|'theory'|'fa'|'quiz' }) {
  const { dicingInputs, setDicingInputs, setYields } = useAppContext();
  const { t, language } = useTranslation();

  const { rpm, feedRate, coolant, bladeWear } = dicingInputs;
  const theory = getTheoryChapter('dicing', language);

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
             <CardContent>
                <TheoryView title={theory.title} content={theory.content} />
             </CardContent>
           </Card>
        )}

        {mode === 'sim' && <div className="flex flex-col gap-4 lg:gap-5">
          <div className="mx-auto w-full max-w-[640px] lg:sticky lg:top-0 lg:z-20 lg:bg-slate-50 lg:pt-1 lg:pb-3">
            <DicingVisualizer rpm={rpm} feedRate={feedRate} coolant={coolant} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
            <Card>
              <CardHeader title={t('Process Parameters')} subtitle={t('Adjust blade and feed inputs')} />
              <CardContent className="space-y-5 lg:space-y-4" >
                <SliderInput label={t('Blade RPM (RPM)')} min={20000} max={40000} value={rpm} step={100} passRange={{ min: 25000, max: 35000 }}
                  onChange={(v: number) => setDicingInputs({...dicingInputs, rpm: v})} />
                <SliderInput label={t('Feed Rate (mm/s)')} min={10} max={100} value={feedRate} step={1} passRange={{ min: 10, max: 25 }}
                  onChange={(v: number) => setDicingInputs({...dicingInputs, feedRate: v})} />
                <SliderInput label={t('Coolant Flow (L/min)')} min={0.5} max={3.0} value={coolant} step={0.1} passRange={{ min: 2.0, max: 3.0 }}
                  onChange={(v: number) => setDicingInputs({...dicingInputs, coolant: v})} />
                <SliderInput label={t('Blade Wear (%)')} min={0} max={100} value={bladeWear} step={1} passRange={{ min: 0, max: 4 }}
                  onChange={(v: number) => setDicingInputs({...dicingInputs, bladeWear: v})} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader title={t('Process Results')} subtitle={t('Calculated output variables')} />
              <CardContent className="space-y-5 lg:space-y-4">
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

export function SliderInput({ label, min, max, value, step, onChange, passRange }: any) {
  const { t } = useTranslation();
  const clampPct = (v: number) => Math.min(100, Math.max(0, ((v - min) / (max - min)) * 100));
  const passStart = passRange ? clampPct(passRange.min) : 0;
  const passEnd = passRange ? clampPct(passRange.max) : 0;
  const formatValue = (v: number) => Number.isInteger(v) ? String(v) : String(Number(v.toFixed(2)));
  return (
    <div>
      <div className="flex items-start justify-between gap-3 mb-2">
        <label className="min-w-0 text-sm font-medium leading-snug text-slate-700">{label}</label>
        <span className="shrink-0 text-sm font-mono text-blue-600">{value}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
      {passRange && (
        <div className="mt-1.5">
          <div className="relative h-3 mx-1">
            <div
              className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-emerald-500/35 border border-emerald-500/50"
              style={{ left: `${passStart}%`, width: `${Math.max(2, passEnd - passStart)}%` }}
            />
            <span className="absolute top-0 h-3 w-px bg-emerald-600" style={{ left: `${passStart}%` }} />
            <span className="absolute top-0 h-3 w-px bg-emerald-600" style={{ left: `${passEnd}%` }} />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5 text-[10px] leading-tight text-slate-500">
            <span>{t('PASS Range')}: {formatValue(passRange.min)}-{formatValue(passRange.max)}</span>
            <span>{t('Target')}</span>
          </div>
        </div>
      )}
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
    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 py-2 border-b border-slate-100 last:border-0">
      <span className="min-w-0 text-slate-600 text-sm">{label}</span>
      <div className="flex shrink-0 items-center gap-2">
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
  const spin = rpm > 35000 ? 'animate-[spin_0.2s_linear_infinite]' : rpm > 25000 ? 'animate-[spin_0.4s_linear_infinite]' : 'animate-[spin_0.8s_linear_infinite]';
  const coolantOn = coolant > 1.2;

  const Callout = ({ x, y, lx, ly, anchor = 'start', color, label, width = 132 }: {
    x: number; y: number; lx: number; ly: number; anchor?: 'start' | 'end'; color: string; label: string; width?: number;
  }) => {
    const boxX = anchor === 'end' ? lx - width : lx;
    const textX = anchor === 'end' ? lx - 10 : lx + 10;
    return (
      <g>
        <line x1={x} y1={y} x2={lx} y2={ly} stroke="#cbd5e1" strokeWidth="1.35" strokeLinecap="round" opacity="0.92" />
        <circle cx={x} cy={y} r="4" fill={color} stroke="#f8fafc" strokeWidth="1.5" />
        <rect x={boxX} y={ly - 13} width={width} height="26" rx="6" fill="#0f172a" stroke={color} strokeWidth="1.2" opacity="0.96" />
        <text x={textX} y={ly + 4} fill="#f8fafc" fontSize="12" fontWeight="700" textAnchor={anchor === 'end' ? 'end' : 'start'}>
          {label}
        </text>
      </g>
    );
  };

  const scribeXs = [270, 295, 320, 345, 370, 395, 420, 445, 470, 495];
  const dieRows = [142, 152, 162];

  const waferGrid = (
    <g clipPath="url(#wafer-clip)">
      <rect x="250" y="136" width="260" height="36" fill="#cbd5e1" />
      {scribeXs.map((x) => (
        <line key={`v-${x}`} x1={x} y1="136" x2={x} y2="172" stroke="#64748b" strokeWidth="1" opacity="0.9" />
      ))}
      {dieRows.map((y) => (
        <line key={`h-${y}`} x1="250" y1={y} x2="510" y2={y} stroke="#64748b" strokeWidth="1" opacity="0.75" />
      ))}
      <line x1="380" y1="136" x2="380" y2="172" stroke="#f97316" strokeWidth="5" opacity="0.95" />
      <line x1="380" y1="136" x2="380" y2="172" stroke="#fed7aa" strokeWidth="1.2" strokeDasharray="4 4" />
    </g>
  );

  return (
    <Card className="bg-[#0f172a] border-slate-700 shadow-2xl relative overflow-hidden">
      <CardContent className="p-0">
        <svg viewBox="0 0 760 240" className="w-full block select-none" style={{ aspectRatio: '760 / 240' }}>
          <defs>
            <pattern id="dicing-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M20 0H0V20" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            </pattern>
            <clipPath id="wafer-clip">
              <rect x="250" y="136" width="260" height="36" rx="12" />
            </clipPath>
          </defs>
          <rect width="760" height="240" fill="url(#dicing-grid)" />

          {/* --- Diagram: chuck table + wafer + spinning blade + coolant --- */}
          {/* Chuck table */}
          <rect x="215" y="184" width="330" height="18" rx="3" fill="#334155" stroke="#475569" strokeWidth="1.5" />
          {/* Dicing tape + silicon wafer map with scribe lines */}
          <rect x="236" y="172" width="288" height="8" rx="4" fill="#38bdf8" opacity="0.55" stroke="#67e8f9" strokeWidth="1" />
          {waferGrid}
          <rect x="250" y="136" width="260" height="36" rx="12" fill="none" stroke="#e2e8f0" strokeWidth="1.4" />
          {/* Spindle arbor */}
          <rect x="366" y="36" width="28" height="72" rx="3" fill="#64748b" stroke="#94a3b8" strokeWidth="1.5" />
          {/* Coolant spray (reacts to flow) */}
          <rect x="286" y="68" width="24" height="14" rx="2" transform="rotate(34 298 75)" fill="#475569" stroke="#94a3b8" />
          <path d="M300 84 L376 152" stroke="#22d3ee" strokeLinecap="round" strokeWidth={coolantOn ? 7 : 4} opacity={coolantOn ? 0.65 : 0.18} />
          {/* Spinning dicing blade */}
          <circle cx="380" cy="108" r="54" fill="none" stroke="#e2e8f0" strokeWidth="10" strokeDasharray="11 9" opacity="0.92"
            className={spin} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
          {/* Blade hub */}
          <circle cx="380" cy="108" r="11" fill="#f1f5f9" stroke="#475569" strokeWidth="2" />
          <circle cx="380" cy="108" r="4" fill="#1e293b" />
          {/* Cut spark */}
          <circle cx="380" cy="163" r="4" fill="#fde68a" opacity="0.85" />

          {/* --- Part-name callouts with leader lines (kept clear of the diagram) --- */}
          <Callout x={380} y={50} lx={20} ly={26} color="#94a3b8" label={t('Spindle Arbor')} width={126} />
          <Callout x={300} y={84} lx={20} ly={64} color="#22d3ee" label={t('Coolant Nozzle')} width={126} />
          <Callout x={424} y={80} lx={740} ly={26} anchor="end" color="#e2e8f0" label={t('Diamond Blade')} width={126} />
          <Callout x={380} y={154} lx={740} ly={64} anchor="end" color="#f97316" label={t('Cutting Kerf')} width={126} />
          <Callout x={295} y={142} lx={20} ly={182} color="#64748b" label={t('Scribe Lines')} width={126} />
          <Callout x={318} y={152} lx={20} ly={218} color="#cbd5e1" label={`${t('Silicon Wafer')} 775μm`} width={146} />
          <Callout x={510} y={176} lx={740} ly={154} anchor="end" color="#38bdf8" label={t('Dicing Tape')} width={126} />
          <Callout x={542} y={193} lx={740} ly={192} anchor="end" color="#64748b" label={t('Chuck Table')} width={126} />
        </svg>

        {/* Dashboard parameters footer */}
        <div className="w-full bg-slate-950/80 px-4 py-2 border-t border-slate-800 flex justify-between text-[11px] font-mono text-slate-300">
           <span>{t('Blade RPM')}: <span className="text-white font-bold">{rpm}</span></span>
           <span>{t('Feed Rate')}: <span className="text-white font-bold">{feedRate} mm/s</span></span>
           <span className={coolant >= 1.5 ? "text-cyan-400 font-bold" : "text-amber-400 font-bold"}>{coolant >= 1.5 ? t('COOLANT OK') : t('COOLANT LOW')}</span>
        </div>
      </CardContent>
    </Card>
  );
}
