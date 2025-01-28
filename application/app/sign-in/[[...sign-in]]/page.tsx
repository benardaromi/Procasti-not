import { SignIn } from '@clerk/nextjs'

export default function Page() {
    return (
        <div className='grid h-dvh w-dvw items-center justify-center'>
            <SignIn />
        </div>
    )
}