import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function Guest({ children }) {
    return (
        <div className="flex flex-col items-center min-h-screen pt-6 bg-gray-100 sm:justify-center sm:pt-0 ">
            <div className='grid place-items-center'>
                 <img src="https://rspgreen.in/image/WhatsApp%20Image%202024-10-08%20at%2014.58.36_e0e7cbb8.jpg" alt="Description" className="w-[80%]" />
            </div>

            <div className="w-full px-6 py-4 mt-6 overflow-hidden bg-white shadow-md sm:max-w-md ">
                {children}
            </div>
        </div>
    );
}
