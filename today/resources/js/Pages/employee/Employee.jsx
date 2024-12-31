 import React, { useState, useEffect } from 'react';
import Header from '@/Layouts/Header';
import Nav from '@/Layouts/Nav';
import { Link } from '@inertiajs/react';
import { FaPlus, FaEdit } from "react-icons/fa";
import { MdLockClock } from "react-icons/md";
import { CiEdit, CiImageOn } from "react-icons/ci";
import { RiDeleteBinLine } from "react-icons/ri";
import axios from 'axios';
import { MdAssignmentTurnedIn } from "react-icons/md";
import { MdOutlineAssignmentLate } from "react-icons/md";
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css'; // Import Notyf styles
import { IoIosEye } from "react-icons/io";
const notyf = new Notyf();
const Employee = ({ user, employee, user_type, notif }) => {
    const [query, setQuery] = useState('');
    const [filteredEmployees, setFilteredEmployees] = useState(employee);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Adjust items per page as needed

    useEffect(() => {
        // Filter employees based on the search query
        const filtered = employee.filter(emp =>
            emp.name.toLowerCase().includes(query.toLowerCase()) ||
            emp.email.toLowerCase().includes(query.toLowerCase()) ||
            emp.roles.some(role => role.name.toLowerCase().includes(query.toLowerCase())) ||
            emp.employees.some(empDetail => empDetail.phone.toLowerCase().includes(query.toLowerCase()))
        );
        setFilteredEmployees(filtered);
    }, [query, employee]);

    const handleSearch = (event) => {
        setQuery(event.target.value);
        setCurrentPage(1); // Reset to first page when search query changes
    };

    const handleDelete = (e, id) => {
        e.preventDefault();
        if (confirm('Are you sure you want to delete this employee?')) {
            axios.get(`/employees-destroy/${id}`)
                .then(response => {
                    console.log(response);
                      notyf.success('Employee deleted successfully');
                    // alert('Employee deleted successfully');
                    // Optionally, you might want to refresh the data here
                    // window.location.reload();
                })
                .catch(error => {
                    console.log(error);
                });
        }
    };

    // Pagination logic
    const indexOfLastEmployee = currentPage * itemsPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - itemsPerPage;
    const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

    // Page numbers
    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

    return (
        <div className='w-[85.2%] absolute right-0 overflow-hidden'>
            <Header user={user} notif={notif} />
            <Nav user_type={user_type} />
            <div className='px-8 py-4 table-section rounded-b-md'>
                <div className='flex justify-between'>
                    <div className='w-[40%]'>
                        <input
                            type="text"
                            value={query}
                            onChange={handleSearch}
                            placeholder="Search employees..."
                            className='p-2 border rounded-md w-[80%]'
                        />
                    </div>
                    <div className='px-3'>
                        <Link href='employees-create' className='underline'>
                            Create New Employee
                        </Link>
                    </div>
                </div>
                <br />
                <table className="table w-full p-4 border">
                    <thead className='border bg-[#0A1B3F] text-white'>
                        <tr>
                            {/* <th className='p-3 text-left border'>Employee ID</th> */}
                            <th className='p-3 text-left border'>Name</th>
                            <th className='p-3 text-left border'>Email</th>
                            {/* <th className='p-3 text-left border'>Branch</th>
                            <th className='p-3 text-left border'>Department</th> */}
                            {/* <th className='p-3 text-left border'>Phone</th> */}
                            {/* <th className='p-3 text-left border'>Holiday work assign</th> */}
                            <th className='p-3 text-left border'>Action</th>
                            {/* <th className='p-3 text-left border'>Unlock Timesheet</th> */}

                        </tr>
                    </thead>
                    <tbody>
                        {currentEmployees.length > 0 ? (
                            currentEmployees.map(emp => (
                                <tr key={emp.id}>
                                      {/* <td className='p-3 border'>
                                        {emp.employees.map(empDetail => (
                                            <div key={empDetail.id}>{empDetail.employee_id}</div>
                                        ))}
                                    </td> */}
                                    <td className='p-3 border'>{emp.name}</td>
                                    <td className='p-3 border'>{emp.email}</td>
                                    {/* <td className='p-3 border'>
                                        {emp.roles.map(role => (
                                            <div key={role.id}>{role.branch}</div>
                                        ))}
                                    </td> */}
                                    {/* <td className='p-3 border'>
                                        {emp.employees.map(empDetail => (
                                            <div key={empDetail.id}>{empDetail.branch_id}</div>
                                        ))}
                                    </td>
                                     <td className='p-3 border'>
                                        {emp.employees.map(empDetail => (
                                            <div key={empDetail.id}>{empDetail.department_id}</div>
                                        ))}
                                    </td>
                                    <td className='p-3 border'>
                                        {emp.employees.map(empDetail => (
                                            <div key={empDetail.id}>{empDetail.designation_id}</div>
                                        ))}
                                    </td> */}
                                     {/* <td className='grid border border-b-0 place-items-center'>
                                        <Link href={`holiday-assign/${emp.id}`}>
                                          <MdOutlineAssignmentLate className='text-[1.5rem] text-green-600'/>
                                        </Link>
                                    </td> */}
                                    <td className='border'>
                                        <div className='flex justify-center space-x-3'>
                                            <Link className='text-white text-[1.1rem] bg-[#0C7785] p-1 rounded-md' href={`employees/show/${emp.id}`}>
                                                <IoIosEye/>
                                            </Link>
                                            <Link className='text-white text-[1.1rem] bg-[#0C7785] p-1 rounded-md' href={`employees-edit/${emp.id}`}>
                                                <CiEdit />
                                            </Link>
                                            <button className='text-white text-[1.1rem] bg-[#FF3A6E] p-1 rounded-md' onClick={(e) => handleDelete(e, emp.id)}>
                                                <RiDeleteBinLine />
                                            </button>
                                        </div>
                                    </td>

                                    {/* <td className='grid border border-b-0 place-items-center'>
                                        <Link href={`timesheetemp-employee/${emp.id}`}>
                                            <MdLockClock className='text-[2rem] text-red-700' />
                                        </Link>
                                    </td> */}

                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className='p-3 text-center'>No employees found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div className='flex justify-center mt-4'>
                    {pageNumbers.map(number => (
                        <button
                            key={number}
                            onClick={() => setCurrentPage(number)}
                            className={`px-4 py-2 mx-1 rounded ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        >
                            {number}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Employee;
