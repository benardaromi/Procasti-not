'use client'

import Form from 'next/form'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { DatePicker } from './datePicker'
import { useState } from 'react'
import { createTask } from '@/lib/actions'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import SubmitButton from './submitButton'
import { TaskFormProps } from '@/lib/types'

export default function NewTaskForm({ tags } : TaskFormProps) {
    const [date, setDate] = useState<Date>()
    const handleDate = (date: Date | undefined ) => {
        setDate(date)
    }
    const createTaskWithDueDate = createTask.bind(null, date as Date)

    return (
        <Form action={createTaskWithDueDate} className="p-4 px-6 flex flex-col space-y-2">
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
            <div className='w-full'>
                <Label>Tags</Label>
                <Select name='tag'>
                    <SelectTrigger>
                        <SelectValue placeholder='choose'></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {tags.map((tag) => (
                                <SelectItem key={tag.id} value={tag.name}>{tag.name}</SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                </div>
            <SubmitButton text='Create'/>
        </Form>
    )
}