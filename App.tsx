
import React, { useState } from 'react';
import type { AnalysisReportData } from './types';
import { analyzeChatLog } from './services/geminiService';
import ChatInputForm from './components/ChatInputForm';
import AnalysisReport from './components/AnalysisReport';
import LoadingSpinner from './components/LoadingSpinner';
import { HeaderIcon } from './components/icons';

const App: React.FC = () => {
  const [report, setReport] = useState<AnalysisReportData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (chatLog: string, instructorNames: string) => {
    if (!chatLog.trim()) {
      setError('Chat log cannot be empty.');
      return;
    }
    if (!instructorNames.trim()) {
      setError('Please specify at least one instructor/host name.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setReport(null);

    try {
      const result = await analyzeChatLog(chatLog, instructorNames);
      setReport(result);
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred during analysis.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setReport(null);
    setError(null);
    setIsLoading(false);
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
      <header className="bg-white dark:bg-slate-800/50 shadow-sm sticky top-0 z-10 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <HeaderIcon />
              <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Live Session Analyzer
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md" role="alert">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}

          {!report && !isLoading ? (
            <ChatInputForm onAnalyze={handleAnalyze} disabled={isLoading} />
          ) : null}

          {isLoading && (
            <div className="flex flex-col items-center justify-center bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md">
              <LoadingSpinner />
              <p className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-300">
                Analyzing session log...
              </p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                This may take a moment. We're extracting key insights for you.
              </p>
            </div>
          )}
          
          {report && !isLoading && (
            <div>
              <AnalysisReport report={report} />
              <div className="mt-8 text-center">
                 <button 
                  onClick={handleReset}
                  className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">
                    Analyze Another Session
                 </button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <footer className="text-center py-4 mt-8">
        <p className="text-sm text-slate-500 dark:text-slate-400">Powered by Gemini API</p>
      </footer>
    </div>
  );
};

export default App;