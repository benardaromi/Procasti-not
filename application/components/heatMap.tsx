import { getHeatMapData } from "@/lib/data";
import { DailyCounts } from "@/lib/types";
import { generateDateGrid, getColorIntensity, getMonthLabels, getWeekdayLabels, groupDatesByWeeks } from "@/lib/utils";


export async function HeatMap() {
  const data = await getHeatMapData() as DailyCounts
  const dateGrid = generateDateGrid();
  const monthLabels = getMonthLabels(dateGrid);
  const weekDayLabels = getWeekdayLabels();

  // Merge the data into the grid
  Object.entries(data).forEach(([date, count]) => {
    if (dateGrid[date] !== undefined) {
      dateGrid[date] = count;
    }
  });


  // Group dates by day of the week
  const daysGroupedByWeekday: number[][] = Array(7).fill(null).map(() => []);

  Object.entries(dateGrid).forEach(([date, count]) => {
    const dayOfWeek = new Date(date).getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    daysGroupedByWeekday[dayOfWeek].push(count);
  });

  const cellSize = "0.86rem"

  return (
    <div className="overflow-x-auto border border-gray-400 p-2 rounded-md">
      {/* Month Labels */}
      <div className="ml-8 flex justify-between w-full ">
        {monthLabels.map((month, index) => (
          <div
            key={index}
            className="flex-grow text-center text-xs sm:text-sm md:text-base"
            // style={{ width: cellSize }} 
          >
            {month}
          </div>
        ))}
      </div>

      {/* Heatmap Grid */}
      <div className="flex">
        {/* Weekday Labels */}
        <div className="flex flex-col mr-2">
          {weekDayLabels.map((day, index) => (
            <div
              key={index}
              className="text-xs sm:text-sm md:text-base text-right flex items-center justify-end"
              style={{ height: cellSize }} 
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days as Rows (Grouped by Weekday) */}
        <div className="flex flex-col gap-[0.1rem]">
          {daysGroupedByWeekday.map((dayData, dayIndex) => (
            <div key={dayIndex} className="flex gap-[0.1rem]">
              {dayData.map((count, countIndex) => (
                <div
                  key={`${dayIndex}-${countIndex}`}
                  className="rounded-sm"
                  style={{
                    width: cellSize,
                    height: cellSize,
                    backgroundColor: getColorIntensity(count),
                  }}
                  title={`${count} logs`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}