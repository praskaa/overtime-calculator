import { OvertimeCalculation } from '../types/overtime';
import { UserSettings } from '../types/overtime';

export class StorageManager {
  private static readonly STORAGE_KEY = 'overtime_calculations';
  private static readonly SETTINGS_KEY = 'user_settings';

  static saveCalculation(calculation: OvertimeCalculation): void {
    const calculations = this.getAllCalculations();
    calculations.push(calculation);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(calculations));
  }

  static getAllCalculations(): OvertimeCalculation[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  static getCalculationsByDateRange(startDate: string, endDate: string): OvertimeCalculation[] {
    const calculations = this.getAllCalculations();
    return calculations.filter(calc => 
      calc.date >= startDate && calc.date <= endDate
    );
  }

  static deleteCalculation(id: string): void {
    const calculations = this.getAllCalculations().filter(calc => calc.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(calculations));
  }

  static clearAllCalculations(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  static exportToCSV(): string {
    const calculations = this.getAllCalculations();
    
    const headers = [
      'Tanggal',
      'Jam Mulai',
      'Jam Selesai',
      'Gaji Pokok',
      'Jam Range 1',
      'Amount Range 1',
      'Jam Range 2', 
      'Amount Range 2',
      'Jam Range 3',
      'Amount Range 3',
      'Uang Makan',
      'Total Lembur'
    ];

    const rows = calculations.map(calc => [
      calc.date,
      calc.startTime,
      calc.endTime,
      calc.baseSalary.toString(),
      calc.ranges.range1Hours.toString(),
      calc.ranges.range1Amount.toString(),
      calc.ranges.range2Hours.toString(),
      calc.ranges.range2Amount.toString(),
      calc.ranges.range3Hours.toString(),
      calc.ranges.range3Amount.toString(),
      calc.mealAllowance.toString(),
      calc.totalOvertime.toString()
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  static saveUserSettings(settings: UserSettings): void {
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
  }

  static getUserSettings(): UserSettings {
    const data = localStorage.getItem(this.SETTINGS_KEY);
    return data ? JSON.parse(data) : {
      baseSalary: 6000000,
      theme: 'light',
      isSetupComplete: false
    };
  }

  static updateTheme(theme: 'light' | 'dark'): void {
    const settings = this.getUserSettings();
    settings.theme = theme;
    this.saveUserSettings(settings);
  }
}