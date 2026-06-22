import React, { useState } from 'react';
import { Card, CardContent } from './ui/Card';
import { CheckCircle, XCircle } from 'lucide-react';
import { useTranslation } from '../i18n';

export interface Question {
  id: string;
  questionKey: string;
  optionsKeys: string[];
  correctIndex: number;
  explanationKey: string;
}

interface QuizProps {
  questions: Question[];
}

export function Quiz({ questions }: QuizProps) {
  const { t, language } = useTranslation();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const isRtl = language === 'ar';

  const handleSelect = (qId: string, optIndex: number) => {
    if (answers[qId] !== undefined) return;
    setAnswers(prev => ({ ...prev, [qId]: optIndex }));
  };

  return (
    <div className="space-y-6">
      {questions.map((q, qIndex) => {
        const isAnswered = answers[q.id] !== undefined;
        const selectedIndex = answers[q.id];
        const isCorrect = selectedIndex === q.correctIndex;
        
        return (
          <div key={q.id}>
            <Card>
              <CardContent className="pt-6">
                <h4 className="font-semibold text-slate-900 mb-4 flex items-start gap-2">
                  <span className="bg-slate-100 text-slate-500 px-2 flex items-center h-6 rounded text-sm shrink-0">Q{qIndex + 1}</span>
                  <span>{t(q.questionKey)}</span>
                </h4>
              <div className={`space-y-3 ${isRtl ? 'pr-9' : 'pl-9'}`}>
                {q.optionsKeys.map((opt, i) => {
                  let btnClass = "border-slate-200 hover:bg-slate-50 text-slate-700 bg-white";
                  let icon = null;
                  if (isAnswered) {
                    if (i === q.correctIndex) {
                      btnClass = "border-green-500 bg-green-50 text-green-800";
                      icon = <CheckCircle className={`w-5 h-5 text-green-600 inline ${isRtl ? 'mr-2' : 'ml-2'}`}/>;
                    } else if (i === selectedIndex && selectedIndex !== q.correctIndex) {
                      btnClass = "border-red-500 bg-red-50 text-red-800";
                      icon = <XCircle className={`w-5 h-5 text-red-600 inline ${isRtl ? 'mr-2' : 'ml-2'}`}/>;
                    } else {
                      btnClass = "border-slate-200 bg-slate-50 text-slate-400 opacity-60";
                    }
                  }

                  return (
                    <button 
                      key={i} 
                      onClick={() => handleSelect(q.id, i)}
                      disabled={isAnswered}
                      className={`w-full text-left px-4 py-3 rounded-lg border flex justify-between items-center transition-all ${btnClass}`}
                    >
                      <span className="text-sm">{t(opt)}</span>
                      {icon}
                    </button>
                  );
                })}
              </div>
              {isAnswered && (
                <div className={`mt-4 ${isRtl ? 'pr-9' : 'pl-9'} p-4 rounded-lg text-sm leading-relaxed ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-amber-50 text-amber-800'}`}>
                  <strong>{t('Explanation')}:</strong> {t(q.explanationKey)}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        );
      })}
    </div>
  );
}
