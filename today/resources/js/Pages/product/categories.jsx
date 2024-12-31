import React, { useState } from 'react';
// import { Inertia } from '@inertiajs/inertia';
import { usePage, useForm } from '@inertiajs/react';
import Header from '@/Layouts/Header';
import Nav from '@/Layouts/Nav';

const ServiceCategories = () => {
  const { categories } = usePage().props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Using Inertia's useForm hook
  const { data, setData, post, put, reset, errors } = useForm({
    name: ''
  });

  const openModal = (category = null) => {
    if (category) {
      setIsEditMode(true);
      setSelectedCategory(category);
      setData({ name: category.name });
    } else {
      setIsEditMode(false);
      setData({ name: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    reset();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode && selectedCategory) {
      put(`/service-categories/${selectedCategory.id}`, {
        onSuccess: () => closeModal()
      });
    } else {
      post('/service-categories', {
        onSuccess: () => closeModal()
      });
    }
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this category?")) {
      Inertia.delete(`/service-categories/${id}`);
    }
  };

  return (
          <div className='w-[83.2%] absolute right-0 overflow-hidden'>
         <Header/>
            <Nav/>
    <div className="container p-4 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">Service Categories</h1>

      <button
        onClick={() => openModal()}
        className="px-4 py-2 mb-4 text-white bg-blue-500 rounded-md"
      >
        Add New Category
      </button>

      <table className="w-full text-left border">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id} className="border-b">
              <td className="px-4 py-2">{category.id}</td>
              <td className="px-4 py-2">{category.name}</td>
              <td className="flex px-4 py-2 space-x-2">
                <button
                  onClick={() => openModal(category)}
                  className="px-2 py-1 text-blue-500 border border-blue-500 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="px-2 py-1 text-red-500 border border-red-500 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="p-6 bg-white rounded-lg shadow-lg w-96">
            <h2 className="mb-4 text-lg font-bold">
              {isEditMode ? 'Edit Category' : 'Add New Category'}
            </h2>
            <form onSubmit={handleSubmit}>
              <label className="block mb-2 text-sm">Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 mb-2 border rounded-md"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                required
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              <div className="flex justify-end mt-4 space-x-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-500 rounded-md"
                >
                  {isEditMode ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default ServiceCategories;
