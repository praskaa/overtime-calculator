import { CalculationResult } from '../types/overtime';

export class OvertimeCalculator {
  private static readonly WORK_HOURS_PER_MONTH = 173;
  private static readonly MEAL_ALLOWANCE = 20000;

  static calculateOvertime(
    startTime: string,
    endTime: string,
    baseSalary: number
  ): CalculationResult {
    const hourlyRate = baseSalary / this.WORK_HOURS_PER_MONTH;
    
    // Convert time strings to minutes from start of day
    const startMinutes = this.timeToMinutes(startTime);
    const endMinutes = this.timeToMinutes(endTime);
    
    // Handle crossing midnight
    const actualEndMinutes = endMinutes < startMinutes ? endMinutes + 1440 : endMinutes;
    
    // Calculate hours for each range
    const range1Hours = this.calculateRangeHours(startMinutes, actualEndMinutes, 17 * 60, 18 * 60);
    const range2Hours = this.calculateRangeHours(startMinutes, actualEndMinutes, 18 * 60, 19 * 60);
    const range3Hours = this.calculateRangeHours(startMinutes, actualEndMinutes, 19 * 60, 24 * 60) +
                       this.calculateRangeHours(startMinutes, actualEndMinutes, 24 * 60, actualEndMinutes);

    // Calculate amounts
    const range1Amount = range1Hours * hourlyRate * 1.5;
    const range2Amount = range2Hours * hourlyRate * 2.0;
    const range3Amount = range3Hours * hourlyRate * 2.0;
    
    // Meal allowance if working past 19:00
    const mealAllowance = range3Hours > 0 ? this.MEAL_ALLOWANCE : 0;
    
    const totalOvertime = range1Amount + range2Amount + range3Amount + mealAllowance;

    return {
      range1Hours,
      range1Amount: Math.round(range1Amount),
      range2Hours,
      range2Amount: Math.round(range2Amount),
      range3Hours,
      range3Amount: Math.round(range3Amount),
      mealAllowance,
      totalOvertime: Math.round(totalOvertime)
    };
  }

  private static timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private static calculateRangeHours(
    startMinutes: number,
    endMinutes: number,
    rangeStart: number,
    rangeEnd: number
  ): number {
    // Handle midnight crossing for range end
    if (rangeEnd > 1440) {
      rangeEnd = endMinutes;
    }
    
    const effectiveStart = Math.max(startMinutes, rangeStart);
    const effectiveEnd = Math.min(endMinutes, rangeEnd);
    
    if (effectiveStart >= effectiveEnd) return 0;
    
    return Math.round(((effectiveEnd - effectiveStart) / 60) * 4) / 4; // Round to 15-minute intervals
  }

  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  }

  static formatHours(hours: number): string {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    
    if (minutes === 0) {
      return `${wholeHours} jam`;
    }
    
    return `${wholeHours} jam ${minutes} menit`;
  }
}