import Header from '@/Layouts/Header';
import Nav from '@/Layouts/Nav';
import axios from 'axios';
import React, { useState } from 'react'
import { Link, useForm } from '@inertiajs/react';
import { IoMdReturnLeft } from "react-icons/io";
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css'; // Import Notyf styles
const notyf = new Notyf();

const Create = ({ employees, user_type, user, notif,contract }) => {
    const { data, setData, put, errors } = useForm({
        contractor_name:contract.contractor_name || '',
        email_address:contract.email_address||'',
        phone_number:contract.phone_number|| '',
        contractor_type:contract.contractor_type||'',
        contract_value:contract.contract_value||'',
        start_date:contract.start_date||'',
        end_date:contract.end_date||'',
        description:contract.description||'',
    });

    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/contract/${contract.id}`, {
            onSuccess: () => {
                notyf.success('Contract Edited successfully');
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
                <div className='flex justify-end'>
                    <Link href='/contract' className='flex p-1 px-4 space-x-2 text-white rounded-md bg-slate-600'>
                        <span className='grid place-items-center'><IoMdReturnLeft /></span>
                        <span>back</span>
                    </Link>
                </div>
                <form onSubmit={handleSubmit} className='space-y-3'>
                    <div>
                        <label htmlFor="contractor_name">Contractor Name</label>
                        <input
                            id="contractor_name"
                            className='w-full rounded-lg'
                            name="contractor_name"
                            type="text"
                            value={data.contractor_name}
                            onChange={handleChange}
                            required
                        />
                        {errors.contractor_name && <div>{errors.contractor_name}</div>}
                    </div>

                    <div>
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            className='w-full rounded-lg'
                            name="email_address"
                            type="email"
                            value={data.email_address}
                            onChange={handleChange}
                            required
                        />
                        {errors.email && <div>{errors.email}</div>}
                    </div>

                    <div>
                        <label htmlFor="phone_no">Phone Number</label>
                        <input
                            id="phone_no"
                            className='w-full rounded-lg'
                            name="phone_number"
                            type="tel"
                            value={data.phone_number}
                            onChange={handleChange}
                            required
                        />
                        {errors.phone_no && <div>{errors.phone_no}</div>}
                    </div>

                    <div>
                        <label htmlFor="contractor_type">Contractor Type</label>
                        <input
                            id="contractor_type"
                            className='w-full rounded-lg'
                            name="contractor_type"
                            type="text"
                            value={data.contractor_type}
                            onChange={handleChange}
                            required
                        />
                        {errors.contractor_type && <div>{errors.contractor_type}</div>}
                    </div>

                    <div>
                        <label htmlFor="contract_value">Contract Value</label>
                        <input
                            id="contract_value"
                            className='w-full rounded-lg'
                            name="contract_value"
                            type="text"
                            value={data.contract_value}
                            onChange={handleChange}
                            required
                        />
                        {errors.contract_value && <div>{errors.contract_value}</div>}
                    </div>

                    <div>
                        <label htmlFor="start_date">Start Date</label>
                        <input
                            id="start_date"
                            className='w-full rounded-lg'
                            name="start_date"
                            type="date"
                            value={data.start_date}
                            onChange={handleChange}
                            required
                        />
                        {errors.start_date && <div>{errors.start_date}</div>}
                    </div>

                    <div>
                        <label htmlFor="end_date">End Date</label>
                        <input
                            id="end_date"
                            className='w-full rounded-lg'
                            name="end_date"
                            type="date"
                            value={data.end_date}
                            onChange={handleChange}
                            required
                        />
                        {errors.end_date && <div>{errors.end_date}</div>}
                    </div>

                    <div>
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            className='w-full rounded-lg'
                            name="description"
                            value={data.description}
                            onChange={handleChange}
                            required
                        />
                        {errors.description && <div>{errors.description}</div>}
                    </div>

                    <button type="submit" className='bg-[#0A1B3F] p-2 rounded-md text-white w-[20%]'>
                        Edit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Create;
