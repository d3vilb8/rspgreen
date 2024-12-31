import { Link } from '@inertiajs/react'
import React from 'react'

const unauthorized=()=>{
    return (
        <div className='grid h-screen border place-items-center'>
            <div className='text-center'>
            <h1>Unauthorized Access</h1>
            <p>You are not authorized to access this page.</p>
            <Link className='p-2 mt-3 text-white bg-blue-700 rounded' href='/dashboard'>Back Home</Link>
            </div>
        </div>
    )
}

export default unauthorized
