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

export function groupByTimeOfDay(hourlyActivity: { [hour: string]: number }[]) {
  const groupedActivity = {
      lateNight: 0,
      morning: 0,
      afternoon: 0,
      evening: 0,
      night: 0,
  };

  // Helper function to convert 12-hour format to 24-hour format
  const convertTo24Hour = (hour: string) => {
      const period = hour.slice(-2); // Get 'am' or 'pm'
      let hourNum = parseInt(hour); // Convert hour to number

      if (period === 'pm' && hourNum !== 12) {
          hourNum += 12; // Convert pm to 24-hour time
      } else if (period === 'am' && hourNum === 12) {
          hourNum = 0; // Midnight case
      }

      return hourNum;
  };

  hourlyActivity.forEach((activity) => {
      const [hourString] = Object.keys(activity);
      const tasks = Object.values(activity)[0];

      const hourNum = convertTo24Hour(hourString);

      if (hourNum >= 0 && hourNum < 5) {
          groupedActivity.lateNight += tasks;
      } else if (hourNum >= 5 && hourNum < 12) {
          groupedActivity.morning += tasks;
      } else if (hourNum >= 12 && hourNum < 17) {
          groupedActivity.afternoon += tasks;
      } else if (hourNum >= 17 && hourNum < 21) {
          groupedActivity.evening += tasks;
      } else if (hourNum >= 21 && hourNum <= 23) {
          groupedActivity.night += tasks;
      }
  });

  return [
      { timeOfDay: "Late Night", tasks: groupedActivity.lateNight },
      { timeOfDay: "Morning", tasks: groupedActivity.morning },
      { timeOfDay: "Afternoon", tasks: groupedActivity.afternoon },
      { timeOfDay: "Evening", tasks: groupedActivity.evening },
      { timeOfDay: "Night", tasks: groupedActivity.night },
  ];
}

export function roundToDP(value: number, decimalPlaces: number): number {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(value * factor) / factor;
}
