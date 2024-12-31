import Header from '@/Layouts/Header'
import Nav from '@/Layouts/Nav';
import { Link } from '@inertiajs/react';
import React, { useState,useEffect } from 'react'
import { FaPlus } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { MdLockClock } from "react-icons/md";

import { RiDeleteBinLine } from "react-icons/ri";


const View = ({ user, project, task,user_type,notif }) => {
    const [selectedStatus, setSelectedStatus] = useState({});
    const [permissions, setPermissions] = useState([]);
    const handleStatusChange = (e, id) => {
      const newStatus = e.target.value;
      setSelectedStatus((prevStatus) => ({ ...prevStatus, [id]: newStatus }));

      // Make POST request to update status using useForm
      axios.post(`/project-task-status/${id}`, {
        status: newStatus,
        onSuccess: (response) => {
          console.log('Success:', response);
        },
        onError: (errors) => {
          console.error('Error:', errors);
        }
      });
    };
    const [modal, setModal] = useState(true)
    const HandelModal = () => {
        setModal(!modal)
    }
    useEffect(() => {
        if (Array.isArray(user_type)) {
            setPermissions(user_type);
        } else {
            console.error('Expected user_type to be an array:', user_type);
        }
    }, [user_type]);

    const HandleDelete = (e, id) => {

        e.preventDefault();
        if (confirm('Are you sure you want to delete this employee?')) {
            axios.get(`/task-delete/${id}`)
                .then(response => {
                    console.log(response);
                    alert('Employee deleted successfully');
                    // Redirect or update UI as needed
                    window.location.reload();
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }
    return (

        <div className='px-[8rem] relative'>
            <Header user={user} notif={notif}/>
            <Nav user_type={user_type}/>
            {/* <button className='px-4 py-2 mr-2 text-white bg-red-500 rounded-md' onClick={HandelModal}>
                add
            </button> */}


            <div className='flex flex-col gap-6'>
                <div className='flex items-center justify-between'>
                    <h1 className='text-2xl font-bold'> </h1>


                    <span>Project name : {project.title}</span>
                    <br />
                    <br />
                    <span>Project Budget : {project.estimate_budget}</span>
                    <br />
                    <span>Start Date : {project.start_date}</span>
                    <br />
                    <span>End Date : {project.end_date}</span>
                    <Link href={`/task-create/${project.id}`}>
                        <button className='px-4 py-2 text-white bg-blue-500 rounded-md'>
                            <FaPlus />  Task
                        </button>
                    </Link>
                </div>
            </div>
            <table class="table border w-full p-4">
                <thead className='border'>
                    <tr >
                        {/* <th className='p-3 text-left border'>Project Name</th> */}
                        <th className='text-left border'> Task Name</th>
                        {/* <th className='text-left border'> Project Assign</th> */}
                        <th className='p-3 text-left border'>Start Date</th>
                        <th className='p-3 text-left border'>End Date</th>
                        <th className='p-3 text-left border'>Estimate Hours</th>
                        <th className='p-3 text-left border'>Status</th>
                        <th className='p-3 text-left border'>Action</th>
                        {/* <th className='text-left border'>Unlock Timesheet</th> */}
                    </tr>
                </thead>
                <tbody>
                    {
                        task.map(emp => (
                            <tr key={emp.id}>
                                <td className='p-3 border' >{emp.task_name}</td>

                                {/* <td className='border'>{emp.employee_id}</td> */}
                                <td className='p-3 border'>{emp.sdate}</td>
                                <td className='p-3 border'>{emp.edate}</td>
                                <td className='p-3 border'>{emp.estimate_hours}hours</td>
                                {
                                    permissions.includes('edit_status') && (
                                        <td className='p-3 border'>
                                        <select
    className={`border-none appearance-none text-blue-600 bg-transparent bg-[url('')] ${
        selectedStatus[emp.id] === "0" ? "text-red-500" :
        selectedStatus[emp.id] === "1" ? "text-yellow-500" :
        selectedStatus[emp.id] === "2" ? "text-blue-500" :
        selectedStatus[emp.id] === "3" ? "text-green-500" :
        "text-gray-500"
    }`}
    value={selectedStatus[emp.id] || emp.status}
    name="status"
    onChange={(e) => handleStatusChange(e, emp.id)}
>
    <option value="">Select Status</option>
    <option value="0">Pending</option>
    <option value="1">In Progress</option>
    <option value="2">Open</option>
    <option value="3">Close</option>
</select>

                                </td>
                                    )
                                }


                                <td className='border'>
                                    <div className='flex'>
                                        <Link className='text-green-800 text-[1.5rem]' href={`task-edit/${emp.id}`}><FaEdit /></Link>

                                        <button className='text-red-800 text-[1.5rem]' onClick={(e) => HandleDelete(e, emp.id)}><RiDeleteBinLine /></button>
                                    </div>

                                </td>

                            </tr>
                        ))
                    }

                </tbody>
            </table>
        </div>
    )
}

export default View
