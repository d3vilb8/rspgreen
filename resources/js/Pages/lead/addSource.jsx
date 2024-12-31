import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import Header from '@/Layouts/Header';
import Nav from '@/Layouts/Nav';

export default function LeadSources({ leadSources = [] }) {
    const [isModalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState('create'); // 'create' or 'edit'
    const [selectedSource, setSelectedSource] = useState(null);

    const openModal = (type, source = null) => {
        setModalType(type);
        setSelectedSource(source);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedSource(null);
    };

    const deleteSource = (id) => {
        if (confirm('Are you sure you want to delete this source?')) {
            Inertia.delete(`/lead-sources/${id}`);
        }
    };

    return (
        <>
            <Header />
            <Nav />
            <div className="flex">
                {/* Sidebar */}
                <aside className="w-1/4 bg-gray-800 text-white p-4"></aside>

                {/* Main Content */}
                <div className="w-3/4 p-6 bg-gray-100">
                    <h1 className="text-2xl font-semibold mb-4">Total Projects</h1>
                    <button
                        onClick={() => openModal('create')}
                        className="text-green-600 font-medium hover:underline mb-4 block"
                    >
                        Create Projects
                    </button>

                    <table className="w-full bg-white rounded shadow">
                        <thead>
                            <tr className="bg-gray-200 text-left">
                                <th className="px-4 py-2">Projects Name</th>
                                <th className="px-4 py-2">Rate</th>
                                <th className="px-4 py-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leadSources.map((source) => (
                                <tr key={source.id} className="border-b">
                                    <td className="px-4 py-2">{source.name}</td>
                                    <td className="px-4 py-2">{source.rate}</td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => openModal('edit', source)}
                                            className="text-blue-500 hover:underline mr-4"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteSource(source.id)}
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
                    <SourceModal
                        type={modalType}
                        source={selectedSource}
                        onClose={closeModal}
                    />
                )}
            </div>
        </>
    );
}

function SourceModal({ type, source, onClose }) {
    const [form, setForm] = useState({
        name: source?.name || '',
        rate: source?.rate || '', // Add rate to the form state
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (type === 'create') {
            Inertia.post('/lead-sources', form);
        } else if (type === 'edit') {
            Inertia.put(`/lead-sources/${source.id}`, form);
        }
        onClose();
    };

    return (
        <Modal title={type === 'create' ? 'Create Project' : 'Edit Project'} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <label className="block mb-2 text-sm font-medium">Projects Name</label>
                <input
                    type="text"
                    name="name"
                    className="w-full border px-4 py-2 rounded focus:outline-none"
                    value={form.name}
                    onChange={handleChange}
                />

                <label className="block mb-2 text-sm font-medium mt-4">Rate</label>
                <input
                    type="number"
                    name="rate"
                    className="w-full border px-4 py-2 rounded focus:outline-none"
                    value={form.rate}
                    onChange={handleChange}
                    step="0.01" // Allows decimal rates
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
