'use server'

import { z } from "zod"
import { auth, currentUser } from "@clerk/nextjs/server"
import { db } from "@/database"
import { Priority, StartTaskState } from "./types"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { Status } from "@prisma/client"

const taskFormSchema = z.object({
    name: z.string(),
    description: z.string().optional(),
    priority: z.string(),
    tag: z.string()
})

const startTaskFormSchema = z.object({
    taskId: z.coerce.number().min(1, 'Task ID is required')
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
            startedAt: null
        }
    })

    revalidatePath('/')
    redirect('/')
}

export async function startTaskAction( 
    prevState: StartTaskState, 
    formData: FormData 
) : Promise<StartTaskState> {
    try {
        const parsedTaskId = startTaskFormSchema.safeParse({
            taskId: formData.get('taskId')
        })

        if (!parsedTaskId.success) {
            return { 
                error: parsedTaskId.error.errors.map(e => e.message).join(', '),
                success: false
            }
        }
        
        // Authentication check
        const { userId } = await auth()
        if ( !userId ) return { 
            error: 'User not authenticated', 
            success: false 
        }
        
        const { taskId } = parsedTaskId.data

        // Verify task exists and belongs to user
        const task = await db.task.findUnique({
            where: {
                id: taskId,
                userId: userId
            }
        })

        console.log('uniq task ok', taskId)

        if (!task) return {
            error: 'Task not found', 
            success: false
        }

        // create new timelog
        await db.timeLog.create({
            data: {
                startedAt: new Date(),
                taskId: taskId,
                userId: userId
            }
        })

        // Update task status if it's pending
        if (task.status === Status.PENDING) {
            await db.task.update({
                where: { id: taskId },
                data: { 
                    status: Status.IN_PROGRESS,
                    updatedAt: new Date(),
                    startedAt: task.startedAt ? task.startedAt : new Date() 
                }
            })
        }

        revalidatePath('/')
        
        return {
            success: true,
        }
    } catch (error) {
        console.error('Failed to start task:', error)
        return {
            error: 'Internal server error',
            success: false
        }
    }
}