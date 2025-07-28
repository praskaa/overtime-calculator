import React, { useState } from 'react';
import { Calculator, Clock } from 'lucide-react';
import { OvertimeCalculator } from '../utils/overtimeCalculator';
import { CalculationResult } from '../types/overtime';

interface CalculatorFormProps {
  baseSalary: number;
  onCalculate: (result: CalculationResult & { 
    date: string; 
    startTime: string; 
    endTime: string; 
    hourlyRate: number;
  }) => void;
}

export function CalculatorForm({ baseSalary, onCalculate }: CalculatorFormProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('17:00');
  const [endTime, setEndTime] = useState('19:00');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Date validation
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    if (selectedDate > today) {
      newErrors.date = 'Tanggal tidak boleh di masa depan';
    }

    // Time validation
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);
    
    if (startMinutes < 17 * 60) {
      newErrors.startTime = 'Jam mulai lembur tidak boleh sebelum 17:00';
    }

    if (endMinutes <= startMinutes && endMinutes >= 17 * 60) {
      newErrors.endTime = 'Jam selesai harus setelah jam mulai';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const result = OvertimeCalculator.calculateOvertime(startTime, endTime, baseSalary);
    const hourlyRate = baseSalary / 173;

    onCalculate({
      ...result,
      date,
      startTime,
      endTime,
      hourlyRate
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
          <Calculator className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Kalkulator Lembur</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Tanggal
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:bg-gray-700 dark:text-white ${
                errors.date ? 'border-red-300' : 'border-gray-200 dark:border-gray-600'
              }`}
            />
            {errors.date && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.date}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Tarif per Jam
            </label>
            <div className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700">
              <span className="text-gray-900 dark:text-white font-semibold">
                {OvertimeCalculator.formatCurrency(baseSalary / 173)}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">per jam</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Jam Mulai Lembur
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:bg-gray-700 dark:text-white ${
                  errors.startTime ? 'border-red-300' : 'border-gray-200 dark:border-gray-600'
                }`}
              />
            </div>
            {errors.startTime && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.startTime}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Jam Selesai Lembur
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:bg-gray-700 dark:text-white ${
                  errors.endTime ? 'border-red-300' : 'border-gray-200 dark:border-gray-600'
                }`}
              />
            </div>
            {errors.endTime && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.endTime}</p>}
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Aturan Perhitungan:</h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• Tarif per jam: Gaji Pokok ÷ 173 jam</li>
            <li>• 17:00-18:00: 1.5x tarif normal</li>
            <li>• 18:00-19:00: 2x tarif normal</li>
            <li>• 19:00 ke atas: 2x tarif normal</li>
            <li>• Uang makan: +Rp 20.000 jika lembur sampai/melewati jam 19:00</li>
          </ul>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Hitung Lembur
        </button>
      </form>
    </div>
  );
}