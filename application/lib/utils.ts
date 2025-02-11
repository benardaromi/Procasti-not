import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getColorIntensity(count: number) {
  if (count === 0) return '#ebedf0';   // No activity
  if (count <= 2) return '#81D4FA';    // Low
  if (count <= 3) return '#03A9F4';    // Medium
  if (count <= 5) return '#0288D1';    // High
  return '#001F3F'
}

function isLeapYear(year: number) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function generateDateGrid() {
  const grid: Record<string, number> = {};
  const today = new Date();
  const startDate = new Date(today);
  startDate.setFullYear(today.getFullYear() - 1);

  // Generate dates from startDate to today (inclusive)
  let currentDate = new Date(startDate);
  while (currentDate <= today) {
    const dateKey = currentDate.toISOString().split('T')[0];
    grid[dateKey] = 0;
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return grid;
}



export function getMonthLabels(dateGrid: Record<string, number>) {
  const months: string[] = [];
  let currentMonth = '';

  Object.keys(dateGrid).forEach((dateKey) => {
    const month = new Date(dateKey).toLocaleString('default', { month: 'short' });
    if (month !== currentMonth) {
      months.push(month);
      currentMonth = month;
    }
  });

  return months;
}

export function getWeekdayLabels() {
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return weekdays;
}

export function groupDatesByWeeks(dateGrid: Record<string, number>) {
  const dates = Object.keys(dateGrid).sort();
  const weeks: number[][] = [];
  let currentWeek: number[] = [];

  dates.forEach((dateKey) => {
    const dayOfWeek = new Date(dateKey).getDay(); // 0 = Sunday
    
    // Start new week on Sundays
    if (dayOfWeek === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    
    currentWeek.push(dateGrid[dateKey]);
  });

  // Add the final week
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return weeks;
}