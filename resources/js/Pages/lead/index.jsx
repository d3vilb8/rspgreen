import React, { useState, useEffect } from 'react';
import Header from '@/Layouts/Header';
import Nav from '@/Layouts/Nav';
import axios from 'axios';
import { Link, useForm } from '@inertiajs/react';
import { RiDeleteBinLine } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import { Notyf } from 'notyf';
import { FaEye } from 'react-icons/fa';  // Import the eye icon
import 'notyf/notyf.min.css';

const notyf = new Notyf();

function Index({ user, user_type, notif, leads, assignEmp,projects }) {
    let dummyLeads = [];
    const [query, setQuery] = useState('');
    const [filteredLeads, setFilteredLeads] = useState(leads.length > 0 ? leads : dummyLeads);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const { delete: destroy } = useForm();

    console.log("assignEmp", assignEmp);

    useEffect(() => {
        const filtered = filteredLeads.filter(lead =>
            lead.name?.toLowerCase().includes(query.toLowerCase()) ||
            lead.subject?.toLowerCase().includes(query.toLowerCase()) ||
            lead.lead_stage?.toLowerCase().includes(query.toLowerCase()) ||
            lead.lead_source?.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredLeads(filtered);
    }, [query, leads]);

    const indexOfLastLead = currentPage * itemsPerPage;
    const indexOfFirstLead = indexOfLastLead - itemsPerPage;
    const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);

    const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    const handleSearch = (event) => {
        setQuery(event.target.value);
        setCurrentPage(1);
    };

    const handleDelete = (e, id) => {
        e.preventDefault();
        if (confirm('Are you sure you want to delete?')) {
            destroy(`/lead/${id}`, {
                onSuccess: () => {
                    console.log('Form submitted successfully');
                    notyf.success('Leads Deleted successfully');
                    window.location.reload();
                },
                onError: (err) => {
                    console.log('Form submission error', err);
                },
            });
        } else {
            console.log("Error fetching data");
        }
    };

    const handleAssignChange = (leadId, empId) => {
        console.log(`Lead ID: ${leadId}, Assigned Employee ID: ${empId}`);
        axios.post('/lead/assign', { leadId, empId })
            .then(response => {
                notyf.success('Employee assigned successfully');
             
            })
            .catch(error => {
                notyf.error('Failed to assign employee');
                console.error(error);
            });
    };

    return (
        <div className="w-[85.2%] absolute right-0 overflow-hidden">
            <Header user={user} notif={notif} />
            <Nav user_type={user_type} />
            <div className="table-section border-[#0A1B3F] py-3 px-8 rounded-b-md">
                <div className="flex justify-between">
                    <div className="w-[40%]">
                        <input
                            type="text"
                            value={query}
                            onChange={handleSearch}
                            placeholder="Search leads..."
                            className="p-2 border rounded-md w-[80%]"
                        />
                    </div>
                    <div className="px-4">
                        <Link href="/lead/create" className="flex space-x-2 underline">
                            <span className="font-bold">Create New Lead</span>
                        </Link>
                    </div>
                </div>
                <br />
                <table className="table w-full p-4 border">
                    <thead className="border bg-[#0A1B3F] text-white">
                        <tr>
                            <th className="p-3 text-left border">Client Name</th>
                            <th className="p-3 text-left border">Email</th>
                            <th className="p-3 text-left border">Phone No</th>
                            <th className="p-3 text-left border">Lead Source</th>
                            <th className="p-3 text-left border">Status</th>
                            <th className="p-3 text-left border">Lead Stage</th>
                            <th className="p-3 text-left border">Assign</th>
                            {/* <th className="p-3 text-left border">Agent Name</th> */}
                            <th className="p-3 text-left border">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentLeads.length > 0 ? (
                            currentLeads.map(lead => (
                                <tr key={lead.id}>
                                    <td className="p-3 border">{lead.client_name}</td>
                                    <td className="p-3 border">{lead.email_address}</td>
                                    <td className="p-3 border">{lead.phone_number}</td>
                                    <td className="p-3 border">{lead.source}</td>
                                    <td className="p-3 border">{lead.status}</td>
                                    <td className="p-3 border">{lead.lead_stage}</td>
                                   
                                    <td className="p-3 border">
                                        <select
                                            className="border rounded p-2"
                                            defaultValue={lead.assignedEmpId || ''}
                                            onChange={(e) => handleAssignChange(lead.id, e.target.value)}
                                        >
                                            <option value="" disabled>Select Employee</option>
                                            {assignEmp.map(emp => (
                                                <option key={emp.id} value={emp.id}>
                                                    {emp.name}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    {/* <td className="p-3 border">{lead.d}</td> */}
                                    <td className="border">
                                        <div className="flex justify-center space-x-3">
                                            <Link
                                                className="text-green-800 text-[1.1rem] bg-[#0C7785] p-1 rounded-md"
                                                href={`/lead/${lead.id}/edit`}>
                                                <CiEdit className="text-white" />
                                            </Link>
                                            <Link
                                                className="text-green-800 text-[1.1rem] bg-[#0C7785] p-1 rounded-md"
                                                href={`/lead/${lead.id}/view`}>

                                                <FaEye className="text-white" />
                                            </Link>
                                            <button
                                                className="text-white text-[1.1rem] bg-[#FF3A6E] p-1 rounded-md"
                                                onClick={(e) => handleDelete(e, lead.id)}>
                                                <RiDeleteBinLine />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="p-3 text-center">No leads found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div className="flex justify-center mt-4">
                    {pageNumbers.map(number => (
                        <button
                            key={number}
                            onClick={() => setCurrentPage(number)}
                            className={`px-4 py-2 mx-1 rounded ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                            {number}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Index;
