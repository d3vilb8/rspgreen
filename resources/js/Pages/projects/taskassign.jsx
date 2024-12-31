import Header from '@/Layouts/Header';
import Nav from '@/Layouts/Nav';
import axios from 'axios';
import React, { useState,useEffect } from 'react';
import { useForm } from '@inertiajs/inertia-react';
import { IoIosArrowRoundBack } from "react-icons/io";
import { Link } from '@inertiajs/react';
import { FaPlus } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";

import { Notyf } from 'notyf';
import 'notyf/notyf.min.css'; // Import the Notyf styles
const notyf = new Notyf(); // Initialize Notyf
const TasksWithProject = ({ user, projects, user_type,notif,status }) => {
    const [selectedStatus, setSelectedStatus] = useState({});
    const [permissions, setPermissions] = useState([]);
    const handleStatusChange = (e, id) => {
      const newStatus = e.target.value;
      setSelectedStatus((prevStatus) => ({ ...prevStatus, [id]: newStatus }));

      // Make POST request to update status using useForm
        axios
            .post(`/project-task-status/${id}`, { status: newStatus })
            .then((response) => {
                console.log('Success:', response);
                notyf.success('Status updated successfully'); // Show success notification
            })
            .catch((error) => {
                console.error('Error:', error);
                notyf.error('Failed to update status'); // Show error notification
            });
    };

    useEffect(() => {
        if (Array.isArray(user_type)) {
            setPermissions(user_type);
        } else {
            console.error('Expected user_type to be an array:', user_type);
        }
    }, [user_type]);
    return (
        <div className='w-[85.2%] ml-[11.5rem]'>
            <Header user={user} notif={notif}/>
            <Nav user_type={user_type} />
            <div className='table-section  border-[#0A1B3F] py-3 px-[8rem] rounded-b-md'>
                <div className='flex justify-end '>
                    <div className='flex'>
                    {
                                    permissions.includes('edit_status') && (
<div className='px-4'>
                             <Link href='taskstatus' className='flex space-x-2 underline'>
                                <span className='font-bold'>Create Status</span>
                            </Link>
                        </div>
                                    )}

                    </div>
                </div>
                <table className="table w-full p-4 border">
                    <thead className='border bg-[#0A1B3F] text-white'>
                        <tr>
                            <th className='p-3 text-left border'>Project Name</th>
                            {
                                permissions.includes('view_assign') && (
                                    <th className='p-3 text-left border'>Employee Name</th>
                                )
                            }

                            <th className='p-3 text-left border'>Assign Task</th>
                            <th className='p-3 text-left border'>Assign Hours</th>
                            {
                                permissions.includes('edit_status') && (    <th className='text-left border'>Status</th>)}

                            {/* <th className='p-3 text-left border'>Action</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map(emp => (
                            <tr key={emp.id}>
                                <td className='p-3 border'>
                                    <Link href={`/projects-show/${emp.id}`}>{emp.title}</Link>
                                </td>
                                {
                                permissions.includes('view_assign') && (
                                    <td className='p-3 border'>{emp.name}</td>
                                )
                            }

                                <td className='p-3 border'>{emp.task_name}</td>
                                <td className='p-3 border'>{emp.employee_hours}</td>
                                {
                                    permissions.includes('edit_status') && (
                                        <td className='p-3 border'>
                     <select
    className="border-none appearance-none bg-transparent bg-[url('')]"
    value={selectedStatus[emp.id] || emp.status}
    name="status"
    onChange={(e) => handleStatusChange(e, emp.id)}
>
    <option value="">Select Status</option>
                         {
                             status.map(i=>(
                                 <option value={i.id}>{i.status_name}</option>
                             ))
                         }
</select>

                                </td>
                                    )
                                }

                                {/* <td className='border'>
                                    <div className='flex justify-center space-x-3'>
                                        <Link className='text-green-800 text-[1.1rem] bg-[#0C7785] p-1 rounded-md' href={`projects-edit/${emp.id}`}>
                                            <CiEdit className='text-white' />
                                        </Link>
                                        <button className='text-white text-[1.1rem] bg-[#FF3A6E] p-1 rounded-md' onClick={(e) => HandleDelete(e, emp.id)}>
                                            <RiDeleteBinLine />
                                        </button>
                                    </div>
                                </td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TasksWithProject;
