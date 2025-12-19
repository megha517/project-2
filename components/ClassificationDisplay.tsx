
import React from 'react';
import { ClassificationResult, ClassificationType } from '../types';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Mail, 
  CheckCircle, 
  Info,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer 
} from 'recharts';

interface Props {
  result: ClassificationResult;
}

const ClassificationDisplay: React.FC<Props> = ({ result }) => {
  const isSpam = result.classification === ClassificationType.SPAM || result.classification === ClassificationType.PHISHING;
  
  const radarData = [
    { subject: 'Urgency', A: result.features.urgencyLevel, full: 10 },
    { subject: 'Links', A: result.features.suspiciousLinks ? 10 : 0, full: 10 },
    { subject: 'Grammar', A: 10 - result.features.grammarQuality, full: 10 },
    { subject: 'Money', A: result.features.financialPromises ? 10 : 0, full: 10 },
    { subject: 'Anonymity', A: result.features.senderAnonymity, full: 10 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Status Banner */}
      <div className={`p-6 rounded-2xl border flex items-center justify-between ${
        isSpam 
          ? 'bg-red-50 border-red-200 text-red-900' 
          : 'bg-emerald-50 border-emerald-200 text-emerald-900'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-full ${isSpam ? 'bg-red-100' : 'bg-emerald-100'}`}>
            {isSpam ? <AlertTriangle className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />}
          </div>
          <div>
            <h3 className="text-xl font-bold uppercase tracking-tight">
              {result.classification} Detected
            </h3>
            <p className="text-sm opacity-80">
              Confidence Score: {(result.confidence * 100).toFixed(1)}%
            </p>
          </div>
        </div>
        <div className="hidden md:block">
          {isSpam ? (
            <span className="bg-red-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">High Risk</span>
          ) : (
            <span className="bg-emerald-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Safe</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reasoning & Features */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h4 className="flex items-center gap-2 text-lg font-semibold mb-4 text-slate-800">
            <Info className="w-5 h-5 text-blue-500" />
            AI Logic Reasoning
          </h4>
          <ul className="space-y-3">
            {result.reasoning.map((point, i) => (
              <li key={i} className="flex gap-3 text-sm text-slate-600">
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                {point}
              </li>
            ))}
          </ul>
          
          <div className="mt-8 grid grid-cols-2 gap-4">
             <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-xs text-slate-400 block mb-1">Financial Promise</span>
                <span className={`text-sm font-semibold ${result.features.financialPromises ? 'text-red-500' : 'text-slate-600'}`}>
                  {result.features.financialPromises ? 'Detected' : 'None'}
                </span>
             </div>
             <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-xs text-slate-400 block mb-1">Suspicious Links</span>
                <span className={`text-sm font-semibold ${result.features.suspiciousLinks ? 'text-red-500' : 'text-slate-600'}`}>
                  {result.features.suspiciousLinks ? 'Present' : 'None'}
                </span>
             </div>
          </div>
        </div>

        {/* Risk Visualizer */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <h4 className="text-lg font-semibold mb-2 text-slate-800">Risk Profile</h4>
          <p className="text-xs text-slate-400 mb-4 uppercase">Trait intensity comparison</p>
          <div className="h-64 w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                <Radar
                  name="Risk Profile"
                  dataKey="A"
                  stroke={isSpam ? "#ef4444" : "#10b981"}
                  fill={isSpam ? "#fca5a5" : "#6ee7b7"}
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassificationDisplay;
