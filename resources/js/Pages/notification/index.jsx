import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useForm } from '@inertiajs/react';
import Header from '@/Layouts/Header';
import Nav from '@/Layouts/Nav';
import { FaRegTrashAlt } from "react-icons/fa";
import { MdOutlineAssignmentLate } from "react-icons/md";
import { BiTask } from 'react-icons/bi';
function AssignHolidayWork({ user, user_type, notif, empl, holidays,assignments,holiday }) {


    return (
        <div className='w-[85.2%] absolute right-0 overflow-hidden'>
            <Header user={user} notif={notif} />
            <Nav user_type={user_type} />
            <div className='p-3 px-[5rem] table-section'>
                {/* <h2>Assign Holiday Work</h2> */}
               <h1 className='underline'>Notifications</h1>

<div className='p-2 '>
                               {notif?.map(nofit => (
    <Link
        key={holiday.id}
        onClick={() => handleNotificationClick(nofit.id)}
        href={ nofit.data.url }
        className='flex items-center w-full p-2 border gap-x-4 hover:bg-gray-100'
    >
        <BiTask size={18} className='text-green-500' />
        <div className='flex flex-col'>
            <span className='text-sm font-medium text-gray-800'>{nofit.data.project}</span>
            <span className='text-sm text-gray-600'>{nofit.data.employee_id}</span>
            <span className='text-sm text-gray-700'>{nofit.data.message}</span>
        </div>
        {!nofit.read_at && (
            <span className='bg-red-500 w-1.5 h-1.5 rounded-full ml-auto'></span>
        )}
    </Link>
))}
</div>


            </div>
        </div>
    );
}

export default AssignHolidayWork;
