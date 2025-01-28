import { SignUp } from '@clerk/nextjs'

export default function Page() {
    return (
        <div className='grid h-dvh w-dvw items-center justify-center'>
            <SignUp />
        </div>
    )
}