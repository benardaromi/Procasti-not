"use client"

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { groupByTimeOfDay } from "@/lib/utils"


const chartConfig = {
  desktop: {
    label: "tasks",
    color: "#03A9F4",
  },
} satisfies ChartConfig

export function HourlyActivity(
{data} : {data: { hour: string; tasks: number }[]}) {
  
  const processsedData = groupByTimeOfDay(data)

  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle>Productivity Chart</CardTitle>
        <CardDescription>
          Showing lifetime productivity
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadarChart data={processsedData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="timeOfDay" />
            <PolarGrid />
            <Radar
              dataKey="tasks"
              fill="#03A9F4"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ChartContainer>
        <CardFooter></CardFooter>
      </CardContent>
    </Card>
  )
}
