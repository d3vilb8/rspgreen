import React, { useState, useRef, useEffect } from 'react';
import { FaPlus, FaXmark } from "react-icons/fa6";
import { useForm } from '@inertiajs/react';
import Choices from 'choices.js';
import 'choices.js/public/assets/styles/choices.min.css';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css'; // Import Notyf styles
const notyf = new Notyf();

const AssignView = ({ assin, emp }) => {
    const [modal, setModal] = useState(false);
    const [members, setMembers] = useState(false);
    const [modalTask, setModalTask] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // State for search term
    const [notifyModal, setNotifyModal] = useState(false);  // Add this line
    const selectRef = useRef(null);

    // Initialize useForm hook for estimate hours
    const { data, setData, post, errors } = useForm({
        estimateHours: 0,
        employee_id: [],
    });

    useEffect(() => {
        if (!modal && !members) return; // Only initialize Choices.js when modals are open

        const choicesInstance = new Choices(selectRef.current, {
            removeItemButton: true,
            searchEnabled: true,
        });

        // Preselect options if any are passed in as selectedOptions
        if (data.employee_id.length > 0) {
            data.employee_id.forEach(option => {
                choicesInstance.setChoiceByValue(option);
            });
        }

        selectRef.current.addEventListener('change', (event) => {
            const selectedValues = Array.from(event.target.selectedOptions).map(option => option.value);
            setData('employee_id', selectedValues);
        });

        return () => {
            choicesInstance.destroy(); // Clean up Choices instance
        };
    }, [modal, members, data.employee_id, setData]);

    const handleOpenModal = (task) => {
        if (!task) {
            console.error('Task is null or undefined');
            return;
        }
        setModalTask(task);
        setModalTask({
            ...task,
            estimate_time: task.estimate_time || 0, // Ensure estimate_time is set, defaulting to 0 if undefined
        });
        setData('estimateHours', task.estimate_hours || 0);
        setModal(true);
    };

    const handleOpenModalMembers = (task) => {
        if (!task) {
            console.error('Task is null or undefined');
            return;
        }
        setModalTask(task);
        setData('employee_id', task.users.map(user => user.id) || []);
        setMembers(true);
    };

    // Handle the change in estimate hours input
    const handleEstimateHoursChange = (e) => {
        setData('estimateHours', e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        if (!modalTask?.id) {
            notyf.error('No valid task ID available');
            console.error('No valid task ID available');
            return;
        }

        // Find the corresponding project from `assin` that matches the task's project
        let project = null;
        for (let p of assin) {
            if (p.tasks.some(task => task.id === modalTask.id)) {
                project = p;
                break; // Stop looping once the project is found
            }
        }

        if (!project) {
            notyf.error('Project not found');
            console.error('Project not found');
            return;
        }

        // Calculate the total estimate hours for all tasks under the project
        const totalTaskEstimateHours = project.tasks.reduce((total, task) => total + task.estimate_time, 0);

        // Check if the total task estimate hours exceed the project estimate time
        if (totalTaskEstimateHours > project.estimate_time) {
            notyf.error(
                `Total task estimate hours (${totalTaskEstimateHours} hours) exceed the project estimate hours (${project.estimate_time} hours).`
            );
            return; // Prevent form submission
        }

        // Determine the URL based on whether members are involved
        const url = members ? `/updateEstimateemp/${modalTask.id}` : `/updateEstimateHours/${modalTask.id}`;

        post(url, {
            onSuccess: () => {
                notyf.success('Task updated successfully');
                setModal(false); // Close modal on successful submission
                setMembers(false); // Reset members state
            },
            onError: (errors) => {
                // Handle errors returned from the server
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
                console.error('Server-side validation errors:', errors);
            },
        });
    };

    // Filter projects based on the search term
    const filteredProjects = assin.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='w-full'>
            {/* Search bar for filtering projects */}
            <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-[40%] mt-5 p-2 border rounded-md"
            />
     <div className={`modal fixed top-0 left-0 w-full h-full transition-all duration-500 bg-black/50 flex justify-center items-center ${modal ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'}`}>
                <div className='w-2/5 p-4 px-6 bg-white rounded-md'>
                    <div className='flex justify-between'>
                        <h1 className='text-xl font-semibold'>Update Task</h1>
                        <button onClick={() => setModal(false)}><FaXmark /></button>
                    </div>
                    <hr className='my-2' />
                    <form className='py-3 space-y-5' onSubmit={handleSubmit}>
                        <div>
                            <label className='block text-sm font-medium text-gray-700'>Estimate Hours:</label>
                            <input
                                type="number"
                                value={data.estimateHours}
                                onChange={handleEstimateHoursChange}
                                className='w-full p-2 border rounded-md'
                                placeholder='Enter estimate hours'
                                required
                            />
                            {errors.estimateHours && <p className="text-sm text-red-500">{errors.estimateHours}</p>}
                        </div>
                        <div className='text-right'>
                            <button
                                type='submit'
                                className='px-8 py-2 text-sm font-semibold text-white bg-blue-500 rounded-md'
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
                        <div className={`modal fixed top-0 left-0 w-full h-full transition-all duration-500 bg-black/50 flex justify-center items-center ${members ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'}`}>
                <div className='w-2/5 p-4 px-6 bg-white rounded-md'>
                    <div className='flex justify-between'>
                        <h1 className='text-xl font-semibold'>Assign Employees</h1>
                        <button onClick={() => setMembers(false)}><FaXmark /></button>
                    </div>
                    <hr className='my-2' />
                    <form className='py-3 space-y-5' onSubmit={handleSubmit}>
                        <div>
                            <label className='block text-sm font-medium text-gray-700'>Assign Employees:</label>
                            <select
                                ref={selectRef}
                                multiple
                                value={data.employee_id}
                                className='w-full p-2 border rounded-md'
                                required>
                                {emp.length > 0 ? emp.map(e => (
                                    <option key={e.id} value={e.id}>{e.name}</option>
                                )) : (
                                    <option value="" disabled>No employees available</option>
                                )}
                            </select>
                        </div>
                        <div className='text-right'>
                            <button
                                type='submit'
                                className='px-8 py-2 text-sm font-semibold text-white bg-blue-500 rounded-md'
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            {/* Render filtered projects */}
            {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                    <div key={project.id} className="mt-5 text-center border heading">
                        {project.error_message && (
                            <div className="p-2 text-red-500 error-message">
                                {project.error_message}
                            </div>
                        )}
                        <div className="bg-[#01214F] p-2 text-white">
                            <h1 className="capitalize">
                                Project name: {project.title} {project.estimate_time} hours
                            </h1>
                        </div>

                        <div className="grid grid-cols-4">
                            {project.tasks.length > 0 ? (
                                project.tasks.map((task) => (
                                    <div key={task.id} className="border border-t-0">
                                        <div className="bg-[#0C94CA] p-2 text-white text-[0.9rem] flex justify-between">
                                            <h1 className="text-center">
                                                {task.task_name} {task.task_name !== "NON-BILLABLE" ? `${task.estimate_hours} hours` : ''}
                                            </h1>
                                            {task.task_name.trim() !== "NON-BILLABLE" && (
                                                <button
                                                    className="ml-2 text-white"
                                                    onClick={() => handleOpenModal(task)}
                                                >
                                                    <FaPlus />
                                                </button>
                                            )}
                                        </div>
                                        <div className="employee">
                                            <table className="w-full border">
                                                <thead>
                                                    <tr>
                                                        <th className="p-1 text-left border-b-2">Members</th>
                                                        <th className="border-b-2">
                                                            <button
                                                                className="ml-2 text-black"
                                                                onClick={() => handleOpenModalMembers(task)}
                                                            >
                                                                <FaPlus />
                                                            </button>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {task.users.length > 0 ? (
                                                        task.users.map((user) => (
                                                            <tr className="p-2 border" key={user.id}>
                                                                <td className="p-3 text-left">{user.name}</td>
                                                                <td>{user.time_number_sum} hours</td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="2" className="p-2 text-center">No members assigned</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="p-4 text-center">No tasks available</p>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <p className="p-4 text-center">No projects available</p>
            )}
        </div>
    );
};

export default AssignView;
