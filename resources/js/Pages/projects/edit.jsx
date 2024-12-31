
// import { useForm } from '@inertiajs/inertia-react';
import Nav from '@/Layouts/Nav';
import Header from '@/Layouts/Header';
import axios from 'axios';
import React, { useState } from 'react'
// import { useForm } from '@inertiajs/inertia-react';
import { IoIosArrowRoundBack } from "react-icons/io";
import { Link ,useForm} from '@inertiajs/react';
import { IoMdReturnLeft } from "react-icons/io";
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css'; // Import Notyf styles
const notyf = new Notyf();
const EditProject = ({ project, employees,user,user_type,notif }) => {
    const { data, setData, post, errors } = useForm({
        title: project.title || '',
        estimate_time: project.estimate_time || '',
        estimate_budget: project.estimate_budget || '',
        start_date: project.start_date || '',
        end_date: project.end_date || '',
        priority: project.priority || 0,
        employee_ids: project.assignments.map(assign => assign.employee_id) || [],
    });

  const handleSubmit = (e) => {
        e.preventDefault();
        post(`/projects-update/${project.id}`, {
            onSuccess: () => {
                notyf.success('Project updated successfully');
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

    const handleChange = (e) => {
        const { options } = e.target;
        const selectedEmployees = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selectedEmployees.push(options[i].value);
            }
        }
        setData('employee_ids', selectedEmployees);
    };

    return (
        <div className='w-[85.2%] ml-[12rem]'>
    <Header user={user} notif={notif}/>
    <Nav user_type={user_type}/>

            <form onSubmit={handleSubmit} className='px-[10rem] grid  border-blue-950 rounded-b-md  space-y-3'>
            <div className='flex justify-end '>
            <Link href='/projects' className='flex p-1 px-4 space-x-2 text-white rounded-md bg-slate-600'>  <span className='grid place-items-center'><IoMdReturnLeft/></span> <span>back</span> </Link>
            </div>
                <div>
                    <label htmlFor="title">Title:</label>
                    <input className='w-full rounded-lg'
                        type="text"
                        id="title"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                    />
                    {errors.title && <div>{errors.title}</div>}
                </div>
             <div>
                    <label htmlFor="estimate_time">Estimate Time:</label>
                    <input className='w-full rounded-lg'
                        type="text"
                        id="estimate_time"
                        value={data.estimate_time}
                        onChange={(e) => setData('estimate_time', e.target.value)}
                    />
                    {errors.estimate_time && <div>{errors.estimate_time}</div>}
                </div>
                <div>
                    <label htmlFor="estimate_budget">Estimate Budget:</label>
                    <input className='w-full rounded-lg'
                        type="number"
                        id="estimate_budget"
                        value={data.estimate_budget}
                        onChange={(e) => setData('estimate_budget', e.target.value)}
                    />
                    {errors.estimate_budget && <div>{errors.estimate_budget}</div>}
                </div>
                <div>
                    <label htmlFor="start_date">Start Date:</label>
                    <input className='w-full rounded-lg'
                        type="date"
                        id="start_date"
                        value={data.start_date}
                        onChange={(e) => setData('start_date', e.target.value)}
                    />
                    {errors.start_date && <div>{errors.start_date}</div>}
                </div>
                <div>
                    <label htmlFor="end_date">End Date:</label>
                    <input className='w-full rounded-lg'
                        type="date"
                        id="end_date"
                        value={data.end_date}
                        onChange={(e) => setData('end_date', e.target.value)}
                    />
                    {errors.end_date && <div>{errors.end_date}</div>}
                </div>
                <div>
                        <label htmlFor="address">Priority</label>
                        <select name="priority" id="" value={data.priority} onChange={(e) => setData('priority', e.target.value)} className='w-full rounded-lg'>
                            <option value="">-- Select Priority --</option>
                            <option value="0">Low</option>
                            <option value="1">Medium</option>
                            <option value="2">High</option>
                        </select>
                    </div>
                {/* <div>
                    <label htmlFor="employees">Assign Employees:</label>
                    <select
                        multiple
                        name="employee_ids"
                        id="employees"
                        value={data.employee_ids}
                        onChange={handleChange}
                        className='w-full rounded-lg'
                    >
                        {employees.map((employee) => (
                            <option key={employee.id} value={employee.id}>
                                {employee.name}
                            </option>
                        ))}
                    </select>
                    {errors.employee_ids && <div>{errors.employee_ids}</div>}
                </div> */}
                <br />
                <button type="submit" className='bg-[#0A1B3F] p-2 rounded-md text-white w-[20%]'>Save</button>
            </form>
        </div>

    );
};

export default EditProject;
