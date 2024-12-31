import { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link } from '@inertiajs/react';
import Header from './Header';
import Nav from './Nav';

export default function Authenticated({  header, children,user,usrrr,notif,user_type }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    console.log(user)
    return (
        <div className='w-[85.2%] absolute right-0 overflow-hidden'>
        <Header user={user} notif={notif}/>
        <Nav user_type={user_type} usrrr={usrrr}/>
     <div className='flex px-5 py-5 space-x-2'>

            <main className='grid ml-[7rem] place-items-center'>{children}</main>
        </div>
        </div>
    );
}
