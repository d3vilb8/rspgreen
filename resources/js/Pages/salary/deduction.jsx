import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import Header from '@/Layouts/Header';
import Nav from '@/Layouts/Nav';

export default function DeductionManagement({ deductions }) {
    const [isModalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState('create'); // 'create' or 'edit'
    const [selectedDeduction, setSelectedDeduction] = useState(null);

    const openModal = (type, deduction = null) => {
        setModalType(type);
        setSelectedDeduction(deduction);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedDeduction(null);
    };

    const deleteDeduction = (id) => {
        if (confirm('Are you sure you want to delete this deduction?')) {
            Inertia.delete(`/deductions/${id}`);
        }
    };

    return (
        <>
            <Header />
            <Nav />
            <div className="flex">
                {/* Sidebar */}
                <aside className="w-1/4 bg-gray-800 text-white p-4">
                    <ul className="space-y-4">
                        <li className="font-semibold border-b border-gray-500 pb-2">Branch</li>
                        <li>Department</li>
                        <li>Designation</li>
                        <li>Leave Type</li>
                    </ul>
                </aside>

                {/* Main Content */}
                <div className="w-3/4 p-6 bg-gray-100">
                    <h1 className="text-2xl font-semibold mb-4">Salary Deductions</h1>
                    <button
                        onClick={() => openModal('create')}
                        className="text-green-600 font-medium hover:underline mb-4 block"
                    >
                        Create Deduction
                    </button>

                    <table className="w-full bg-white rounded shadow">
                        <thead>
                            <tr className="bg-gray-200 text-left">
                                <th className="px-4 py-2">Deduction Title</th>
                                <th className="px-4 py-2">Amount</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deductions && deductions.length > 0 ? (
                                deductions.map((deduction) => (
                                    <tr key={deduction.id} className="border-b">
                                        <td className="px-4 py-2">{deduction.title}</td>
                                        <td className="px-4 py-2">{deduction.amount}</td>
                                        <td className="px-4 py-2">
                                            <button
                                                onClick={() => openModal('edit', deduction)}
                                                className="text-blue-500 hover:underline mr-4"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => deleteDeduction(deduction.id)}
                                                className="text-red-500 hover:underline"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center py-4 text-gray-500">
                                        No deductions found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <DeductionModal
                        type={modalType}
                        deduction={selectedDeduction}
                        onClose={closeModal}
                    />
                )}
            </div>
        </>
    );
}

function DeductionModal({ type, deduction, onClose }) {
    const [form, setForm] = useState({
        title: deduction?.title || '',
        amount: deduction?.amount || '',
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (type === 'create') {
            Inertia.post('/deductions', form);
        } else if (type === 'edit') {
            Inertia.put(`/deductions/${deduction.id}`, form);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white w-full max-w-md p-6 rounded shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">
                        {type === 'create' ? 'Create Deduction' : 'Edit Deduction'}
                    </h2>
                    <button onClick={onClose} className="text-gray-600">
                        X
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <label className="block mb-2 text-sm font-medium">Title</label>
                    <input
                        type="text"
                        name="title"
                        className="w-full border px-4 py-2 rounded focus:outline-none"
                        value={form.title}
                        onChange={handleChange}
                        required
                    />
                    <label className="block mb-2 text-sm font-medium mt-4">Amount</label>
                    <input
                        type="number"
                        name="amount"
                        className="w-full border px-4 py-2 rounded focus:outline-none"
                        value={form.amount}
                        onChange={handleChange}
                        required
                    />
                    <button
                        type="submit"
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        {type === 'create' ? 'Submit' : 'Update'}
                    </button>
                </form>
            </div>
        </div>
    );
}
