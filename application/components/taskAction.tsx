'use client'

import Form from 'next/form'
import { Input } from './ui/input'
import { useActionState, useEffect, useState } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import { LucideIcon } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface TaskActionProps {
    taskID: number,
    action: ( 
        prevState: any, formData: FormData ) => Promise<{ 
        error?: string, success: boolean }>,
    successTitle?: string,
    successDescription: string,
    toolTipDescription: string,
    alertDialogTitle: string,
    alertDialogDescription: string,
    icon: LucideIcon
} 

export function TaskAction({ 
    taskID, 
    action, 
    successTitle, 
    successDescription, 
    toolTipDescription, 
    alertDialogTitle, 
    alertDialogDescription,
    icon: Icon
    } : TaskActionProps) 
{
    const [formState, formAction, isPending] = useActionState(action, {
        error: undefined,
        success: false,
    })

    const { toast } = useToast()
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (formState.success) {
            toast({
                title: successTitle ?? 'Success! 😁',
                description: successDescription,
                duration: 3000
            })
            setOpen(false)
        }

        if (formState.error) {
            toast({
                title: 'Uh oh! 😐 Something went wrong',
                description: formState.error,
                variant: 'destructive',
                duration: 3000
            })
        }
    }, [formState, setOpen])

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <span className="hover:bg-white/30 rounded-full p-1.5 transition">
                <TooltipProvider>
                    <Tooltip>
                    <TooltipTrigger asChild>
                        <Icon className="size-6 hover:cursor-pointer text-gray-300 hover:text-white transition"/> 
                    </TooltipTrigger>
                    <TooltipContent>
                        {toolTipDescription}
                    </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                </span>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>{alertDialogTitle}</AlertDialogTitle>
                <AlertDialogDescription>
                    {alertDialogDescription}
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Form action={formAction}>
                        <Input type="hidden" value={taskID} name="taskId"/>
                        <AlertDialogAction type="submit" className="w-full">
                            Continue
                        </AlertDialogAction>
                    </Form>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}