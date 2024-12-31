import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from '@inertiajs/react';
import Header from '@/Layouts/Header';
import Nav from '@/Layouts/Nav';
import { FaRegTrashAlt } from "react-icons/fa";
import { MdOutlineAssignmentLate } from "react-icons/md";
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css'; // Import Notyf styles
const notyf = new Notyf();
function AssignHolidayWork({ user, user_type, notif, empl, holidays,assignments }) {
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
    // const [assignments, setAssignments] = useState([]);
    const [currentAssignment, setCurrentAssignment] = useState(null);

    const { data, setData, post, put, delete: destroy, reset, errors } = useForm({
        employee_id: empl.id || '',
        holiday_id: '',
    });



    const handleAssign = (e) => {
        e.preventDefault();

        if (modalMode === 'create') {
            post('/assign-holiday-work', {
                onSuccess: () => {
                    // alert('Holiday work assigned successfully!');
                    notyf.success('Holiday work assigned successfully!');
                    closeModal();
                },
                onError: () => {
                    console.error(errors);
                }
            });
        } else {
            put(`/update-holiday-work/${currentAssignment.id}`, {
                onSuccess: () => {
                    // alert('Holiday work updated successfully!');
notyf.success('Holiday work updated successfully!');
                    closeModal();
                },
                onError: () => {
                    console.error(errors);
                }
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this assignment?')) {
            destroy(`/delete-holiday-work/${id}`, {
                onSuccess: () => {
                  notyf.success('Holiday work deleted successfully!');
                },
                onError: () => {
                    console.error(errors);
                }
            });
        }
    };

    const openModal = (mode, assignment = null) => {
        setModalMode(mode);
        setCurrentAssignment(assignment);

        if (assignment) {
            setData({
                employee_id: assignment.employee_id,
                holiday_id: assignment.holiday_id,
            });
        } else {
            reset();
        }

        setShowModal(true);
    };

    const closeModal = () => {
        reset();
        setShowModal(false);
    };

    return (
        <div className='w-[85.2%] absolute right-0 overflow-hidden'>
            <Header user={user} notif={notif} />
            <Nav user_type={user_type} />
            <div className='p-3 px-[12rem] table-section'>
                {/* <h2>Assign Holiday Work</h2> */}
                <button onClick={() => openModal('create')} className='underline'>Assign Work</button>

                <table className='w-full'>
                    <thead>
                        <tr className='bg-[#0A1B3F] text-white'>
                            <th className='p-2 border'>Employee</th>
                            <th className='p-2 border'>Holiday</th>
                            <th className='p-2 border'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assignments.map(assignment => (
                            <tr key={assignment.id}>
                                <td className='p-2 border'>{assignment.name}</td>
                                <td className='p-2 border'> {assignment.title}</td>
                                <td className='p-2 border'>
                                    {/* <button onClick={() => openModal('edit', assignment)}>Edit</button> */}
                                    <button onClick={() => handleDelete(assignment.id)} className='bg-[#FF3A6E] text-white p-2 rounded-md'> <FaRegTrashAlt/> </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Modal for Create/Edit */}
                {showModal && (
                    <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-screen bg-gray-900 bg-opacity-20">
                        <h3>{modalMode === 'create' ? 'Assign Work' : 'Edit Assignment'}</h3>
                        <form onSubmit={handleAssign} className='space-y-4 bg-white p-7 w-[40%]'>
                            <div className="form-group">
                                <input type="text" value={empl.name} readOnly className='w-full rounded-md' />
                            </div>

                           <div className="form-group">
                             <select className='w-full rounded-md'
                                value={data.holiday_id}
                                onChange={(e) => setData('holiday_id', e.target.value)}
                            >
                                <option value="">Select Holiday</option>
                                {holidays.map(holiday => (
                                    <option key={holiday.id} value={holiday.id}>{holiday.name}</option>
                                ))}
                            </select>
                           </div>
                            {errors.holiday_id && <div className="error">{errors.holiday_id}</div>}

                            <button className='p-1 px-2 text-white bg-blue-600 rounded-md' type="submit">{modalMode === 'create' ? 'Assign Work' : 'Update Assignment'}</button>
                            <button type="button" onClick={closeModal} className='p-1 px-2 ml-3 text-white bg-red-700 rounded-md'>Cancel</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AssignHolidayWork;
