import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'ko' | 'ar';

// Input types
export interface DicingInputs { rpm: number; feedRate: number; coolant: number; bladeWear: number; }
export interface BondingInputs { dispense: number; temp: number; time: number; pressure: number; }
export interface WireInputs { power: number; temp: number; force: number; loopHeight: number; length: number; }
export interface MoldingInputs { transferPressure: number; moldTemp: number; cureTime: number; clampForce: number; preheat: number; }
export interface TestInputs { testTemp: number; voltVariation: number; testCoverage: number; burninTemp: number; burninVolt: number; burninTime: number; }

export interface YieldData {
  dicing: number;
  bonding: number;
  wire: number;
  molding: number;
  test: number;
}

interface AppState {
  language: Language;
  setLanguage: (lang: Language) => void;
  dicingInputs: DicingInputs;
  setDicingInputs: (i: DicingInputs) => void;
  bondingInputs: BondingInputs;
  setBondingInputs: (i: BondingInputs) => void;
  wireInputs: WireInputs;
  setWireInputs: (i: WireInputs) => void;
  moldingInputs: MoldingInputs;
  setMoldingInputs: (i: MoldingInputs) => void;
  testInputs: TestInputs;
  setTestInputs: (i: TestInputs) => void;
  yields: YieldData;
  setYields: (y: Partial<YieldData>) => void;
}

const defaultState: AppState = {
  language: 'ko',
  setLanguage: () => {},
  dicingInputs: { rpm: 30000, feedRate: 50, coolant: 1.5, bladeWear: 20 },
  setDicingInputs: () => {},
  bondingInputs: { dispense: 0.3, temp: 175, time: 60, pressure: 30 },
  setBondingInputs: () => {},
  wireInputs: { power: 100, temp: 175, force: 50, loopHeight: 200, length: 1500 },
  setWireInputs: () => {},
  moldingInputs: { transferPressure: 10, moldTemp: 175, cureTime: 120, clampForce: 100, preheat: 85 },
  setMoldingInputs: () => {},
  testInputs: { testTemp: 25, voltVariation: 10, testCoverage: 98, burninTemp: 125, burninVolt: 1.2, burninTime: 96 },
  setTestInputs: () => {},
  yields: { dicing: 99.5, bonding: 99.2, wire: 99.8, molding: 99.0, test: 98.5 },
  setYields: () => {},
};

const AppContext = createContext<AppState>(defaultState);

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(defaultState.language);
  const [dicingInputs, setDicingInputs] = useState<DicingInputs>(defaultState.dicingInputs);
  const [bondingInputs, setBondingInputs] = useState<BondingInputs>(defaultState.bondingInputs);
  const [wireInputs, setWireInputs] = useState<WireInputs>(defaultState.wireInputs);
  const [moldingInputs, setMoldingInputs] = useState<MoldingInputs>(defaultState.moldingInputs);
  const [testInputs, setTestInputs] = useState<TestInputs>(defaultState.testInputs);
  const [yields, setYieldsState] = useState<YieldData>(defaultState.yields);

  const setYields = (y: Partial<YieldData>) => setYieldsState(prev => ({ ...prev, ...y }));

  return (
    <AppContext.Provider value={{
      language, setLanguage,
      dicingInputs, setDicingInputs,
      bondingInputs, setBondingInputs,
      wireInputs, setWireInputs,
      moldingInputs, setMoldingInputs,
      testInputs, setTestInputs,
      yields, setYields
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
