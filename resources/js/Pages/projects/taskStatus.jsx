import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { FaPlus, FaEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";
import Header from '@/Layouts/Header';
import Nav from '@/Layouts/Nav';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css'; // Import Notyf styles

const notyf = new Notyf(); // Initialize Notyf outside of the component to avoid re-initialization

const TaskStatus = ({ status, user, user_type, notif }) => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(null);
    const { data, setData, post, put, delete: destroy, errors, reset } = useForm({
        status_name: '',
    });

    const openCreateModal = () => {
        reset();
        setIsCreateModalOpen(true);
    };

    const openEditModal = (status) => {
        setData({ status_name: status.status_name });
        setCurrentStatus(status);
        setIsEditModalOpen(true);
    };

    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isCreateModalOpen) {
            post('/task-status/store', {
                data,
                onSuccess: () => {
                    notyf.success('Task status created successfully!'); // Show success message
                    closeModal();
                },
                onError: () => {
                    notyf.error('Failed to create task status.'); // Show error message
                }
            });
        } else if (isEditModalOpen && currentStatus) {
            put(`/task-status/update/${currentStatus.id}`, {
                data,
                onSuccess: () => {
                    notyf.success('Task status updated successfully!'); // Show success message
                    closeModal();
                },
                onError: () => {
                    notyf.error('Failed to update task status.'); // Show error message
                }
            });
        }
    };

    const closeModal = () => {
        setIsCreateModalOpen(false);
        setIsEditModalOpen(false);
        setCurrentStatus(null);
        reset();
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this task status?')) {
            destroy(`/task-status/delete/${id}`, {
                onSuccess: () => {
                    notyf.success('Task status deleted successfully!'); // Show success message
                },
                onError: () => {
                    notyf.error('Failed to delete task status.'); // Show error message
                }
            });
        }
    };

    return (
        <div className="w-[85.2%]  absolute right-0 overflow-hidden">
            <Header user={user} notif={notif}/>
            <Nav user_type={user_type}/>
            {/* Task Status Table */}
            <div className='p-3 table-section px-[15rem] '>
                <div className='flex items-center justify-end p-4'>
                    <button onClick={openCreateModal} className='p-2 text-white bg-blue-600 rounded-md'>
                        <FaPlus/>
                    </button>
                </div>
                <table className='table w-full'>
                    <thead className="bg-[#065E91] text-white">
                    <tr className='p-3'>
                        <th className='p-3 text-left border'>Status Name</th>
                        <th className='p-3 text-right border'>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {status.map((statusItem, index) => (
                        <tr key={index}>
                            <td className='p-3 border'>{statusItem.status_name}</td>
                            <td className='p-3 text-right border'>
                                <button onClick={() => openEditModal(statusItem)}><FaEdit/></button>
                                <button onClick={() => handleDelete(statusItem.id)}><RiDeleteBinLine/></button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {/* Modal for Create/Edit */}
                {(isCreateModalOpen || isEditModalOpen) && (
                    <div className='fixed top-0 left-0 z-50 flex items-center justify-center w-full h-screen bg-gray-900 bg-opacity-20'>
                        <div className='p-10 w-full max-w-[500px] relative bg-white rounded-md shadow-md'>
                            <div className='absolute right-[10px] top-[13px] text-[1.5rem]'>
                                <button onClick={closeModal} className='text-black'>
                                    <IoMdClose/>
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className='grid gap-4'>
                                <div>
                                    <label htmlFor="status_name">Status Name</label>
                                    <input id="status_name" className='w-full rounded-lg' name="status_name"
                                           type="text" value={data.status_name} onChange={handleChange} required/>
                                    {errors.status_name && <div>{errors.status_name}</div>}
                                </div>
                                <button type="submit" className='bg-blue-600 p-2 rounded-md text-white w-[35%]'>
                                    {isCreateModalOpen ? 'Create' : 'Update'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskStatus;
