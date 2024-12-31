import Modal from '@/Components/Modal'; // Assuming you have a Modal component
import Header from '@/Layouts/Header';
import Nav from '@/Layouts/Nav';
import { useForm } from '@inertiajs/react'; // For form submission with Inertia.js
import React, { useState } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa'; // Icons for actions
import { FaPencil, FaXmark } from 'react-icons/fa6'; // Icons for closing modals

const Supplier = ({ suppliers,user,notif,user_type }) => {
    const [modal, setModal] = useState(false); // For create modal
    const [editModal, setEditModal] = useState(false); // For edit modal
    const [deleteModal, setDeleteModal] = useState(false); // For delete confirmation modal
    const [selectedEmployee, setSelectedEmployee] = useState(null); // For holding selected employee data for edit
    const { data, setData, post, put, del, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        address: '',
    });

    // Handling create action
    const handleCreate = () => {
        post('/suppliers', {
            onSuccess: () => setModal(false),
        });
    };

    // Handling edit action
    const handleEdit = (employee) => {
        setSelectedEmployee(employee);
        setData({
            name: employee.name,
            email: employee.email,
            phone: employee.phone,
            address: employee.address,
        });
        setEditModal(true);
    };

    const handleUpdate = () => {
        put(`/suppliers/update/${selectedEmployee.id}`, {
            onSuccess: () => setEditModal(false),
        });
    };

    // Handling delete action
    const handleDelete = (id) => {
        del(`/suppliers/${id}`, {
            onSuccess: () => setDeleteModal(false),
        });
    };

    return (
        <div>
                    <Header user={user} notif={notif} />
  <Nav user_type={user_type} />

        <div className='w-[83.2%] ml-[11.5rem] absolute right-0 overflow-hidden px-3'>

         <div className='flex justify-between'>
               <h1 className='text-xl'>Manage suppliers</h1>

            {/* Create Button */}
            <button onClick={() => setModal(true)} className='px-4 py-2 text-sm text-white bg-blue-500 rounded'>
               Create Client
            </button>
         </div>
         <br/>

            {/* Create Modal */}
            <Modal show={modal} maxWidth='lg'>
                <div className='p-4'>
                    <div className='flex items-center justify-between'>
                        <h1 className='text-lg'>Create Client</h1>
                        <button onClick={() => setModal(false)}><FaXmark /></button>
                    </div>
                    <hr />
                    <form className='space-y-3' onSubmit={handleCreate}>
                        <input
                            type="text"
                            placeholder="Client Name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className='text-sm rounded form-input'
                        />
                        <input
                            type="email"
                            placeholder="Client Email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className='text-sm rounded form-input'
                        />
                        <input
                            type="text"
                            placeholder="Phone Number"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            className='text-sm rounded form-input'
                        />
                        <input
                            type="text"
                            placeholder="Address"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            className='text-sm rounded form-input'
                        />
                        <button className='px-5 py-2 text-white bg-blue-500 rounded'>Submit</button>
                    </form>
                </div>
            </Modal>

            {/* Table to List suppliers */}
            <table className='w-full '>
                <thead>
                    <tr>
                        <th className='py-2 pl-4 text-left text-white bg-slate-600'>#</th>
                        <th className='py-2 pl-2 text-left text-white bg-slate-600'>Client Name</th>
                        <th className='py-2 pl-2 text-left text-white bg-slate-600'>Email</th>
                        <th className='py-2 pl-2 text-left text-white bg-slate-600'>Phone</th>
                        <th className='py-2 pl-2 text-left text-white bg-slate-600'>Address</th>
                        <th className='py-2 pl-2 text-left text-white bg-slate-600'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {suppliers?.map((employee, index) => (
                        <tr key={index}>
                            <td className='py-2 pl-4 text-sm'>{index + 1}</td>
                            <td className='py-2 pl-2 text-sm'>{employee.name}</td>
                            <td className='py-2 pl-2 text-sm'>{employee.email}</td>
                            <td className='py-2 pl-2 text-sm'>{employee.phone}</td>
                            <td className='py-2 pl-2 text-sm'>{employee.address}</td>
                            <td className='py-2 pl-2 text-sm'>
                                <div className='flex space-x-2'>
                                    <button onClick={() => handleEdit(employee)} className='px-2 py-2 text-white bg-blue-500 rounded'>
                                        <FaPencil />
                                    </button>
                                    <button onClick={() => setDeleteModal(true)} className='px-2 py-2 text-white bg-red-500 rounded'>
                                        <FaTrash />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Edit Modal */}
            <Modal show={editModal} maxWidth='lg'>
                <div className='p-4'>
                    <div className='flex items-center justify-between'>
                        <h1 className='text-lg'>Edit Client</h1>
                        <button onClick={() => setEditModal(false)}><FaXmark /></button>
                    </div>
                    <hr />
                    <form className='space-y-3' onSubmit={handleUpdate}>
                        <input
                            type="text"
                            placeholder="Client Name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className='text-sm rounded form-input'
                        />
                        <input
                            type="email"
                            placeholder="Client Email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className='text-sm rounded form-input'
                        />
                        <input
                            type="text"
                            placeholder="Phone Number"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            className='text-sm rounded form-input'
                        />
                        <input
                            type="text"
                            placeholder="Address"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            className='text-sm rounded form-input'
                        />
                        <button className='px-5 py-2 text-white bg-blue-500 rounded'>Update</button>
                    </form>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={deleteModal} maxWidth='lg'>
                <div className='p-4'>
                    <h1 className='text-lg'>Are you sure you want to delete this client?</h1>
                    <div className='flex justify-between mt-4'>
                        <button className='px-4 py-2 text-white bg-red-500 rounded' onClick={() => handleDelete(selectedEmployee.id)}>Delete</button>
                        <button className='px-4 py-2 bg-gray-300 rounded' onClick={() => setDeleteModal(false)}>Cancel</button>
                    </div>
                </div>
            </Modal>
        </div>
        </div>
    );
};

export default Supplier;
