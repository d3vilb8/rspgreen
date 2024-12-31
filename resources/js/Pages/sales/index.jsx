// import AdminLayout from '@/Layouts/AdminLayout'
import { Link, useForm } from '@inertiajs/react'
import React from 'react'
import { FaPencil } from 'react-icons/fa6';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import Modal from '@/Components/Modal';
import Header from '@/Layouts/Header';
import Nav from '@/Layouts/Nav';
import { FaPrint } from 'react-icons/fa';

const notyf = new Notyf();
export default function index({sales}) {
    const formatLabel = (label) => {
        return label
            .split('_') // Split by underscore
            .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
            .join(' '); // Join with a space
    };
    const { delete: destroy } = useForm()
    function handleDelete(id) {
        event.preventDefault();
        if (confirm("Are you sure you want to delete this sale?")) {
            destroy(route('sales.destroy', id), {
                onSuccess: () => {
                    notyf.success('Sales deleted successfully!');
                },
                onError: () => {
                    notyf.error('Failed to delete sales.');
                }
            });
        }
    }
    return (
         <div className='w-[83.2%] ml-[11.5rem] absolute right-0 overflow-hidden'>
        <Header/>
        <Nav/>
            {/* <Modal show={true} maxWidth='2xl'>
                <div className='flex items-center justify-between p-2 px-5'>
                    <h1>Sales</h1>
                    <button>X</button>
                </div>
                <div>
                    <img src="https://equi.org.in/demo/amc/img/setting/logo_1718790982.png" alt="" />
                    <div>

                    </div>
                </div>
            </Modal> */}
            <div className='p-6 bg-white rounded-lg shadow'>
                <div className='flex justify-between mb-4'>
                    <input
                        type="text"

                        placeholder="Search data..."
                        className='w-[60%] p-2 border border-gray-300 rounded-md'
                    />
                    <Link href='sales/add' className='px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600'>
                        Add Sales
                    </Link>
                </div>

                <table className="w-full border border-collapse table-auto">
                    <thead className='text-white bg-gray-700'>
                        <tr>
                            <th className='p-3 text-left border'>Bill No.</th>
                            <th className='p-3 text-left border'>Customer Name</th>
                            <th className='p-3 text-left border'>Date</th>
                            <th className='p-3 text-left border'>Billing Address</th>
                            <th className='p-3 text-left border'>Status</th>
                            <th className='p-3 text-left border'>Type</th>
                            <th className='p-3 text-center border'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            sales && sales.map((sale,index)=>(
                                <tr>
                                    <td className="p-3">
                                        {sale.bill_no}
                                    </td>
                                    <td className="p-3">
                                        {sale.name}
                                    </td>
                                    <td className="p-3">
                                        {sale.date}
                                    </td>
                                    <td className="p-3">
                                        {sale.billing_address}
                                    </td>
                                    <td className="p-3">
                                        { formatLabel(sale.status) }
                                    </td>
                                    <td className="p-3">
                                        { sale.invoice_type === 'pi' ? 'Proforma Invoice' : sale.invoice_type === 'tax' ? 'Tax Invoice' : 'Cash Invoice' }
                                    </td>
                                    <td className='flex gap-1 p-3'>
                                        <Link href={route('sale.print',sale.id)} className='flex items-center gap-1 px-2 py-1 text-sm font-medium text-white rounded bg-emerald-500'><span><FaPrint/></span></Link>
                                        <Link href={`/sales/${sale.id}/edit`} className='flex items-center gap-1 px-2 py-1 text-sm font-medium text-white bg-blue-500 rounded'><span>Edit</span></Link>
                                        <button type='button' onClick={() => handleDelete(sale.id)} className='flex items-center gap-1 px-2 py-1 text-sm font-medium text-white bg-red-500 rounded'><span>Delete</span></button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}
