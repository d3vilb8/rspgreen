import Header from '@/Layouts/Header';
import Nav from '@/Layouts/Nav';

import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useForm } from '@inertiajs/inertia-react';
import { IoIosArrowRoundBack } from "react-icons/io";
import { Link } from '@inertiajs/react';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css'; // Import Notyf styles

const notyf = new Notyf();

const Edit = ({ empdataloyee, type, leave, user, user_type }) => {
    const { data, setData, post, errors, notif } = useForm({
        employee_id: leave.employee_id,
        leave_type_id: leave.leave_type_id,
        sdate: leave.sdate,
        edate: leave.edate,
        reason: leave.reason,
        remark: leave.remark,
        hours: '',
        status: leave.status,
        is_unpaid: leave.is_unpaid,  // Checkbox for paid/unpaid
        documents: [] // To handle file upload
    });

    const handleChange = (e) => {
        if (e.target.name === 'documents') {
            setData('documents', e.target.files); // Handle file upload
        } else {
            setData(e.target.name, e.target.value); // Handle other inputs
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();

        // Append form data
        for (let key in data) {
            if (key === 'documents' && data[key].length > 0) {
                // Append all selected files
                Array.from(data[key]).forEach(file => {
                    formData.append('documents[]', file);
                });
            } else {
                formData.append(key, data[key]);
            }
        }

        post(`/leave-store-update/${leave.id}`, {
            data: formData,
            onSuccess: () => {
                notyf.success('Employee leave updated successfully');
            },
            onError: (errors) => {
                if (typeof errors === 'object' && errors !== null) {
                    Object.entries(errors).forEach(([key, value]) => {
                        if (Array.isArray(value)) {
                            value.forEach(message => notyf.error(message));
                        } else {
                            notyf.error(value);
                        }
                    });
                } else {
                    notyf.error('An unexpected error occurred.');
                }
            }
        });
    };

    return (
        <div className='w-[85.2%] ml-[11.5rem]'>
            <Header user={user} notif={notif} />
            <Nav user_type={user_type} />
            <div className='p-3 table-section'>
                <div className='flex justify-end '>
                    <div className='flex'>
                        <div className='grid p-2 mt-2 text-white bg-blue-800 rounded-lg place-items-center'>
                            <Link href='/leave-index'>  
                                <IoIosArrowRoundBack className='text-[1rem]' />
                            </Link>
                        </div>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className='px-[8rem] grid grid-cols-2 gap-4'>
                

                    <div>
                        <label htmlFor="email">Leave Type</label>
                        <select 
                            name="leave_type_id" 
                            className='w-full rounded-lg' 
                            value={data.leave_type_id} 
                            onChange={handleChange} 
                            required
                        >
                            <option value="">Select leave Type</option>
                            {type.map(tp => (
                                <option key={tp.id} value={tp.id}>{tp.type_name}</option>
                            ))}
                        </select>
                        {errors.leave_type_id && <div>{errors.leave_type_id}</div>}
                    </div>

                    <div>
                        <label htmlFor="password">Start Date</label>
                        <input 
                            className='w-full rounded-lg' 
                            name='sdate' 
                            type="date" 
                            value={data.sdate} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div>
                        <label htmlFor="phone">End date</label>
                        <input 
                            className='w-full rounded-lg' 
                            name='edate' 
                            type="date" 
                            value={data.edate} 
                            onChange={handleChange} 
                            required 
                        />
                        <input 
                            className='w-full rounded-lg' 
                            name='status' 
                            hidden 
                            type="number" 
                            value={data.status} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div>
                        <label htmlFor="address">Leave Reason</label>
                        <textarea 
                            className='w-full rounded-lg' 
                            name='reason' 
                            value={data.reason} 
                            onChange={handleChange} 
                            required
                        ></textarea>
                    </div>

                    <div>
                        <select
                            name="is_unpaid"
                            className='p-2 rounded-md mt-5 w-[100%]'
                            value={data.is_unpaid}
                            onChange={handleChange}
                        >
                            <option value="">Select leave tag</option>
                            <option value="0">Paid</option>
                            <option value="1">Unpaid</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="address">Remarks</label>
                        <textarea 
                            className='w-full rounded-lg' 
                            name='remark' 
                            value={data.remark} 
                            onChange={handleChange} 
                            required
                        ></textarea>
                    </div>

                    <div>
                        <label htmlFor="documents">Upload Documents (Multiple)</label>
                        <input 
                            type="file"
                            name="documents"
                            id="documents"
                            className="w-full rounded-lg"
                            multiple
                            onChange={handleChange}
                        />
                    </div>

                    {/* {leave.documents && leave.documents.length > 0 && (
                        <div>
                            <label>Existing Documents:</label>
                            <ul>
                                {leave.documents.map((doc, index) => (
                                    <li key={index}><a href={doc.url} target="_blank" rel="noopener noreferrer">{doc.filename}</a></li>
                                ))}
                            </ul>
                        </div>
                    )} */}

                    <button type="submit" className='bg-blue-600 p-2 rounded-md text-white w-[30%]'>Update</button>
                </form>
            </div>
        </div>
    );
};

export default Edit;
