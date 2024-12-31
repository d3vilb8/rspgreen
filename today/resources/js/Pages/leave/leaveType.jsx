import Header from '@/Layouts/Header';
import Nav from '@/Layouts/Nav';

import axios from 'axios';
import React, { useState } from 'react'
import { useForm } from '@inertiajs/inertia-react';
import { IoIosArrowRoundBack } from "react-icons/io";
import { Link } from '@inertiajs/react';
import { FaPlus } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { MdLockClock } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { RiDeleteBinLine } from "react-icons/ri";
const leaveType = ({ leaveTypes, user,user_type,notif,employees }) => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentLeaveType, setCurrentLeaveType] = useState(null);
    const { data, setData, post, errors, reset } = useForm({
        type_name: '',
        days: '',
        employee_id:''
    });


    const HandleDelete = (e, id) => {

        e.preventDefault();
        if (confirm('Are you sure you want to delete this employee?')) {
            axios.get(`/leave-delete/${id}`)
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
    const openCreateModal = () => {
        reset();
        setIsCreateModalOpen(true);
    };

    const openEditModal = (leaveType) => {
        setData({
            type_name: leaveType.type_name,
            days: leaveType.days,
            employee_id: leaveType.employee_id,
        });
        setCurrentLeaveType(leaveType);
        setIsEditModalOpen(true);
    };

    const closeModal = () => {
        setIsCreateModalOpen(false);
        setIsEditModalOpen(false);
        setCurrentLeaveType(null);
        reset();
    };

    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isCreateModalOpen) {
            post('/leave-store', data).then(() => closeModal());
        } else if (isEditModalOpen && currentLeaveType) {
            post(`/leave-update/${currentLeaveType.id}`, data).then(() => closeModal());
        }
    };
    return (
        <div className='w-[85.2%] ml-[11.5rem]'>
            <Header user={user} notif={notif}/>
            <Nav user_type={user_type}/>
            <div className='flex items-center justify-end p-4'>
                {/* <h1 className='text-[2rem] font-bold '>Leave Types</h1> */}
                <button onClick={openCreateModal} className='p-2 text-white bg-blue-600 rounded-md '>
                    <FaPlus />
                </button>
            </div>




            <div className='p-3 table-section'>
                {/* <div className='flex justify-end '>
                    <div className='flex'>
                        <div className='grid p-2 mt-2 text-white bg-blue-800 rounded-lg place-items-center'>
                            <Link href='employees'>  <IoIosArrowRoundBack className='text-[1rem] ' /></Link>
                        </div>

                    </div>
                </div> */}


                <div className=' px-[8rem]'>
                    <table className='table w-full'>
                        <thead className="bg-[#065E91] text-white">
                        <tr className='p-3'>
                            <th className='p-3 text-left border'>Leave Type</th>
                            <th className='p-3 text-left border'>Employee</th>
                            <th className='p-3 text-right border'>Days</th>
                            <th className='p-3 text-right border'>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                            {leaveTypes.map((leaveType, index) => (
                                <tr key={index}>
                                    <td className='p-3 border'>{leaveType.type_name}</td>
                                    <td className='p-3 border'>{leaveType.name}</td>
                                    <td className='p-3 text-right border'>{leaveType.days}</td>
                                    <td className='p-3 text-right border'>
                                        <button onClick={() => openEditModal(leaveType)}><FaEdit/></button>
                                        <button onClick={(e) => HandleDelete(e, leaveType.id)}><RiDeleteBinLine/>
                                        </button>


                                    </td>
                                </tr>

                            ))}
                        </tbody>
                        {(isCreateModalOpen || isEditModalOpen) && (
                            <div
                                className='fixed top-0 left-0 z-50 flex items-center justify-center w-full h-screen bg-gray-900 bg-opacity-20'>

                                <div className='p-10 w-full max-w-[500px] relative bg-white rounded-md shadow-md'>
                                    <div className=' absolute right-[10px] top-[13px] text-[1.5rem] '>
                                        <button onClick={closeModal} className=' text-black w-[20%]'>
                                            <IoMdClose/>
                                        </button>
                                    </div>
                                    <h2 className='text-2xl font-bold'>
                                        {isCreateModalOpen ? 'Add Leave Type' : 'Edit Leave Type'}
                                    </h2>
                                    {/*                                    <span onClick={openCreateModal}>*/}
                                    {/*close*/}
                                    {/*                                    </span>*/}


                                    <form onSubmit={handleSubmit} className='grid  gap-4'>
                                        <div className="form-group w-full">
                                            <select name="employee_id" id="" value={data.employee_id}
                                                    className="w-full rounded" onChange={handleChange}>
                                                <option value="">select employee</option>
                                                {
                                                    employees.map(e => (
                                                        <option value={e.id}>{e.name}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="type_name">Leave Type Name</label>
                                            <input id="type_name" className='w-full rounded-lg' name="type_name"
                                                   type="text" value={data.type_name} onChange={handleChange} required/>
                                            {errors.type_name && <div>{errors.type_name}</div>}
                                        </div>
                                        <div>
                                            <label htmlFor="days">Days</label>
                                            <input className='w-full rounded-lg' id="days" name='days' type="number"
                                                   value={data.days} onChange={handleChange} />
                                            {errors.days && <div>{errors.days}</div>}
                                        </div>
                                        <button type="submit" className='bg-blue-600 p-2 rounded-md text-white w-[35%]'>
                                            {isCreateModalOpen ? 'Create' : 'Update'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </table>
                </div>
            </div>
        </div>
    )

}

export default leaveType;
