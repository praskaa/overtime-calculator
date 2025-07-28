import React, { useState, useEffect } from 'react';
import { History, Trash2, Download, Calendar, Filter } from 'lucide-react';
import { StorageManager } from '../utils/storage';
import { OvertimeCalculator } from '../utils/overtimeCalculator';
import { OvertimeCalculation } from '../types/overtime';

export function HistoryPanel() {
  const [calculations, setCalculations] = useState<OvertimeCalculation[]>([]);
  const [filter, setFilter] = useState<'all' | 'week' | 'month'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

  useEffect(() => {
    loadCalculations();
  }, [filter]);

  const loadCalculations = () => {
    let data = StorageManager.getAllCalculations();
    
    if (filter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      data = data.filter(calc => new Date(calc.date) >= weekAgo);
    } else if (filter === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      data = data.filter(calc => new Date(calc.date) >= monthAgo);
    }

    // Sort data
    data.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return b.totalOvertime - a.totalOvertime;
      }
    });

    setCalculations(data);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Yakin ingin menghapus data ini?')) {
      StorageManager.deleteCalculation(id);
      loadCalculations();
    }
  };

  const handleExportCSV = () => {
    const csv = StorageManager.exportToCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `overtime-history-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getTotalSummary = () => {
    const total = calculations.reduce((sum, calc) => sum + calc.totalOvertime, 0);
    const totalHours = calculations.reduce((sum, calc) => 
      sum + calc.ranges.range1Hours + calc.ranges.range2Hours + calc.ranges.range3Hours, 0
    );
    return { total, totalHours };
  };

  const { total, totalHours } = getTotalSummary();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-xl">
            <History className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Riwayat Perhitungan</h2>
        </div>
        
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 bg-green-600 dark:bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-6">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Total Hari</h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{calculations.length}</p>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-6">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Total Jam</h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">{totalHours.toFixed(1)}</p>
        </div>
        
        <div className="bg-purple-50 dark:bg-purple-900/30 rounded-xl p-6">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Total Nominal</h3>
          <p className="text-xl font-bold text-purple-600 dark:text-purple-400">{OvertimeCalculator.formatCurrency(total)}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'week' | 'month')}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">Semua</option>
            <option value="week">7 Hari Terakhir</option>
            <option value="month">30 Hari Terakhir</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="date">Urutkan Tanggal</option>
            <option value="amount">Urutkan Nominal</option>
          </select>
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {calculations.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <History className="w-12 h-12 mx-auto mb-4 opacity-50 dark:text-gray-400" />
            <p>Belum ada data perhitungan</p>
          </div>
        ) : (
          calculations.map((calc) => (
            <div key={calc.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {new Date(calc.date).toLocaleDateString('in-ID', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {calc.startTime} - {calc.endTime}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">
                      {OvertimeCalculator.formatCurrency(calc.totalOvertime)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {OvertimeCalculator.formatHours(
                        calc.ranges.range1Hours + calc.ranges.range2Hours + calc.ranges.range3Hours
                      )}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => handleDelete(calc.id)}
                    className="p-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3">
                  <p className="text-gray-600 dark:text-gray-400">Range 1</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{OvertimeCalculator.formatCurrency(calc.ranges.range1Amount)}</p>
                </div>
                
                <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-3">
                  <p className="text-gray-600 dark:text-gray-400">Range 2</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{OvertimeCalculator.formatCurrency(calc.ranges.range2Amount)}</p>
                </div>
                
                <div className="bg-red-50 dark:bg-red-900/30 rounded-lg p-3">
                  <p className="text-gray-600 dark:text-gray-400">Range 3</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{OvertimeCalculator.formatCurrency(calc.ranges.range3Amount)}</p>
                </div>
              </div>
              
              {calc.mealAllowance > 0 && (
                <div className="mt-4 bg-orange-50 dark:bg-orange-900/30 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Uang Makan</span>
                    <span className="font-semibold text-orange-600 dark:text-orange-400">
                      {OvertimeCalculator.formatCurrency(calc.mealAllowance)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}