import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import Header from '@/Layouts/Header';
import Nav from '@/Layouts/Nav';

export default function HolidayLocations({ holidays = [] }) {
    const [isModalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState('create'); // 'create' or 'edit'
    const [selectedHoliday, setSelectedHoliday] = useState(null);

    console.log("jhgf", holidays);

    // Open modal for create or edit
    const openModal = (type, holiday = null) => {
        setModalType(type);
        setSelectedHoliday(holiday);
        setModalOpen(true);
    };

    // Close modal and reset selected holiday
    const closeModal = () => {
        setModalOpen(false);
        setSelectedHoliday(null);
    };

    // Delete holiday
    const deleteHoliday = (id) => {
        if (confirm('Are you sure you want to delete this holiday location?')) {
            Inertia.delete(`/holiday-locationswise/${id}`);
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
                    <h1 className="text-2xl font-semibold mb-4">Holiday Locations</h1>
                    <button
                        onClick={() => openModal('create')}
                        className="text-green-600 font-medium hover:underline mb-4 block"
                    >
                        Create Holiday Location
                    </button>

                    <table className="w-full bg-white rounded shadow">
                        <thead>
                            <tr className="bg-gray-200 text-left">
                                <th className="px-4 py-2">Holiday Location</th>
                                <th className="px-4 py-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
  {holidays.map((holiday, index) => (
    <tr key={index} className="border-b">
      <td className="px-4 py-2">{holiday.name || holiday}</td>
      <td className="px-4 py-2">
        <button
          onClick={() => openModal('edit', { id: index, name: holiday })}
          className="text-blue-500 hover:underline mr-4"
        >
          Edit
        </button>
        <button
          onClick={() => deleteHoliday(index)}
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

                {/* Modal for Create/Edit Holiday */}
                {isModalOpen && (
                    <HolidayModal
                        type={modalType}
                        holiday={selectedHoliday}
                        onClose={closeModal}
                    />
                )}
            </div>
        </>
    );
}

function HolidayModal({ type, holiday, onClose }) {
    const [form, setForm] = useState({ name: holiday?.name || '' });

    // Handle form input changes
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Handle form submit
    const handleSubmit = (e) => {
        e.preventDefault();
        if (type === 'create') {
            Inertia.post('/holiday-locationswise', form);
        } else if (type === 'edit') {
            Inertia.put(`/holiday-locationswise/${holiday.id}`, form);
        }
        onClose();
    };

    return (
        <Modal title={type === 'create' ? 'Create Holiday Location' : 'Edit Holiday Location'} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <label className="block mb-2 text-sm font-medium">Holiday Location Name</label>
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
