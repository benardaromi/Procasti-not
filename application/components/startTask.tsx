'use client'

import { startTaskAction } from "@/lib/actions"
import Form from "next/form"
import FormButton from "./formButton"
import { PlayIcon } from "./playIcon"
import { useActionState } from "react"
import { StartTaskState } from "@/lib/types"

export default function StartTask({ taskId }: {
    taskId: number }, 
){
    const [state, formAction] = useActionState(startTaskAction, {
        success: false,
        error: undefined
    } as StartTaskState)

    return (
        <Form action={formAction}>
            <input type="hidden" name="taskId" value={taskId} />
            <FormButton
                errorMessage={state?.error}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                pendingClassName="bg-emerald-300 px-4 py-2"
                formState={state}
            >
                <PlayIcon className="w-4 h-4" />
                Start Task
            </FormButton>
        </Form>
    )
}