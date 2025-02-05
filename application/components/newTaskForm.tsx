'use client'

import Form from 'next/form'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { DatePicker } from './datePicker'
import { useActionState, useEffect, useState } from 'react'
import { createTask } from '@/lib/actions'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import { Play } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function NewTask() {
    const [formState, formAction, isPending] = useActionState(createTask, {
        error: undefined,
        success: false,
    })

    const [date, setDate] = useState<Date>()
    const handleDate = (date: Date | undefined ) => {
        setDate(date)
    }

    const { toast } = useToast()
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (formState.success) {
            toast({
                title: 'Success! 😁',
                description: 'Created to-do',
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
                        <p>start task</p>
                    </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                </span>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Create To-do</AlertDialogTitle>
                <AlertDialogDescription>
                    Create a new to-do
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Form action={formAction} className="p-4 px-6 flex flex-col space-y-2">
                        <div>
                            <Label>Name</Label>
                            <Input type='text' name='name' required/>
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Textarea name='description'/>
                        </div>
                        <div className='flex justify-between'>
                            <div>
                                <Label>Due date</Label>
                                <DatePicker handleDate={handleDate} />
                                <input type='hidden' name='dueDate' value={date?.toISOString()}/>
                            </div>
                            <div className='w-1/2'>
                                <Label>Priority</Label>
                                <Select name='priority' required>
                                    <SelectTrigger>
                                        <SelectValue placeholder='select'></SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value='HIGH'>High</SelectItem>
                                            <SelectItem value='MEDIUM'>Medium</SelectItem>
                                            <SelectItem value='LOW'>Low</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            
                        </div>
                        <AlertDialogAction type="submit" className="w-full">
                            Create
                        </AlertDialogAction>
                    </Form>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}