import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import Header from '@/Layouts/Header';
import Nav from '@/Layouts/Nav';

export default function LeadStages({ leadStage = [] }) {
    const [isModalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState('create'); // 'create' or 'edit'
    const [selectedStage, setSelectedStage] = useState(null);

    const openModal = (type, stage = null) => {
        setModalType(type);
        setSelectedStage(stage);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedStage(null);
    };

    const deleteStage = (id) => {
        if (confirm('Are you sure you want to delete this stage?')) {
            Inertia.delete(`/lead-stages/${id}`);
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
                    <h1 className="text-2xl font-semibold mb-4">Total Stages</h1>
                    <button
                        onClick={() => openModal('create')}
                        className="text-green-600 font-medium hover:underline mb-4 block"
                    >
                        Create Stage
                    </button>

                    <table className="w-full bg-white rounded shadow">
                        <thead>
                            <tr className="bg-gray-200 text-left">
                                <th className="px-4 py-2">Stage Name</th>
                                <th className="px-4 py-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leadStage.map((stage) => (
                                <tr key={stage.id} className="border-b">
                                    <td className="px-4 py-2">{stage.name}</td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => openModal('edit', stage)}
                                            className="text-blue-500 hover:underline mr-4"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteStage(stage.id)}
                                            className="text-red-500 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <StageModal
                        type={modalType}
                        stage={selectedStage}
                        onClose={closeModal}
                    />
                )}
            </div>
        </>
    );
}

function StageModal({ type, stage, onClose }) {
    const [form, setForm] = useState({ name: stage?.name || '' });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (type === 'create') {
            Inertia.post('/lead-stages', form);
        } else if (type === 'edit') {
            Inertia.put(`/lead-stages/${stage.id}`, form);
        }
        onClose();
    };

    return (
        <Modal title={type === 'create' ? 'Create Stage' : 'Edit Stage'} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <label className="block mb-2 text-sm font-medium">Stage Name</label>
                <input
                    type="text"
                    name="name"
                    className="w-full border px-4 py-2 rounded focus:outline-none"
                    value={form.name}
                    onChange={handleChange}
                />
                <button
                    type="submit"
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                >
                    {type === 'create' ? 'Submit' : 'Update'}
                </button>
            </form>
        </Modal>
    );
}

function Modal({ title, children, onClose }) {
    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white w-full max-w-md p-6 rounded shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <button onClick={onClose} className="text-gray-600">X</button>
                </div>
                {children}
            </div>
        </div>
    );
}
