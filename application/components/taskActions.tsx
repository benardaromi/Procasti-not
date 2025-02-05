'use client'

import { Tooltip } from "@radix-ui/react-tooltip";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Trash2 } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import Form from "next/form";
import { deleteTask } from "@/lib/actions";
import { Input } from "./ui/input";
import { Alert, AlertTitle } from "./ui/alert";
import { useToast } from "@/hooks/use-toast";

export default function TaskActions({ taskID }: {taskID:number}) {
    const [formState, formAction, isPending] = useActionState(deleteTask, {
        error: undefined,
        success: false,
    })

    const { toast } = useToast()
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (formState.success) {
            toast({
                title: 'Success! 😁',
                description: 'To-do deleted permanently',
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
                <span className="hover:bg-white/30 rounded-full p-1 transition">
                <TooltipProvider>
                    <Tooltip>
                    <TooltipTrigger asChild>
                        <Trash2 className="size-4 hover:cursor-pointer"/> 
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Delete to-do</p>
                    </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                </span>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the task.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Form action={formAction}>
                    <Input type="hidden" value={taskID} name="taskID"/>
                    <AlertDialogAction type="submit" className="w-full">
                        Continue
                    </AlertDialogAction>
                </Form>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}