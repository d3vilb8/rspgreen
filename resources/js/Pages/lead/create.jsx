import Header from '@/Layouts/Header';
import Nav from '@/Layouts/Nav';
import React, { useState, useEffect } from 'react';
import { Link, useForm } from '@inertiajs/react';
import { IoMdReturnLeft } from "react-icons/io";
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf();

const Create = ({ employees, user_type, user, notif, clients, leadSources, leadStage,projects,taskNames }) => {
    const { data, setData, post, errors } = useForm({
        client_id: '',
        email_address: '',
        phone_number: '',
        source: '',
        lead_for: '',
        lead_stage: '',
        comment: '',
        status: '',
        rate: '',
        commission: '', 
        total_amount: ''
    });

    const [selectedSource, setSelectedSource] = useState(null);

 
    const calculateCommission = (rate, commissionValue) => {
        // console.log("kjhg",rate)
        // console.log("kjhg",commissionValue)
        return rate && commissionValue ? (rate * (commissionValue / 100)).toFixed(2) : 0;
       
    };
console.log("amin",taskNames)
    
const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle rate autofill when source (task_name) is selected
    if (name === 'source') {
        const selectedTask = taskNames.find(task => task.task_name === value);
        setData({
            ...data,
            source: value,
            rate: selectedTask ? selectedTask.rate : '' // Autofill rate or reset if not found
        });
    } else {
        setData({ ...data, [name]: value });
    }
};

    useEffect(() => {
        if (data.rate && data.commission) {
           
          
            const totalAmount = (parseFloat(calculateCommission(data.rate, data.commission))).toFixed(2);
       
            setData('commission', commission);
            setData('total_amount', totalAmount);
        }
    }, [data.rate, data.commission]);


    const handleSubmit = (e) => {
        e.preventDefault();
        post('/lead', {
            onSuccess: () => {
                notyf.success('Leads Created successfully');
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
                    <Link href='/lead' className='flex p-1 px-4 space-x-2 text-white rounded-md bg-slate-600'>
                        <span className='grid place-items-center'><IoMdReturnLeft /></span>
                        <span>back</span>
                    </Link>
                </div>
                <form onSubmit={handleSubmit} className='space-y-3'>
                    {/* Client's Name */}
                    <div>
                        <label htmlFor="client_id">Client's Name</label>
                        <select
                            className='w-full rounded-lg'
                            name="client_id"
                            value={data.client_id}
                            onChange={handleChange}
                        >
                            <option value="">-- Select Client --</option>
                            {clients && clients.map((cl) => (
                                <option key={cl.id} value={cl.id}>{cl.name}</option>
                            ))}
                        </select>
                        {errors.client_id && <div>{errors.client_id}</div>}
                    </div>

                    {/* Email Address */}
                    <div>
                        <label htmlFor="email_address">Email Address</label>
                        <input
                            id="email_address"
                            className='w-full rounded-lg'
                            name="email_address"
                            type="email"
                            value={data.email_address}
                            onChange={handleChange}
                            required
                        />
                        {errors.email_address && <div>{errors.email_address}</div>}
                    </div>

                    {/* Phone Number */}
                    <div>
                        <label htmlFor="phone_number">Phone Number</label>
                        <input
                            id="phone_number"
                            className='w-full rounded-lg'
                            name="phone_number"
                            type="tel"
                            value={data.phone_number}
                            onChange={handleChange}
                            required
                        />
                        {errors.phone_number && <div>{errors.phone_number}</div>}
                    </div>

                    {/* Project Selection */}
                    <div>
                <label htmlFor="source">Project</label>
                <select
                    className="w-full rounded-lg"
                    name="source"
                    value={data.source}
                    onChange={handleChange}
                >
                    <option value="">-- Select Project --</option>
                    {taskNames && taskNames.length > 0 ? (
                        taskNames.map((task) => (
                            <option key={task.id} value={task.task_name}>
                                {task.task_name}
                            </option>
                        ))
                    ) : (
                        <option disabled>No tasks available</option>
                    )}
                </select>
                {errors.source && <div>{errors.source}</div>}
            </div>
            <div>
                <label htmlFor="rate">Rate</label>
                <input
                    id="rate"
                    className="w-full rounded-lg"
                    name="rate"
                    type="number"
                    value={data.rate}
                    onChange={handleChange}
                    readOnly // Make the field read-only to prevent manual edits
                />
                {errors.rate && <div>{errors.rate}</div>}
            </div>

                    {/* Dynamic Commission */}
                    <div>
                        <label htmlFor="commission">Commission (%)</label>
                        <input
                            id="commission"
                            className='w-full rounded-lg'
                            name="commission"
                            type="number"
                            value={data.commission}
                            onChange={handleChange}
                            placeholder="Enter Commission Percentage"
                        />
                    </div>

                    <div>
                        <label htmlFor="total_amount">Total Amount</label>
                        <input
                            id="total_amount"
                            className='w-full rounded-lg'
                            name="total_amount"
                            type="text"
                            value={data.total_amount}
                            readOnly
                        />
                    </div>

                    {/* Lead Stage */}
                    <div>
                        <label htmlFor="lead_stage">Lead Stage</label>
                        <select
                            id="lead_stage"
                            className='w-full rounded-lg'
                            name="lead_stage"
                            value={data.lead_stage}
                            onChange={handleChange}
                            required
                        >
                            <option value="">-- Select Lead Stage --</option>
                            {leadStage.length > 0 ? (
                                leadStage.map((stage, index) => (
                                    <option key={index} value={stage.name}>{stage.name}</option>
                                ))
                            ) : (
                                <option disabled>No lead stages available</option>
                            )}
                        </select>
                        {errors.lead_stage && <div>{errors.lead_stage}</div>}
                    </div>

                    {/* Status */}
                    <div>
                        <label htmlFor="status">Status</label>
                        <select
                            id="status"
                            className='w-full rounded-lg'
                            name="status"
                            value={data.status}
                            onChange={handleChange}
                            required
                        >
                            <option value="">-- Select Status --</option>
                            <option value="open">Open</option>
                            <option value="closed">Closed</option>
                            <option value="in_progress">In Progress</option>
                        </select>
                        {errors.status && <div>{errors.status}</div>}
                    </div>

                    {/* Comment */}
                    <div>
                        <label htmlFor="comment">Comment</label>
                        <textarea
                            id="comment"
                            className='w-full rounded-lg'
                            name="comment"
                            value={data.comment}
                            onChange={handleChange}
                            required
                        />
                        {errors.comment && <div>{errors.comment}</div>}
                    </div>

                    {/* Rate, Commission, and Total Amount */}
                    

                    <button type="submit" className='bg-[#0A1B3F] p-2 rounded-md text-white w-[20%]'>
                        Create
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Create;
