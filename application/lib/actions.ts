'use server'

import { z } from "zod"
import { auth, currentUser } from "@clerk/nextjs/server"
import { db } from "@/database"
import { Priority } from "./types"
import { revalidatePath } from "next/cache"

const taskFormSchema = z.object({
    name: z.string(),
    description: z.string().optional(),
    priority: z.string(),
    tag: z.string()
})

export async function createTask(dueDate: Date, formData:FormData) {
    const validatedTaskSchema = taskFormSchema.safeParse({
        name: formData.get('name'),
        description: formData.get('description'),
        priority: formData.get('priority'),
        tag: formData.get('tag')
    })

    const { userId } = await auth()
    if(!validatedTaskSchema.success || !userId) return
    
    const { name, description, priority, tag } = validatedTaskSchema.data

    const [ userDetails, userExists ] = await Promise.all([
        currentUser(),
        db.user.findUnique({
            where: { id: userId }
        })
    ])

    if(!userDetails) return
    
    if (!userExists) {
        await db.user.create({
            data: {
                id: userId,
                name: userDetails.firstName,
                email: userDetails.primaryEmailAddress?.emailAddress ?? 'no email'
            }
        })
    }

    await db.task.create({
        data: {
            name: name,
            description: description ?? null,
            dueDate: dueDate ? new Date(dueDate) : null,
            priority: priority as Priority,
            userId: userId,
            status: 'PENDING',
        }
    })

    revalidatePath('/')
}