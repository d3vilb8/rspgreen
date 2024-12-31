import Header from '@/Layouts/Header';
import Nav from '@/Layouts/Nav';

import axios from 'axios';
import React, { useState } from 'react'
// import { useForm } from '@inertiajs/inertia-react';
import { IoIosArrowRoundBack } from "react-icons/io";
import { Link, useForm } from '@inertiajs/react';
import { IoMdReturnLeft } from "react-icons/io";
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css'; // Import Notyf styles
const notyf = new Notyf();

const Create = ({ employees, user_type, user, notif,clients ,lead}) => {
    const { data, setData,put, errors } = useForm({
        client_id:lead.client_id || '',
        email_address:lead.email_address ||'',
        phone_number:lead.phone_number ||'',
        source:lead.source||'',
        lead_for:lead.lead_for||'',
        lead_stage:lead. lead_stage||'',
        comment:lead.comment||''
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
        put(`/lead/${lead.id}`,{
            onSuccess: () => {
                notyf.success('Leads Edied successfully');
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
                        <label htmlFor="name">Client's Name</label>
                        <select className='w-full rounded-lg' name="client_id" value={data.client_id} onChange={handleChange} id="">
                            <option value="">-- Select Client --</option>
                            {
                                clients && clients.map((cl)=>(
                                    <option key={cl.id} value={cl.id}>{cl.name}</option>
                                ))
                            }
                        </select>
                        {/* <input id="name" className='w-full rounded-lg' name="client_id" type="text" value={data.client_id} onChange={handleChange} required /> */}
                        {errors.name && <div>{errors.name}</div>}
                    </div>

                    <div>
                        <label htmlFor="email">Email Address</label>
                        <input id="email" className='w-full rounded-lg' name="email_address" type="email" value={data.email_address} onChange={handleChange} required />
                        {errors.email && <div>{errors.email}</div>}
                    </div>

                    <div>
                        <label htmlFor="phone_no">Phone Number</label>
                        <input id="phone_no" className='w-full rounded-lg' name="phone_number" type="tel" value={data.phone_number} onChange={handleChange} required />
                        {errors.phone_no && <div>{errors.phone_no}</div>}
                    </div>

                    <div>
                        <label htmlFor="source">Source</label>
                        <input id="source" className='w-full rounded-lg' name="source" type="text" value={data.source} onChange={handleChange} required />
                        {errors.source && <div>{errors.source}</div>}
                    </div>

                    <div>
                        <label htmlFor="Lead_For">Lead For</label>
                        <input id="Lead_For" className='w-full rounded-lg' name="lead_for" type="text" value={data.lead_for} onChange={handleChange} required />
                        {errors.Lead_For && <div>{errors.Lead_For}</div>}
                    </div>

                    <div>
                        <label htmlFor="Lead_Stage">Lead Stage</label>
                        <input id="Lead_Stage" className='w-full rounded-lg' name="lead_stage" type="text" value={data.lead_stage} onChange={handleChange} required />
                        {errors.Lead_Stage && <div>{errors.Lead_Stage}</div>}
                    </div>

                    <div>
                        <label htmlFor="Comment">Comment</label>
                        <textarea id="Comment" className='w-full rounded-lg' name="comment" value={data.comment} onChange={handleChange} required />
                        {errors.Comment && <div>{errors.Comment}</div>}
                    </div>


                    <button type="submit" className='bg-[#0A1B3F] p-2 rounded-md text-white w-[20%]'>EDIT</button>
                </form>
            </div>
        </div>
    );
}

export default Create;
