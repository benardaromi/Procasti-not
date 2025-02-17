'use server'

import { db } from "@/database"
import { auth } from "@clerk/nextjs/server"
import { DailyCounts } from "./types"
import { differenceInHours, endOfYear, format, getMonth, getYear, startOfDay } from "date-fns"
import { object } from "zod"

export async function getTags() {
    const tags = await db.tag.findMany({
        orderBy: { id: 'asc' }
    })
    return tags
}

export async function getTasks(){
    const { userId}  = await auth()

    if(!userId) return
    const tasks = await db.task.findMany({
        where: { 
            userId: userId,
            completedAt: null 
        },
        orderBy: { dueDate: 'asc'}
    })
    return tasks
}

export async function getCompletedTasks(){
    const { userId } = await auth()
    
    if(!userId) return
    const tasks = await db.task.findMany({
        where: { userId: userId, },
        orderBy: { dueDate: 'asc'}
    })
    return tasks
}

export async function getAverageTimeSpentOnTasks() {
    const { userId } = await auth()
    if(!userId) return
    let timeInHours = 0

    const tasks = await db.task.findMany({
        where: { userId: userId, status: 'COMPLETED' },
        select: { startedAt: true, completedAt: true }
    })

    tasks.forEach((task) => {
        if (task.completedAt && task.startedAt) {
            const duration = differenceInHours(new Date(task.completedAt), new Date(task.startedAt))
            timeInHours += duration
        }
    })

    const averageTimeInHours = tasks.length ? timeInHours / tasks.length : 0
    return averageTimeInHours
}

export async function getCompletedTaskCount() {
    const { userId } = await auth()
    if(!userId) return

    const count = await db.task.count({
        where: { userId: userId, completedAt: { not: null } }
    })
    return count
}

// timelog data for the past year
export async function getHeatMapData() {
    const { userId } = await auth()
    
    if( !userId ) return
    const logs = await db.timeLog.findMany({
        where: {
            userId,
            startedAt: { // filter data from the past year
                gte: new Date( new Date().setFullYear(new Date().getFullYear() - 1))
            }
        },
        select: { startedAt: true }
    })

    // Group logs by day and count
    const dailyCounts = logs.reduce((accumulator, log) => {
        const date = log.startedAt.toISOString().split('T')[0];
        accumulator[date] = (accumulator[date] || 0) + 1;
        
        return accumulator
    },{} as DailyCounts )


    return dailyCounts
}

export async function getPastYearTasks(selectedYear: string)  {
    const { userId } = await auth()
    if ( !userId )  return

    const firstDayOfYear = startOfDay(new Date(selectedYear))
    const lasDayOfYear = endOfYear(firstDayOfYear)

    const tasks = await db.task.findMany({
        where: {
            userId: userId,
            status: 'COMPLETED',
            completedAt: {
                gte: firstDayOfYear,
                lte: lasDayOfYear
            }
        },
        select: { completedAt: true }
    })

    const monthTasksMap: {[month: string]: number} = {}

    tasks.forEach((task) => {
        if(task.completedAt) {
            // Returns month index (0 for January, 1 for February,)
            const monthIndex = getMonth(new Date(task.completedAt))
            const monthName = format(new Date(task.completedAt), 'MMMM')

            if(!monthTasksMap[monthName]) {
                monthTasksMap[monthName] = 0
            }

            monthTasksMap[monthName] += 1
        }
    })

    // Convert map to array of objects
    const tasksByMonth = Object.keys(monthTasksMap).map((month) => ({
        month,
        totalTasks: monthTasksMap[month],
    }))

    return tasksByMonth
}

export async function  getYearOptions() {
    const {userId } = await auth()
    if (!userId) return

    // earliest completed task
    const oldestTask = await db.task.findFirst({
        where: { userId: userId, status: 'COMPLETED' },
        orderBy: { completedAt: 'asc'},
        select: { completedAt: true }
    })

    if (!oldestTask || !oldestTask.completedAt) return []

    const oldestYear = getYear(new Date(oldestTask.completedAt))
    const currentYear = getYear(new Date())

    // array of years oldest to current
    const yearOptions = []
    for (let year = oldestYear; year <= currentYear; year++) {
        yearOptions.push(year.toString())
    }

    return yearOptions
}

export async function getPeakProductivityHours() {
    const {userId } = await auth()
    if (!userId) return

    const timeLogs = await db.timeLog.findMany({
        where: { userId: userId },
        select: { startedAt: true }
    })

    const hourLabels = [
        "12am", "1am", "2am", "3am", "4am", "5am", "6am", "7am", "8am", "9am", "10am", "11am",
        "12pm", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm", "7pm", "8pm", "9pm", "10pm", "11pm"
    ]

    // Group by hour
    const hourlyActivity = hourLabels.map(label => ({ [label]: 0 }))

    timeLogs.forEach(log => {
        const hour = new Date(log.startedAt).getHours()
        const label = hourLabels[hour]
        hourlyActivity[hour][label]++
    })
    
    const transformedData = hourlyActivity.map(entry => {
        const [hour, tasks] = Object.entries(entry)[0]
        return { hour, tasks }
    })

    return transformedData
}