import Header from '@/Layouts/Header';
import Nav from '@/Layouts/Nav';

import axios from 'axios';
import React, { useState } from 'react'
import { Link, useForm } from '@inertiajs/react';
import { IoMdReturnLeft } from "react-icons/io";
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css'; // Import Notyf styles
const notyf = new Notyf();

const Create = ({ employees, user_type, user, notif, }) => {
    const { data, setData, post, errors } = useForm({
        deal_name: '',
        phone: '',
        price: '',
        clients: '',
    });

    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/deal', {
            onSuccess: () => {
                notyf.success('Deal Created successfully');
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
                    <Link href='/deal' className='flex p-1 px-4 space-x-2 text-white rounded-md bg-slate-600'>
                        <span className='grid place-items-center'><IoMdReturnLeft /></span>
                        <span>back</span>
                    </Link>
                </div>
                <form onSubmit={handleSubmit} className='space-y-3'>
                    <div>
                        <label htmlFor="deal_name">Deal Name</label>
                        <input
                            id="deal_name"
                            className='w-full rounded-lg'
                            name="deal_name"
                            type="text"
                            value={data.deal_name}
                            onChange={handleChange}
                            required
                        />
                        {errors.deal_name && <div>{errors.deal_name}</div>}
                    </div>

                    <div>
                        <label htmlFor="phone">Phone</label>
                        <input
                            id="phone"
                            className='w-full rounded-lg'
                            name="phone"
                            type="tel"
                            value={data.phone}
                            onChange={handleChange}
                            required
                        />
                        {errors.phone && <div>{errors.phone}</div>}
                    </div>

                    <div>
                        <label htmlFor="price">Price</label>
                        <input
                            id="price"
                            className='w-full rounded-lg'
                            name="price"
                            type="number"
                            value={data.price}
                            onChange={handleChange}
                            required
                        />
                        {errors.price && <div>{errors.price}</div>}
                    </div>

                    <div>
                        <label htmlFor="clients">Clients</label>
                        <input
                            id="clients"
                            className='w-full rounded-lg'
                            name="clients"
                            type="text"
                            value={data.clients}
                            onChange={handleChange}
                            required
                        />
                        {errors.clients && <div>{errors.clients}</div>}
                    </div>

                    <button type="submit" className='bg-[#0A1B3F] p-2 rounded-md text-white w-[20%]'>
                        Create
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Create;
