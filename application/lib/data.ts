'use server'

import { db } from "@/database"
import { auth } from "@clerk/nextjs/server"

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

export async function getHeatMapData() {
    const { userId } = await auth()
    if(!userId) return
}