import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import Header from '@/Layouts/Header';
import Nav from '@/Layouts/Nav';

function JournalEntry({user,nextJournalNumber}) {
    const { data, setData, post } = useForm({
        journal_number: nextJournalNumber,
        transaction_date: '',
        reference: '',
        description: '',
        rows: [{ account: '', debit: 0, credit: 0, description: '', amount: 0 }],
    });

    const addRow = () => {
        setData('rows', [...data.rows, { account: '', debit: 0, credit: 0, description: '', amount: 0 }]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/journals', data, {
            onSuccess: () => {
                // Optionally reset the form or navigate elsewhere
                setData({
                    journal_number: nextJournalNumber,
                    transaction_date: '',
                    reference: '',
                    description: '',
                    rows: [{ account: '', debit: 0, credit: 0, description: '', amount: 0 }],
                });
            },
            onError: (errors) => {
                console.error('There was an error creating the journal entry!', errors);
            }
        });
    };

    return (
        <div className='w-[83.2%] ml-[11.5rem] absolute right-0 overflow-hidden'>
      <Header  />
      <Nav  />
        <form onSubmit={handleSubmit} className="p-6 mx-auto bg-gray-100 ">
            {/* Header Section */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Journal Entry Create</h1>
                <div className="text-sm text-gray-500">Dashboard {'>'} Double Entry {'>'} Journal Entry</div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 gap-4 p-4 mb-6 bg-white rounded-lg shadow-sm md:grid-cols-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Journal Number</label>
                    <input
                        type="text"
                        value={data.journal_number}
                        readOnly
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Transaction Date</label>
                    <input
                        type="date"
                        value={data.transaction_date}
                        onChange={(e) => setData('transaction_date', e.target.value)}
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Reference</label>
                    <input
                        type="text"
                        value={data.reference}
                        onChange={(e) => setData('reference', e.target.value)}
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        rows="2"
                    ></textarea>
                </div>
            </div>

            {/* Table Section */}
            <div className="p-4 bg-white rounded-lg shadow-sm">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr className="text-left bg-gray-200">
                            <th className="p-3 text-sm font-semibold text-gray-700 border-b">Account</th>
                            <th className="p-3 text-sm font-semibold text-gray-700 border-b">Debit</th>
                            <th className="p-3 text-sm font-semibold text-gray-700 border-b">Credit</th>
                            <th className="p-3 text-sm font-semibold text-gray-700 border-b">Description</th>
                            <th className="p-3 text-sm font-semibold text-gray-700 border-b">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.rows.map((row, index) => (
                            <tr key={index}>
                                <td className="p-3 border-b">
                                    <input
                                        type="text"
                                        placeholder="1060 - Checking Account"
                                        value={row.account}
                                        onChange={(e) => {
                                            const newRows = [...data.rows];
                                            newRows[index].account = e.target.value;
                                            setData('rows', newRows);
                                        }}
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </td>
                                <td className="p-3 border-b">
                                    <input
                                        type="number"
                                        placeholder="Debit"
                                        value={row.debit}
                                        onChange={(e) => {
                                            const value = parseFloat(e.target.value) || 0;
                                            const newRows = [...data.rows];
                                            newRows[index].debit = value;
                                            setData('rows', newRows);
                                        }}
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </td>
                                <td className="p-3 border-b">
                                    <input
                                        type="number"
                                        placeholder="Credit"
                                        value={row.credit}
                                        onChange={(e) => {
                                            const value = parseFloat(e.target.value) || 0;
                                            const newRows = [...data.rows];
                                            newRows[index].credit = value;
                                            setData('rows', newRows);
                                        }}
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </td>
                                <td className="p-3 border-b">
                                    <input
                                        type="text"
                                        placeholder="Description"
                                        value={row.description}
                                        onChange={(e) => {
                                            const newRows = [...data.rows];
                                            newRows[index].description = e.target.value;
                                            setData('rows', newRows);
                                        }}
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </td>
                                <td className="p-3 text-right border-b">
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={row.amount}
                                        className="w-full text-right border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <button type="button" onClick={addRow} className="flex items-center px-4 py-2 mt-4 text-sm font-medium text-white bg-teal-500 rounded-md hover:bg-teal-600">
                    + Add Row
                </button>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-6">
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Submit</button>
            </div>
        </form>
        </div>
    );
}

export default JournalEntry;
