'use server'

import { db } from "@/database"
import { auth } from "@clerk/nextjs/server"
import { roundToDP } from "../utils"

export async function getTaskCOmpletionRate() {
    const {userId} = await auth()
    if (!userId) return

    const tasks = await db.task.findMany({
        where: { userId: userId },
        select: { startedAt: true, dueDate: true, completedAt: true }
    })

    let completedTasks = 0
    let completedTasksWithinDueDate = 0

    tasks.forEach(task => {
        if(task.completedAt) {
            completedTasks++

            if (task.dueDate && new Date(task.completedAt) <= new Date(task.dueDate)) {
                completedTasksWithinDueDate++
            }
        }
    })

    const totalTasks = tasks.length

    if(totalTasks === 0) {
        return {
            completionRate: 0,
            completionRateWithinDueDate: 0
        }
    }

    const completionRate = (completedTasks / totalTasks ) * 100
    const completionRateWithinDueDate = (completedTasksWithinDueDate / totalTasks) * 100

    return {
        completionRate,
        completionRateWithinDueDate
    }
}