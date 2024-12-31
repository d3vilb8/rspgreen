import React, { useState, useEffect } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { CiEdit } from "react-icons/ci";
import { RiDeleteBinLine } from "react-icons/ri";
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
// import AdminLayout from '@/Layouts/AdminLayout';
import { FaRegFilePdf } from "react-icons/fa";

import { BiArchive } from "react-icons/bi";
import Header from '@/Layouts/Header';
import Nav from '@/Layouts/Nav';
const notyf = new Notyf();

const Index = ({ data }) => {
    const { props } = usePage();
    const [permissions, setPermissions] = useState([]);
    useEffect(() => {
        if (Array.isArray(props.auth.permissions)) {
            setPermissions(props.auth.permissions);
        }
    }, [props]);
    const [query, setQuery] = useState('');
    const [filteredData, setFilteredData] = useState(data);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        const lowerCaseQuery = query.toLowerCase();
        setFilteredData(data.filter(emp => emp.name.toLowerCase().includes(lowerCaseQuery) || emp.name.toLowerCase().includes(lowerCaseQuery)));
    }, [query, data]);

    const handleSearch = event => {
        setQuery(event.target.value);
        setCurrentPage(1);
    };

    const { delete: destroy } = useForm();

    const handleDelete = (e, id) => {
        e.preventDefault();
        if (confirm('Are you sure you want to delete this record?')) {
            destroy(`/Quotation/${id}`, {
                onSuccess: () => {
                    notyf.success('Quotation deleted successfully!');
                },
                onError: () => notyf.error('Failed to delete data.')
            });
        }
    };

    const indexOfLastData = currentPage * itemsPerPage;
    const indexOfFirstData = indexOfLastData - itemsPerPage;
    const currentData = filteredData.slice(indexOfFirstData, indexOfLastData);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

    return (
     <div>
                         <Header/>
  <Nav/>
            <div className="w-[83.2%] ml-[11.5rem] absolute right-0 overflow-hidden px-3">
                <div className='flex justify-between mb-4'>
                    <input type="text" value={query} onChange={handleSearch} placeholder="Search data..." className='w-[60%] p-2 border border-gray-300 rounded-md' />
                     <Link href='Quotation/create' className='px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600'>Add Qoutation</Link>
                </div>

                <table className="w-full border border-collapse table-auto">
                    <thead className='text-white bg-gray-700'>
                        <tr>
                            <th className='p-3 text-left border'>SL No</th>
                            <th className='p-3 text-left border'>Quotation No</th>
                            <th className='p-3 text-left border'>Customer Name</th>
                            <th className='p-3 text-left border'>Date</th>
                            <th className='p-3 text-center border'>Email</th>
                            <th className='p-3 text-left border'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.length > 0 ? (
                            currentData.map((emp, index) => (
                                <tr key={emp.id} className="odd:bg-white even:bg-gray-100">
                                    <td className="p-3 border">{indexOfFirstData + index + 1}</td>
                                    <td className="p-3 border">{emp.quotation_no}</td>
                                    <td className="p-3 border">{emp.name}</td>
                                    <td className="p-3 border">{emp.quotation_date}</td>
                                    <td className="p-3 border">{emp.email}</td>
                                    <td className="p-3 text-center border">
                                        <div className="flex justify-center space-x-3">
                                            <Link className="p-2 text-white bg-green-500 rounded" href={`Quotation/${emp.id}/edit`}><CiEdit /></Link>
                                            <Link className="p-2 text-white bg-red-500 rounded" href={`quotation-print/${emp.id}`}><FaRegFilePdf /></Link>
                                            <button className="p-2 text-white bg-red-500 rounded" onClick={(e) => handleDelete(e, emp.id)}><RiDeleteBinLine /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="p-3 text-center">No data found</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className='flex justify-center mt-4'>
                    {pageNumbers.map(number => (
                        <button key={number} onClick={() => setCurrentPage(number)} className={`px-4 py-2 mx-1 rounded ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                            {number}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Index;
