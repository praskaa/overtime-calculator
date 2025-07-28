import React from 'react';
import { TrendingUp, Clock, Utensils } from 'lucide-react';
import { OvertimeCalculator } from '../utils/overtimeCalculator';
import { CalculationResult as CalculationResultType } from '../types/overtime';

interface CalculationResultProps {
  result: CalculationResultType & {
    date: string;
    startTime: string;
    endTime: string;
    hourlyRate: number;
  };
  onSave: () => void;
}

export function CalculationResult({ result, onSave }: CalculationResultProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-green-100 dark:bg-green-900 rounded-xl">
            <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Hasil Perhitungan</h2>
        </div>
        
        <div className="text-right">
          <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(result.date).toLocaleDateString('id-ID')}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{result.startTime} - {result.endTime}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-6">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Informasi Dasar</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Tarif per Jam:</span>
              <span className="font-semibold text-gray-900 dark:text-white">{OvertimeCalculator.formatCurrency(result.hourlyRate)}</span>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/30 rounded-xl p-6">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Total Durasi</h3>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <span className="text-lg font-bold text-amber-800 dark:text-amber-200">
              {OvertimeCalculator.formatHours(result.range1Hours + result.range2Hours + result.range3Hours)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <h4 className="font-semibold mb-2">Range 1 (17:00-18:00)</h4>
          <p className="text-blue-100 text-sm mb-2">Multiplier: 1.5x</p>
          <div className="space-y-1">
            <p className="text-sm">{OvertimeCalculator.formatHours(result.range1Hours)}</p>
            <p className="text-xl font-bold">{OvertimeCalculator.formatCurrency(result.range1Amount)}</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <h4 className="font-semibold mb-2">Range 2 (18:00-19:00)</h4>
          <p className="text-purple-100 text-sm mb-2">Multiplier: 2.0x</p>
          <div className="space-y-1">
            <p className="text-sm">{OvertimeCalculator.formatHours(result.range2Hours)}</p>
            <p className="text-xl font-bold">{OvertimeCalculator.formatCurrency(result.range2Amount)}</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white">
          <h4 className="font-semibold mb-2">Range 3 (19:00+)</h4>
          <p className="text-red-100 text-sm mb-2">Multiplier: 2.0x</p>
          <div className="space-y-1">
            <p className="text-sm">{OvertimeCalculator.formatHours(result.range3Hours)}</p>
            <p className="text-xl font-bold">{OvertimeCalculator.formatCurrency(result.range3Amount)}</p>
          </div>
        </div>
      </div>

      {result.mealAllowance > 0 && (
        <div className="bg-orange-50 dark:bg-orange-900/30 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3">
            <Utensils className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200">Uang Makan</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Bonus karena lembur sampai/melewati jam 19:00</p>
            </div>
            <div className="ml-auto">
              <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {OvertimeCalculator.formatCurrency(result.mealAllowance)}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">Total Lembur</h3>
            <p className="text-green-100 text-sm">
              Sudah termasuk {result.mealAllowance > 0 ? 'dengan' : 'tanpa'} uang makan
            </p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold">{OvertimeCalculator.formatCurrency(result.totalOvertime)}</p>
          </div>
        </div>
      </div>

      <button
        onClick={onSave}
        className="w-full mt-6 bg-gray-800 dark:bg-gray-700 text-white font-semibold py-4 px-6 rounded-xl hover:bg-gray-900 dark:hover:bg-gray-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        Simpan Perhitungan
      </button>
    </div>
  );
}