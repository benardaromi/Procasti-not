'use client'

import { Tooltip } from "@radix-ui/react-tooltip";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Play } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import Form from "next/form";
import { Input } from "./ui/input";
import { useToast } from "@/hooks/use-toast";
import { endTask } from "@/lib/actions";

export default function BeginTask({ taskID }: {taskID:number}) {
    const [formState, formAction, isPending] = useActionState(endTask, {
        error: undefined,
        success: false,
    })

    const { toast } = useToast()
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (formState.success) {
            toast({
                title: 'Congratulations! 😁',
                description: 'Task completed',
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
                        <Play className="size-6 hover:cursor-pointer text-gray-300 hover:text-white transition"/> 
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>complete task</p>
                    </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                </span>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>End Task?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action will log the to-do as completed.
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