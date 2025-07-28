import React, { useState } from 'react';
import { Calculator as CalculatorIcon, Settings } from 'lucide-react';
import { CalculatorForm } from './components/CalculatorForm';
import { CalculationResult } from './components/CalculationResult';
import { HistoryPanel } from './components/HistoryPanel';
import { SetupModal } from './components/SetupModal';
import { ThemeToggle } from './components/ThemeToggle';
import { StorageManager } from './utils/storage';
import { OvertimeCalculation, UserSettings } from './types/overtime';
import { useEffect } from 'react';

function App() {
  const [currentResult, setCurrentResult] = useState<(typeof currentResult) | null>(null);
  const [activeTab, setActiveTab] = useState<'calculator' | 'history'>('calculator');
  const [userSettings, setUserSettings] = useState<UserSettings>(StorageManager.getUserSettings());
  const [showSetup, setShowSetup] = useState(!userSettings.isSetupComplete);

  useEffect(() => {
    // Apply theme to document
    if (userSettings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [userSettings.theme]);

  const handleCalculate = (result: any) => {
    setCurrentResult(result);
  };

  const handleSetupComplete = (baseSalary: number) => {
    const newSettings: UserSettings = {
      baseSalary,
      theme: userSettings.theme,
      isSetupComplete: true
    };
    StorageManager.saveUserSettings(newSettings);
    setUserSettings(newSettings);
    setShowSetup(false);
  };

  const handleThemeToggle = () => {
    const newTheme = userSettings.theme === 'light' ? 'dark' : 'light';
    const newSettings = { ...userSettings, theme: newTheme };
    StorageManager.saveUserSettings(newSettings);
    setUserSettings(newSettings);
  };

  const handleOpenSettings = () => {
    setShowSetup(true);
  };

  const handleSave = () => {
    if (!currentResult) return;

    const calculation: OvertimeCalculation = {
      id: Date.now().toString(),
      date: currentResult.date,
      startTime: currentResult.startTime,
      endTime: currentResult.endTime,
      baseSalary: userSettings.baseSalary,
      hourlyRate: currentResult.hourlyRate,
      ranges: {
        range1Hours: currentResult.range1Hours,
        range1Amount: currentResult.range1Amount,
        range2Hours: currentResult.range2Hours,
        range2Amount: currentResult.range2Amount,
        range3Hours: currentResult.range3Hours,
        range3Amount: currentResult.range3Amount,
      },
      mealAllowance: currentResult.mealAllowance,
      totalOvertime: currentResult.totalOvertime,
      createdAt: new Date().toISOString(),
    };

    StorageManager.saveCalculation(calculation);
    alert('Perhitungan berhasil disimpan!');
    setCurrentResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
      <SetupModal isOpen={showSetup} onComplete={handleSetupComplete} />
      
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 dark:bg-blue-700 rounded-xl">
                <CalculatorIcon className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Overtime Calculator Indonesia
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <nav className="flex space-x-1">
                <button
                  onClick={() => setActiveTab('calculator')}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'calculator'
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  Kalkulator
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'history'
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  Riwayat
                </button>
              </nav>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenSettings}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  aria-label="Settings"
                >
                  <Settings className="w-5 h-5" />
                </button>
                
                <ThemeToggle theme={userSettings.theme} onToggle={handleThemeToggle} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'calculator' ? (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Hitung Lembur Anda dengan Akurat
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Kalkulator lembur berdasarkan standar ketenagakerjaan Indonesia. 
                Hitung overtime pay dengan mudah dan simpan riwayat perhitungan Anda.
              </p>
            </div>

            <CalculatorForm baseSalary={userSettings.baseSalary} onCalculate={handleCalculate} />
            
            {currentResult && (
              <CalculationResult result={currentResult} onSave={handleSave} />
            )}
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <HistoryPanel />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400 dark:text-gray-500">
            © 2024 Overtime Calculator Indonesia. Tool untuk penggunaan pribadi dalam menghitung lembur.
          </p>
          <p className="text-gray-500 dark:text-gray-600 text-sm mt-2">
            Perhitungan berdasarkan standar: Gaji Pokok ÷ 173 jam × Multiplier Rate
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;