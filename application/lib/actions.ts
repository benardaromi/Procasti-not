'use server'

import { z } from "zod"
import { auth, currentUser } from "@clerk/nextjs/server"
import { db } from "@/database"
import { DeleteTaskState, Priority, StartTaskState } from "./types"
import { revalidatePath } from "next/cache"
import { Status } from "@prisma/client"

const taskFormSchema = z.object({
    name: z.string(),
    description: z.string().optional(),
    priority: z.string(),
    dueDate: z.string()
})

const startTaskFormSchema = z.object({
    taskId: z.coerce.number().min(1)
})

const endTaskFormSchema = z.object({
    taskId: z.coerce.number().min(1)
})

const deleteTaskFormSchema = z.object({
    taskID: z.coerce.number().min(1)
})

export async function deleteTask(currentState: DeleteTaskState, formData: FormData) 
    : Promise<DeleteTaskState> {
    try {
        const parsedTaskId = deleteTaskFormSchema.safeParse({
            taskID: formData.get('taskID')
        })
        
        if(!parsedTaskId.success) return { 
            success: false, 
            error: 'Missing To-do ID!'
        }
        
        const { taskID } = parsedTaskId.data

        await db.task.delete({
            where: { id: taskID }
        })

        revalidatePath('/')
        return  { success: true }

    } catch (error) {
        // console.log('Failed to delete task:', error)  
        return {
            error: 'Internal server error',
            success: false
        }
    }
}

export async function createTask(prevState: StartTaskState, formData: FormData) : Promise<StartTaskState> {
    try {
        const validatedTaskSchema = taskFormSchema.safeParse({
            name: formData.get('name'),
            description: formData.get('description'),
            priority: formData.get('priority'),
            dueDate: formData.get('dueDate')
        })
        
        if(!validatedTaskSchema.success) return {
            error: validatedTaskSchema.error.errors.map(e => e.message).join(', '),
            success: false
        }

        console.log()

        const { userId } = await auth()
        if (!userId) return { 
            error: 'User not authenticated', 
            success: false 
        }

        const { name, description, priority, dueDate } = validatedTaskSchema.data

        const [ userDetails, userExists ] = await Promise.all([
            currentUser(),
            db.user.findUnique({
                where: { id: userId }
            })
        ])

        if(!userDetails) return {
            error: 'User not found',
            success: false
        }

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
                dueDate: new Date(dueDate) ?? null,
                priority: priority as Priority,
                userId: userId,
                status: 'PENDING',
                startedAt: null,
                completedAt: null,
            }
        })

        revalidatePath('/')
        return { success: true }

    } catch (error) {
        console.error('Failed to start task:', error)
        return {
            error: 'Internal server error',
            success: false
        }
    }
}


export async function endTask(prevState: StartTaskState, formData: FormData) : Promise<StartTaskState> {
    try {
        const parsedTaskId = endTaskFormSchema.safeParse({
            taskId: formData.get('taskId')
        })

        if (!parsedTaskId.success) {
            return { 
                error: parsedTaskId.error.errors.map(e => e.message).join(', '),
                success: false
            }
        }

        const { userId } = await auth()
        if (!userId) return { 
            error: 'User not authenticated', 
            success: false 
        }

        const { taskId } = parsedTaskId.data

        const task = await db.task.findUnique({
            where: {
                id: taskId,
                userId: userId
            }
        })

        if (!task) return {
            error: 'Task not found', 
            success: false
        }

        const timeLog = await db.timeLog.findFirst({
            where: {
                taskId: taskId,
                userId: userId,
                endedAt: null
            }
        })

        if (!timeLog) return {
            error: 'Task not started',
            success: false
        }

        await db.timeLog.update({
            where: { id: timeLog.id },
            data: { endedAt: new Date() }
        })

        await db.timeLog.create({
            data: {
                userId: userId,
                updatedAt: new Date(),
                taskId: task.id,
                startedAt: timeLog.startedAt
            }
        })

        await db.task.update({
            where: { id: taskId },
            data: { 
                status: Status.COMPLETED,
                updatedAt: new Date(),
                completedAt: new Date()
            }
        })

        revalidatePath('/')
        return {
            success: true,
        }
    } catch (error) {
        console.error('Failed to end task:', error)
        return {
            error: 'Internal server error',
            success: false
        }
    }
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

        if (!task) return {
            error: 'Task not found', 
            success: false
        }

        // create new timelog
        await db.timeLog.create({
            data: {
                startedAt: new Date(),
                taskId: taskId,
                userId: userId,
                updatedAt: new Date()
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