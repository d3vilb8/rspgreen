import React, { useEffect, useState } from 'react';
// import Sidebar from './sidebar';
import Header from '@/Layouts/Header';
import Nav from '@/Layouts/Nav';
import Modal from '@/Components/Modal';
import { useForm } from '@inertiajs/react'; // Import useForm from Inertia.js
import { Notyf } from 'notyf'; // Import Notyf for notifications
import 'notyf/notyf.min.css'; // Import Notyf styles
import axios from 'axios'; // Ensure axios is imported for API requests

const Product = ({ user, notif, user_type, products,category,tax }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [taxOptions, setTaxOptions] = useState([]); // State to store tax options
    const [unitOptions, setUnitOptions] = useState([]); // State to store unit options

    // Initialize Notyf
    const notyf = new Notyf();

    // Use useForm for form handling
    const { data, setData, post, put, reset, errors } = useForm({
        name: '',
        category_id: '',
        purchase_price: '',
        unit_id: '',
        description: '',
        image: null,
        sku: ''
    });

    useEffect(() => {
        fetchTaxOptions();
        fetchUnitOptions();
    }, []);

    const fetchTaxOptions = async () => {
        try {
            const response = await axios.get('/api/taxes'); // Adjust the API endpoint
            setTaxOptions(response.data);
        } catch (error) {
            console.error('Error fetching tax options:', error);
        }
    };

    const fetchUnitOptions = async () => {
        try {
            const response = await axios.get('/api/units'); // Adjust the API endpoint
            setUnitOptions(response.data);
        } catch (error) {
            console.error('Error fetching unit options:', error);
        }
    };

    const openModal = (product = null) => {
        setIsModalOpen(true);
        setData({
            name: product ? product.name : '',
            category_id: product ? product.category_id : '',
            purchase_price: product ? product.purchase_price : '',
            unit_id: product ? product.unit_id : '',
            description: product ? product.description : '',
            image: null,
            sku: product ? product.sku : ''
        });
        setSelectedProductId(product ? product.id : null);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProductId(null);
        reset();
    };

    const handleCreateOrUpdateProduct = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('category_id', data.category_id);
        formData.append('purchase_price', data.purchase_price);
        formData.append('unit_id', data.unit_id);
        formData.append('description', data.description);
        formData.append('sku', data.sku);

        if (data.image) {
            formData.append('image', data.image);
        }

        if (selectedProductId) {
            // Update product
            post(`/product-services/${selectedProductId}`, {
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' },
                onSuccess: () => {
                    notyf.success('Product updated successfully!');
                    window.location.reload();
                    closeModal();
                },
                onError: () => {
                    notyf.error('An error occurred while updating the product.');
                },
            });
        } else {
            // Create new product
            post('/product-services', {
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' },
                onSuccess: () => {
                    notyf.success('Product created successfully!');
                    window.location.reload();
                    closeModal();
                },
                onError: () => {
                    notyf.error('An error occurred while creating the product.');
                },
            });
        }
    };

    const handleDeleteProduct = async (id) => {
        if (confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.delete(`/product-services/${id}`);
                notyf.success('Product deleted successfully!');
                window.location.reload();
            } catch (error) {
                console.error('Error deleting product:', error);
                notyf.error('Product deleted successfully!');
                window.location.reload();
            }
        }
    };

    return (
        <div className='w-[83.2%] ml-[11.5rem] absolute right-0'>
            <Header user={user} notif={notif} />
            <Nav user_type={user_type} />
            <div className="flex px-9">
                {/* <Sidebar /> */}
                <div className="flex-1 p-6 ">
                    <div className='flex justify-between'>
                        <h1 className="mb-4 text-2xl font-bold">Manage Services</h1>
                        <button onClick={() => openModal()} className="p-2 text-teal-900 underline rounded-md">
                            Create Services
                        </button>
                    </div>

                    <div className='mt-3'>
                        <table className='min-w-full border border-gray-300'>
                            <thead className='bg-gray-200'>
                                <tr>
                                    <th className='px-4 py-2 text-left border-b'>Services Name</th>
                                    <th className='px-4 py-2 text-left border-b'>Services Category</th>
                                    <th className='px-4 py-2 text-right border-b'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product => (
                                    <tr key={product.id} className='transition duration-200 hover:bg-gray-100'>
                                        <td className='px-4 py-2 border-b'>{product.name}</td>
                                        <td className='px-4 py-2 border-b'>{product.cname}</td>
                                        <td className='px-4 py-2 text-right border-b'>
                                            <button onClick={() => openModal(product)} className="text-blue-600 underline hover:text-blue-800">Edit</button>
                                            <button onClick={() => handleDeleteProduct(product.id)} className="ml-4 text-red-600 underline hover:text-red-800">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Modal show={isModalOpen} onClose={closeModal}>
                <div className="p-6">
                    <h2 className="text-lg font-bold">{selectedProductId ? 'Edit Services' : 'Create New Services'}</h2>
                    {errors.name && <p className="text-red-600">{errors.name}</p>}
                    <form onSubmit={handleCreateOrUpdateProduct} className="mt-4">
                        <label className="block mb-2">
                            Name:
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="block w-full p-2 mt-1 border border-gray-300 rounded-md"
                                required
                            />
                        </label>

                        <label className="block mb-2">
                            Category :
                            <select
                                value={data.category_id}
                                onChange={(e) => setData('category_id', e.target.value)}
                                className="block w-full p-2 mt-1 border border-gray-300 rounded-md"
                                required
                            >
                                <option value="">Select Category</option>
                                {category.map((tax) => (
                                    <option key={tax.id} value={tax.id}>
                                        {tax.name}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="block mb-2">
                            Image:
                            <input
                                type="file"
                                onChange={(e) => setData('image', e.target.files[0])}
                                className="block w-full p-2 mt-1 border border-gray-300 rounded-md"
                            />
                        </label>

                         {/* <label className="block mb-2">
                            Description:
                            <input
                                type="text"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="block w-full p-2 mt-1 border border-gray-300 rounded-md"
                            />
                        </label> */}
                       <div className='flex space-x-2'>
                         <button
                            type="submit"
                            className="p-2 mt-4 text-white bg-blue-600 rounded-md"
                        >
                            {selectedProductId ? 'Update ' : 'Save'}
                        </button>
                        <button
                            onClick={closeModal}
                            type="button"
                            className="p-2 mt-4 text-white bg-red-600 rounded-md"
                        >
                            Close
                        </button>
                       </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default Product;
