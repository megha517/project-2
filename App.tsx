
import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Mail, 
  History, 
  Search, 
  Loader2, 
  Trash2, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { ClassificationResult, AppState } from './types';
import { classifyEmail } from './services/geminiService';
import ClassificationDisplay from './components/ClassificationDisplay';

const App: React.FC = () => {
  const [emailContent, setEmailContent] = useState('');
  const [state, setState] = useState<AppState>({
    history: [],
    isAnalyzing: false,
    currentResult: null,
  });

  const handleAnalyze = async () => {
    if (!emailContent.trim() || state.isAnalyzing) return;

    setState(prev => ({ ...prev, isAnalyzing: true }));
    try {
      const result = await classifyEmail(emailContent);
      setState(prev => ({
        ...prev,
        isAnalyzing: false,
        currentResult: result,
        history: [result, ...prev.history].slice(0, 10), // Keep last 10
      }));
    } catch (error) {
      console.error("Classification error:", error);
      alert("Failed to analyze email. Please check your API key or network connection.");
      setState(prev => ({ ...prev, isAnalyzing: false }));
    }
  };

  const clearHistory = () => setState(prev => ({ ...prev, history: [] }));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-500 bg-clip-text text-transparent">
                SpamShield AI
              </h1>
            </div>
            <div className="flex items-center gap-4 text-slate-500">
              <span className="text-xs font-medium uppercase tracking-widest hidden md:inline">v1.0 Prototyper</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* Left Column: Input and Active Result */}
          <div className="xl:col-span-8 space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-500" />
                  Analyze Email Content
                </h2>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setEmailContent('')}
                    className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    Clear Input
                  </button>
                </div>
              </div>
              
              <textarea
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                placeholder="Paste the raw email text or message content here for deep inspection..."
                className="w-full h-64 p-4 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
              />
              
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleAnalyze}
                  disabled={!emailContent.trim() || state.isAnalyzing}
                  className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-white transition-all transform active:scale-95 ${
                    !emailContent.trim() || state.isAnalyzing
                      ? 'bg-slate-300 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200'
                  }`}
                >
                  {state.isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Classify Email
                    </>
                  )}
                </button>
              </div>
            </div>

            {state.currentResult ? (
              <ClassificationDisplay result={state.currentResult} />
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed text-slate-400">
                <div className="p-4 bg-slate-50 rounded-full mb-4">
                  <Search className="w-10 h-10" />
                </div>
                <p className="text-sm">Submit text above to see AI-powered classification analysis.</p>
              </div>
            )}
          </div>

          {/* Right Column: History & Stats */}
          <div className="xl:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden sticky top-24">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-semibold flex items-center gap-2">
                  <History className="w-5 h-5 text-slate-500" />
                  Recent History
                </h3>
                {state.history.length > 0 && (
                  <button onClick={clearHistory} className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-red-500 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <div className="divide-y divide-slate-100">
                {state.history.length === 0 ? (
                  <div className="p-10 text-center">
                    <p className="text-sm text-slate-400">No recent analyses</p>
                  </div>
                ) : (
                  state.history.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setState(prev => ({ ...prev, currentResult: item }))}
                      className={`w-full p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors text-left group ${
                        state.currentResult?.id === item.id ? 'bg-blue-50/50 border-l-4 border-blue-500' : ''
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full shrink-0 ${
                        item.classification === 'LEGITIMATE' ? 'bg-emerald-500' : 'bg-red-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-tighter mb-0.5">
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </p>
                        <p className="text-sm font-semibold truncate text-slate-700">
                          {item.content.substring(0, 50)}...
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                    </button>
                  ))
                )}
              </div>
              
              <div className="p-6 bg-slate-50 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-700">
                      {state.history.filter(h => h.classification === 'LEGITIMATE').length}
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Safe</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-500">
                      {state.history.filter(h => h.classification !== 'LEGITIMATE').length}
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Spam/Phish</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <footer className="mt-20 border-t border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-400">
            Powered by Gemini 3 Flash and Advanced Heuristics. &copy; {new Date().getFullYear()} SpamShield AI Research Labs.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
