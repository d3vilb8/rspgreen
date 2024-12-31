import Header from '@/Layouts/Header';
import Nav from '@/Layouts/Nav';

import axios from 'axios';
import React, { useState } from 'react'
// import { useForm } from '@inertiajs/inertia-react';
import { IoIosArrowRoundBack } from "react-icons/io";
import { Link,useForm } from '@inertiajs/react';
import { IoMdReturnLeft } from "react-icons/io";
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css'; // Import Notyf styles
const notyf = new Notyf();
const Create = ({ employees,user_type,user ,notif}) => {
    const { data, setData, post, errors } = useForm({
        title: '',
        estimate_time: '',
        estimate_budget: '',
        start_date: '',
        end_date: '',
        employee_id: '',
        status: '',
        priority:0,
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
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/projects-store', {
            onSuccess: () => {
                notyf.success('Project Created successfully');
            },
             onError: (errors) => {
                // Check if 'errors' is an object and has entries
                if (typeof errors === 'object' && errors !== null) {
                    Object.entries(errors).forEach(([key, value]) => {
                        if (Array.isArray(value)) {
                            // If value is an array (e.g., validation messages)
                            value.forEach(message => notyf.error(message));
                        } else {
                            // Single error message
                            notyf.error(value);
                        }
                    });
                } else {
                    // Handle unexpected error format
                    notyf.error('An unexpected error occurred.');
                }
            }
        });
    };
    return (
        <div className='w-[85.2%] ml-[11.5rem]'>
            <Header user={user} notif={notif}/>
            <Nav user_type={user_type}/>
            <div className='px-[10rem] grid  border-blue-950 rounded-b-md  space-y-3'>
                <div className='flex justify-end '>
                    <div className='flex'>
                        <div className=''>
                        <Link href='/projects' className='flex p-1 px-4 space-x-2 text-white rounded-md bg-slate-600'>  <span className='grid place-items-center'><IoMdReturnLeft/></span> <span>back</span> </Link>
                        </div>
                        {/* <a>
                        Add Employee
                    </a> */}
                    </div>
                </div>
                <form onSubmit={handleSubmit} className='space-y-3'>
                    <div>
                        <label htmlFor="email">Project Name</label>
                        <input id="name" className='w-full rounded-lg' name="title" type="text" value={data.title} onChange={handleChange} required />
                        {errors.name && <div>{errors.name}</div>}
                    </div>
                     <div>
                        <label htmlFor="email">Estimate Hours</label>
                        <input className='w-full rounded-lg' id="email" name='estimate_time' type="number" value={data.estimate_time} onChange={handleChange} required />
                    </div>

                    {/* <div>
                        <label htmlFor="email">Employee Assign</label>
                        <select multiple name="employee_id" id="" value={data.employee_id} onChange={Mulitple} className='w-full rounded-lg'>
                            <option value="">Select Employee</option>
                            {employees.map((employee) => (
                                <option key={employee.id} value={employee.id}>{employee.name}</option>
                            ))}
                        </select>
                    </div> */}
                    <div>
                        <label htmlFor="password">Estimate Budget</label>
                        <input className='w-full rounded-lg' id="password" name='estimate_budget' type="number" value={data.estimate_budget} onChange={handleChange} required />
                    </div>
                    <div>
                        <label htmlFor="phone">Start Date</label>
                        <input className='w-full rounded-lg' id="phone" name='start_date' type="date" value={data.start_date} onChange={handleChange} required />
                    </div>
                    <div>
                        <label htmlFor="address">End Date</label>
                        <input className='w-full rounded-lg' id="address" name='end_date' type="date" value={data.end_date} onChange={handleChange} required />
                    </div>
                    <div>
                        <label htmlFor="address">Priority</label>
                        <select name="priority" id="" value={data.priority} onChange={handleChange} className='w-full rounded-lg'>
                            <option value="">-- Select Priority --</option>
                            <option value="0">Low</option>
                            <option value="1">Medium</option>
                            <option value="2">High</option>
                        </select>
                    </div>

                    {/* <div>
                        <label htmlFor="joinning_date">Status</label>
                        <input className='w-full rounded-lg' id="joinning_date" name='status' type="date" value={data.status} onChange={handleChange} required />
                    </div> */}
                    <br/>
                    <button type="submit" className='bg-[#0A1B3F] p-2 rounded-md text-white w-[20%]'>Create</button>
                </form>
            </div>
        </div>
    )
}

export default Create;
