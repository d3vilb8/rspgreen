import Header from '@/Layouts/Header';
import Nav from '@/Layouts/Nav';

import axios from 'axios';
import React, { useState } from 'react'
import { IoMdReturnLeft } from "react-icons/io";
import { Link, useForm } from '@inertiajs/react';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css'; // Import Notyf styles
const notyf = new Notyf();

const Create = ({ employees, user_type, user, notif, clients, lead }) => {
    const { data, setData, put, errors } = useForm({
        client_id: lead.client_id || '',
        email_address: lead.email_address || '',
        phone_number: lead.phone_number || '',
        source: lead.source || '',
        lead_for: lead.lead_for || '',
        lead_stage: lead.lead_stage || '',
        comment: lead.comment || '',
        status:  lead.status || ''
    });

    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const Mulitple = (e) => {
        const { options } = e.target;
        const selectedEmployees = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selectedEmployees.push(options[i].value);
            }
        }
        setData('employee_id', selectedEmployees);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/lead/${lead.id}`, {
            onSuccess: () => {
                notyf.success('Leads Edited successfully');
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

    // Find the selected client based on the client_id
    const selectedClient = clients ? clients.find(cl => cl.id === data.client_id) : null;

    return (
        <div className='w-[85.2%] ml-[11.5rem]'>
            <Header user={user} notif={notif} />
            <Nav user_type={user_type} />
            <div className='px-[10rem] grid border-blue-950 rounded-b-md space-y-3'>
                <div className='flex justify-end '>
                    <div className='flex'>
                        <div className=''>
                            <Link href='/lead' className='flex p-1 px-4 space-x-2 text-white rounded-md bg-slate-600'>
                                <span className='grid place-items-center'><IoMdReturnLeft /></span>
                                <span>back</span>
                            </Link>
                        </div>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className='space-y-3'>
                    <div>
                        <p className='text-lg font-semibold text-gray-700'>Client's Name</p>
                        {/* Display only the selected client's name */}
                        <p>{selectedClient ? selectedClient.name : 'No Client Selected'}</p>
                        {errors.name && <div>{errors.name}</div>}
                    </div>

                    <div>
                        <p className='text-lg font-semibold text-gray-700'>Email Address</p>
                        <p>{data.email_address}</p>
                        {errors.email && <div>{errors.email}</div>}
                    </div>

                    <div>
                        <p className='text-lg font-semibold text-gray-700'>Phone Number</p>
                        <p>{data.phone_number}</p>
                        {errors.phone_no && <div>{errors.phone_no}</div>}
                    </div>

                    <div>
                        <p className='text-lg font-semibold text-gray-700'>Source</p>
                        <p>{data.source}</p>
                        {errors.source && <div>{errors.source}</div>}
                    </div>

                    {/* Conditionally render agent name based on the source */}
                    {data.source === 'agent' && (
                        <div>
                            <p className='text-lg font-semibold text-gray-700'>Agent Name</p>
                            <p>ssssssss </p>
                        </div>
                    )}
                     {data.source === 'website' && (
                        <div>
                            <p className='text-lg font-semibold text-gray-700'>Website Name</p>
                            <p>wwww </p>
                        </div>
                    )}

                    <div>
                        <p className='text-lg font-semibold text-gray-700'>Status</p>
                        <p>{data.status}</p>
                        {errors.status && <div>{errors.status}</div>}
                    </div>

                    <div>
                        <p className='text-lg font-semibold text-gray-700'>Assign</p>
                        <p>Ella Schultz</p>
                        {errors.Lead_For && <div>{errors.Lead_For}</div>}
                    </div>

                    <div className='text-lg font-semibold text-gray-700'>
                        <p>Comment</p>
                        <p>{data.comment}</p>
                        {errors.Comment && <div>{errors.Comment}</div>}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Create;
