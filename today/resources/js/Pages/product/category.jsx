import React from 'react';
import { useForm } from '@inertiajs/react';
import Header from '@/Layouts/Header';
import Nav from '@/Layouts/Nav';

 const Category=({ isOpen, onClose, category })=> {
  const isEditing = Boolean(category);
  const { data, setData, post, put, processing, errors } = useForm({
    name: category?.name || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      put(route('service-categories.update', category.id), {
        onSuccess: () => onClose(),
      });
    } else {
      post(route('service-categories.store'), {
        onSuccess: () => onClose(),
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className='w-[83.2%] ml-[11.5rem]'>
            <Header user={user} notif={notif} />
            <Nav user_type={user_type} />
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-1/3 p-6 bg-white rounded-md shadow-md">
        <h2 className="mb-4 text-lg font-semibold">{isEditing ? 'Edit' : 'Add'} Service Category</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            />
            {errors.name && <div className="mt-1 text-sm text-red-500">{errors.name}</div>}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 mr-2 text-white bg-gray-500 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={processing}
              className="px-4 py-2 text-white bg-blue-500 rounded-md"
            >
              {isEditing ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
}
export default  Category
