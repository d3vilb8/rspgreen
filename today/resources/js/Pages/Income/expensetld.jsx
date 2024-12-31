import React from 'react';
import { Link, usePage, useForm } from '@inertiajs/react';
import Header from '@/Layouts/Header';
import Nav from '@/Layouts/Nav';
// import AdminLayout from '@/Layouts/AdminLayout';

const ExpenseTbl = () => {
    const { incomes } = usePage().props;

    // Using useForm for handling delete requests
    const { delete: deleteIncome } = useForm();

    // Function to handle delete
    const handleDelete = (incomeId) => {
        if (confirm('Are you sure you want to delete this entry?')) {
            deleteIncome(`amc-expense-delete/${incomeId}`);
        }
    };

    return (
       <div className='w-[83.2%] absolute right-0 overflow-hidden'>
         <Header/>
            <Nav/>
            <div className="p-4">
                        <h1 className="mb-4 text-3xl font-bold text-gray-800">Expense</h1>

                <Link href='/amc-expense' className='p-2 text-white bg-blue-500 rounded-md'>Create</Link>
                <br />
                <br />
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                {/* <th className="px-4 py-2 text-left">Customer Name</th> */}
                                <th className="px-4 py-2 text-left">Status</th>
                                <th className="px-4 py-2 text-left">Date</th>
                                <th className="px-4 py-2 text-left">Main Label</th>
                                <th className="px-4 py-2 text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {incomes.map((income) => (
                                <tr key={income.id} className="border-b">

                                    <td className="px-4 py-2">
                                        <span className={`px-2 py-1 rounded-full text-white ${
                                            income.status === 'Paid' ? 'bg-green-500' :
                                            income.status === 'Partially Paid' ? 'bg-yellow-500' :
                                            'bg-blue-500'
                                        }`}>
                                          {income.status === 1 ? 'Paid' : 'Unpaid'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2">{income.date}</td>
                                    <td className="px-4 py-2">{income.main_label}</td>
                                    <td className="px-4 py-2">
                                        <Link href={`/amc-expense/${income.id}`} className="px-3 py-1 mr-2 text-white bg-blue-500 rounded">Edit</Link>
                                        <button
                                            onClick={() => handleDelete(income.id)}
                                            className="px-3 py-1 text-white bg-red-500 rounded"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ExpenseTbl;
