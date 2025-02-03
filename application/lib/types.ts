import { ReactNode } from "react"

export interface Tag {
    id: number,
    name: string
}

export interface TaskFormProps {
    tags: Tag[]
}

export enum Priority {
    High = 'HIGH',
    Medium = 'MEDIUM',
    Low = 'LOW'
}

export type FormButtonProps = {
    children: ReactNode
    className?: string
    pendingClassName?: string
    successMessage?: string
    errorMessage?: string
    successDuration?: number
    formState?: StartTaskState
    onSuccessEnd?: () => void
}

export type FormStatus = {
    type: 'success' | 'error' | null
    message: string | null
}

export type StartTaskState = {
    success?: boolean
    error?: string
    timeLogId?: number
}