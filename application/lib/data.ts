'use server'

import { db } from "@/database"

export async function getTags() {
    const tags = await db.tag.findMany({
        orderBy: { id: 'asc' }
    })
    return tags
}

export async function getTasks(){
    const tasks = await db.task.findMany({
        orderBy: { dueDate: 'asc'}
    })
    return tasks
}