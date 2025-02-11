'use server'

import { db } from "@/database"
import { auth } from "@clerk/nextjs/server"
import { DailyCounts } from "./types"

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