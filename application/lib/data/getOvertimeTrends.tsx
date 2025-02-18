'use server'

import { db } from "@/database"
import { auth } from "@clerk/nextjs/server"

export async function getOvertimeTrends() {
    const { userId } = await auth()
    if (!userId) return

    const tasks = await db.task.findMany({
        where: { userId: userId },
        include: { timeLogs: true }
    })

    const overDuetasks = tasks.map(task => {
        const totalLoggedTime = task.timeLogs.reduce((sum, log) => {
            const start = new Date(log.startedAt).getTime()
            const end = log.endedAt ? new Date(log.endedAt).getTime() : Date.now()

            return sum + (end - start)
        }, 0)

        const dueDate = new Date(task.dueDate).getTime()
        const isOvertime = totalLoggedTime > dueDate

        return {
            taskId: task.id,
            taskName: task.name,
            totalLoggedTime,
            dueDate,
            isOvertime,
        };
    })

    // console.log(overDuetasks)
}