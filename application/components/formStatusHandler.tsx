'use client'

import { FormStatus } from "@/lib/types";
import { useEffect, useState } from "react";

export function useFormStatusHandler(
serverState: { error?: string; success?: boolean }) {
    const [status, setStatus] = useState<FormStatus>({ type: null, message: null })

    useEffect(() => {
        if (serverState?.success) {
            setStatus({ type: 'success', message: 'Success😁!' })
        } else if (serverState?.error) {
            setStatus({ type: 'error', message: serverState.error })
        }
    }, [serverState])

    return status
}