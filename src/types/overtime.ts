export interface OvertimeCalculation {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  baseSalary: number;
  hourlyRate: number;
  ranges: {
    range1Hours: number;
    range1Amount: number;
    range2Hours: number;
    range2Amount: number;
    range3Hours: number;
    range3Amount: number;
  };
  mealAllowance: number;
  totalOvertime: number;
  createdAt: string;
}

export interface OvertimeSummary {
  totalHours: number;
  totalAmount: number;
  totalDays: number;
  averagePerDay: number;
  highestDay: number;
  mealAllowanceTotal: number;
}

export interface CalculationResult {
  range1Hours: number;
  range1Amount: number;
  range2Hours: number;
  range2Amount: number;
  range3Hours: number;
  range3Amount: number;
  mealAllowance: number;
  totalOvertime: number;
}

export interface UserSettings {
  baseSalary: number;
  theme: 'light' | 'dark';
  isSetupComplete: boolean;
}