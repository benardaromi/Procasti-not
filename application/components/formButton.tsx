'use client'

import { useEffect } from "react";
import { useFormStatus } from "react-dom";
import { FormButtonProps } from "@/lib/types";

export default function FormButton({
    children,
    className = 'px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors',
    pendingClassName = 'bg-gray-400 cursor-not-allowed',
    successMessage = 'Success 😁!',
    errorMessage = 'An error occurred😐',
    successDuration = 3000,
    formState ,
}: FormButtonProps) {
    const { pending } = useFormStatus()

    useEffect(() => {
        if (formState?.success) {
            const timer = setTimeout(() => {
            }, successDuration)
            return () => clearTimeout(timer)
        }
    }, [formState, successDuration])

    return (
        <div className="relative">
            <button
                type="submit"
                disabled={pending}
                className={`flex items-center gap-2 ${className} ${pending ? pendingClassName : ''}`}
                aria-disabled={pending}
            >
                {pending ? (
                    <span className="animate-spin inline-block">↻</span>
                ) : (
                    children
                )}
            </button>

            {formState?.success && (
                <div
                    className="absolute top-full mt-2 mb-2 text-sm text-green-500 animate-fade-out"
                    role="alert"
                >
                    {successMessage}
                </div>
            )}

            {formState?.error && (
                <div
                    className="absolute top-full mt-2 mb-2 text-sm text-red-500"
                    role="alert"
                >
                    {errorMessage}
                </div>
            )}
        </div>
    )
}
