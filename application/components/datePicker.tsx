"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
    handleDate: (date: Date | undefined ) => void
}

export function DatePicker({ handleDate }: DatePickerProps ) {
    const [date, setDate] = React.useState<Date>()

    const handleSelectedDate = ( selectedDate: Date | undefined ) => {
        setDate(selectedDate)
        handleDate(selectedDate)
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                variant={"outline"}
                className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                )}
                >
                <CalendarIcon />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                mode="single"
                selected={date}
                onSelect={handleSelectedDate}
                initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}
