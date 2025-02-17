"use client"

import {
    Label,
    PolarGrid,
    PolarRadiusAxis,
    RadialBar,
    RadialBarChart,
} from "recharts"

import {
    Card,
    CardContent,

    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"



const chartConfig = {
    visitors: {
        label: "Visitors",
    },
    safari: {
        label: "Safari",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig

export function TimeSpent({data} : {data: number}) {
    const chartData = [
        { browser: "safari", visitors: data, fill: "#03A9F4" },
    ]

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Average Time Spent</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square max-h-[250px]"
                >
                <RadialBarChart
                    data={chartData}
                    startAngle={0}
                    endAngle={250}
                    innerRadius={80}
                    outerRadius={110}
                >
                    <PolarGrid
                    gridType="circle"
                    radialLines={false}
                    stroke="none"
                    className="first:fill-muted last:fill-background"
                    polarRadius={[86, 74]}
                    />
                    <RadialBar dataKey="visitors" background cornerRadius={10} />
                    <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                    <Label
                        content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                            return (
                            <text
                                x={viewBox.cx}
                                y={viewBox.cy}
                                textAnchor="middle"
                                dominantBaseline="middle"
                            >
                                <tspan
                                x={viewBox.cx}
                                y={viewBox.cy}
                                className="fill-foreground text-4xl font-bold"
                                >
                                {chartData[0].visitors.toLocaleString()}
                                </tspan>
                                <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 24}
                                className="fill-muted-foreground"
                                >
                                Hours
                                </tspan>
                            </text>
                            )
                        }
                        }}
                    />
                    </PolarRadiusAxis>
                </RadialBarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col text-sm">
                <div className="leading-none text-muted-foreground">
                Showing average time spent on tasks
                </div>
            </CardFooter>
        </Card>
    )
}
