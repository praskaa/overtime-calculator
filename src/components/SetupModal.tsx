import React, { useState } from 'react';
import { Settings, DollarSign, Eye, EyeOff, Shield } from 'lucide-react';

interface SetupModalProps {
  isOpen: boolean;
  onComplete: (baseSalary: number) => void;
}

export function SetupModal({ isOpen, onComplete }: SetupModalProps) {
  const [baseSalary, setBaseSalary] = useState(6000000);
  const [showSalary, setShowSalary] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (baseSalary <= 0) {
      newErrors.baseSalary = 'Gaji pokok harus lebih dari 0';
    }

    if (baseSalary > 999999999) {
      newErrors.baseSalary = 'Gaji pokok maksimal Rp 999.999.999';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    onComplete(baseSalary);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
            <Settings className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Setup Awal</h2>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                Privasi Terjamin
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-200">
                Gaji pokok Anda disimpan secara lokal di perangkat dan tidak akan ditampilkan 
                di interface untuk menjaga privasi.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Gaji Pokok Bulanan
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showSalary ? "number" : "password"}
                value={baseSalary}
                onChange={(e) => setBaseSalary(Number(e.target.value))}
                className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.baseSalary ? 'border-red-300' : 'border-gray-200 dark:border-gray-600'
                }`}
                placeholder="6000000"
              />
              <button
                type="button"
                onClick={() => setShowSalary(!showSalary)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showSalary ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.baseSalary && <p className="text-red-600 text-sm mt-1">{errors.baseSalary}</p>}
            
            {showSalary && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Tarif per jam: {formatCurrency(baseSalary / 173)}
              </p>
            )}
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
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
            Mulai Menggunakan Kalkulator
          </button>
        </form>
      </div>
    </div>
  );
}