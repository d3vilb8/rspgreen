import Header from '@/Layouts/Header';
import Nav from '@/Layouts/Nav';
import axios from 'axios';
import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { IoIosArrowRoundBack } from "react-icons/io";
import { Link } from '@inertiajs/react';
import { FaPlus, FaEdit } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { RiDeleteBinLine } from "react-icons/ri";
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css'; // Import Notyf styles
const notyf = new Notyf();
const TaskCategory = ({ taskcategory, user, user_type, notif }) => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentTaskCategory, setCurrentTaskCategory] = useState(null);
    const { data, setData, post, errors, reset } = useForm({
        tname: ''
    });

    const HandleDelete = (e, id) => {
        e.preventDefault();
        if (confirm('Are you sure you want to delete this task category?')) {
            axios.get(`/task-category-delete/${id}`)
                .then(response => {
                    alert('Task Category deleted successfully');
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

    const openEditModal = (taskCategory) => {
        setData({
            tname: taskCategory.tname,
        });
        setCurrentTaskCategory(taskCategory);
        setIsEditModalOpen(true);
    };

    const closeModal = () => {
        setIsCreateModalOpen(false);
        setIsEditModalOpen(false);
        setCurrentTaskCategory(null);
        reset();
    };

    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     if (isCreateModalOpen) {
    //         post('/task-category-store', data).then(() => closeModal());
    //     } else if (isEditModalOpen && currentTaskCategory) {
    //         // alert(entTaskCategory.id)
    //
    //         post(`/testsfff/${currentTaskCategory.id}`, data);
    //     }
    // };
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (isCreateModalOpen) {
                await post('/task-category-store', data);
                notyf.success('Task category created successfully!');
            } else if (isEditModalOpen && currentTaskCategory) {
                await post(`/task-category-update/${currentTaskCategory.id}`, data);
                notyf.success('Task category updated successfully!');
            }

            closeModal();
        } catch (error) {
            if (isCreateModalOpen) {
                notyf.error('Failed to create task category.');
            } else if (isEditModalOpen && currentTaskCategory) {
                notyf.error('Failed to update task category.');
            }
            console.error('Submit error:', error);
        }
    };


    return (
        <div className='w-[85%] absolute right-0'>
            <Header user={user} notif={notif}/>
            <Nav user_type={user_type}/>
            <div className='flex items-center justify-end p-4'>
                <button onClick={openCreateModal} className='p-2 text-white bg-blue-600 rounded-md '>
                    <FaPlus />
                </button>
            </div>
            <div className='p-3 border-2 table-section'>
                <table className='table border w-full p-4'>
                    <thead className='bg-gray-700 text-white'>
                    <tr>
                        <th className='p-3 text-left border'>Category Name</th>
                        <th className='p-3 text-left border'>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {taskcategory.map((category, index) => (
                        <tr key={index}>
                            <td className='p-3 border'>
                                <Link href={`/projects-show/${category.id}`}>{category.tname}</Link>
                            </td>
                            <td className='p-3 border'>
                                <div className='flex justify-end'>
                                    <button onClick={() => openEditModal(category)} className='mr-2 text-green-800 text-[1.5rem]'>
                                        <FaEdit />
                                    </button>
                                    <button onClick={(e) => HandleDelete(e, category.id)} className='text-red-800 text-[1.5rem]'>
                                        <RiDeleteBinLine />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            {(isCreateModalOpen || isEditModalOpen) && (
                <div className='fixed top-0 left-0 z-50 flex items-center justify-center w-full h-screen bg-gray-900 bg-opacity-20'>
                    <div className='p-10 w-full max-w-[500px] relative bg-white rounded-md shadow-md'>
                        <div className='absolute right-[10px] top-[13px] text-[1.5rem]'>
                            <button onClick={closeModal} className='text-black'>
                                <IoMdClose />
                            </button>
                        </div>
                        {/*<h2 className='text-2xl font-bold'>*/}
                        {/*    {isCreateModalOpen ? 'Add Task Category' : 'Edit Task Category'}*/}
                        {/*</h2>*/}
                        <form onSubmit={handleSubmit} className='grid gap-4'>
                            <div>
                                <label htmlFor="tname">Category Name</label>
                                <input
                                    id="tname"
                                    className='w-full rounded-lg'
                                    name="tname"
                                    type="text"
                                    value={data.tname}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.tname && <div>{errors.tname}</div>}
                            </div>
                            <button type="submit" className='bg-blue-600 p-2 rounded-md text-white w-[35%]'>
                                {isCreateModalOpen ? 'Create' : 'Update'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TaskCategory;
