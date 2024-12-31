import Header from '@/Layouts/Header';
import Nav from '@/Layouts/Nav';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/inertia-react';
import { IoIosArrowRoundBack } from "react-icons/io";
import { Link } from '@inertiajs/react';
import { FaPlus, FaEdit } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { RiDeleteBinLine } from "react-icons/ri";

const HoliDay = ({ holiday, user, user_type, notif }) => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentLeaveType, setCurrentLeaveType] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const { data, setData, post, errors, reset } = useForm({
        name: '',
        start_date: '',
        end_date: '',
    });

    const HandleDelete = (e, id) => {
        e.preventDefault();
        if (confirm('Are you sure you want to delete this holiday?')) {
            axios.get(`/holi-delete/${id}`)
                .then(response => {
                    console.log(response);
                    alert('Holiday deleted successfully');
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
            name: leaveType.name,
            start_date: leaveType.start_date,
            end_date: leaveType.end_date,
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
            post('/holi-store', data).then(() => closeModal());
        } else if (isEditModalOpen && currentLeaveType) {
            post(`/holi-update/${currentLeaveType.id}`, data).then(() => closeModal());
        }
    };

    const [permissions, setPermissions] = useState([]);
    useEffect(() => {
        if (Array.isArray(user_type)) {
            setPermissions(user_type);
        } else {
            console.error('Expected user_type to be an array:', user_type);
        }
    }, [user_type]);

    // Filter and Paginate holidays
    const filteredHolidays = holiday.filter(leaveType =>
        leaveType.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredHolidays.length / itemsPerPage);
    const paginatedHolidays = filteredHolidays.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className='w-[85.2%] ml-[12rem]'>
            <Header user={user} notif={notif} />
            <Nav user_type={user_type} />
            <div className='flex items-center justify-between px-[12rem]'>
                {/* <h1 className='text-[2rem] font-bold'>Holidays</h1> */}
                {permissions.includes('create_holiday') ? (
                    <button onClick={openCreateModal} className='p-2 text-black underline rounded-md '>
                        Add New
                    </button>
                ) : (
                    <button className='p-2 text-white bg-blue-600 rounded-md' disabled><FaPlus /></button>
                )}
            </div>

            <div className='p-3 px-[12rem] table-section'>
                <div className='flex justify-between mb-4'>
                    <input
                        type="text"
                        placeholder="Search Holiday..."
                        className="p-2 border rounded-md"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <table className='table w-full'>
                    <thead>
                        <tr className='p-3'>
                            <th className='p-3 text-left border'>Holiday Name</th>
                            <th className='p-3 text-left border'>Start Date</th>
                            <th className='p-3 text-left border'>End Date</th>
                            <th className='p-3 text-left border'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedHolidays.length > 0 ? paginatedHolidays.map((leaveType, index) => (
                            <tr key={index}>
                                <td className='p-3 border'>{leaveType.name}</td>
                                <td className='p-3 border'>{leaveType.start_date}</td>
                                <td className='p-3 text-left border'>{leaveType.end_date}</td>
                                <td className='p-3 text-left border'>
                                    {permissions.includes('edit_holiday') ? (
                                        <button onClick={() => openEditModal(leaveType)}><FaEdit /></button>
                                    ) : (
                                        <button disabled><FaEdit /></button>
                                    )}
                                    {permissions.includes('delete_holiday') ? (
                                        <button onClick={(e) => HandleDelete(e, leaveType.id)}><RiDeleteBinLine /></button>
                                    ) : (
                                        <button disabled><RiDeleteBinLine /></button>
                                    )}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="4" className="py-4 text-center">No holidays found</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination Controls */}
                <div className='flex justify-between mt-4'>
                    {/* <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className='px-4 py-2 text-white bg-blue-500 rounded'
                    >
                        Previous
                    </button> */}
                    <div className='flex items-center space-x-2'>
                        {Array.from({ length: totalPages }, (_, index) => index + 1).map(number => (
                            <button
                                key={number}
                                onClick={() => setCurrentPage(number)}
                                className={`px-4 py-2 rounded ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                            >
                                {number}
                            </button>
                        ))}
                    </div>
                    {/* <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className='px-4 py-2 text-white bg-blue-500 rounded'
                    >
                        Next
                    </button> */}
                </div>
            </div>

            {(isCreateModalOpen || isEditModalOpen) && (
                <div className='fixed top-0 left-0 z-50 flex items-center justify-center w-full h-screen bg-gray-900 bg-opacity-20'>
                    <div className='p-10 w-full max-w-[500px] bg-white rounded-md shadow-md relative'>
                        <div className='flex justify-end absolute top-0 right-[2rem]'>
                            <button onClick={closeModal} className=' p-2 rounded-md text-black w-[20%]'><IoMdClose /></button>
                        </div>
                        <form onSubmit={handleSubmit} className='grid'>
                            <div>
                                <label htmlFor="type_name">Holiday Name</label>
                                <input id="type_name" className='w-full rounded-lg' name="name" type="text" value={data.name} onChange={handleChange} required />
                                {errors.type_name && <div>{errors.type_name}</div>}
                            </div>
                            <div>
                                <label htmlFor="type_name">Start Date</label>
                                <input id="type_name" className='w-full rounded-lg' name="start_date" type="date" value={data.start_date} onChange={handleChange} required />
                                {errors.type_name && <div>{errors.type_name}</div>}
                            </div>
                            <div>
                                <label htmlFor="days">End Date</label>
                                <input className='w-full rounded-lg' name="end_date" type="date" value={data.end_date} onChange={handleChange} required />
                                {errors.days && <div>{errors.days}</div>}
                            </div>
                            <div className='flex justify-center p-3'>
                                <button className='p-2 bg-blue-500 rounded-md text-white w-[60%] mt-[2rem]' type="submit">
                                    {isCreateModalOpen ? 'Add Holiday' : 'Update Holiday'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HoliDay;
