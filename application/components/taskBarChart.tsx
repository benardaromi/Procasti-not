"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"

import {
    Card,
    CardContent,
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
import { format } from "date-fns"
import { useEffect, useState } from "react"
import { getPastYearTasks, getYearOptions } from "@/lib/data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

interface chartData {
    month: string
    totalTasks: number
} 

const chartConfig = {
    desktop: {
        label: "Tasks",
        color: "#03A9F4",
    },
} satisfies ChartConfig

export function TaskBarChart({years}: {years: string[]}) {
    const [activeYear, setActiveYear] = useState(format(new Date(), 'yyyy'))
    const [chartData, setChartData] = useState<chartData[]>([])

    useEffect(() => {
        const getData = async () => {
            const [ data ] = await Promise.all([
                getPastYearTasks(activeYear),
            ])
            setChartData(data ?? [])
        }
        getData()
    }, [activeYear])

    return (
        <Card>
        <CardHeader className="items-center flex flex-row">
            <CardTitle>Task Completion</CardTitle>
            <Select value={activeYear} onValueChange={setActiveYear}>
                <SelectTrigger
                    className="ml-auto h-7 w-[130px] rounded-lg pl-2.5"
                    aria-label="Select a value"
                >
                    <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent align="end" className="rounded-xl">
                    {years.map((year) => {
                    return (
                        <SelectItem
                        key={year}
                        value={year}
                        className="rounded-lg [&_span]:flex"
                        >
                        <div className="flex items-center gap-2 text-xs">
                            <span
                            className="flex h-3 w-3 shrink-0 rounded-sm"
                            style={{
                                backgroundColor: `var(--color-${year})`,
                            }}
                            />
                            {year}
                        </div>
                        </SelectItem>
                    )
                    })}
                </SelectContent>
            </Select>
        </CardHeader>
        <CardContent>
            <ChartContainer config={chartConfig}>
            <BarChart
                accessibilityLayer
                data={chartData}
                margin={{
                top: 20,
                }}
            >
                <CartesianGrid vertical={false} />
                <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="totalTasks" fill="var(--color-desktop)" radius={8}>
                <LabelList
                    dataKey={"totalTasks"}
                    position="top"
                    offset={12}
                    className="fill-foreground"
                    fontSize={12}
                />
                </Bar>
            </BarChart>
            </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="leading-none text-muted-foreground">
            Showing total tasks completed for the past year
            </div>
        </CardFooter>
        </Card>
    )
}
