import React from 'react';
import { useForm } from '@inertiajs/inertia-react';

const HolidayForm = ({ holiday, onClose }) => {
    const { data, setData, post, put, errors } = useForm({
        name: holiday?.name || '',
        startDate: holiday?.start_date || '',
        endDate: holiday?.end_date || '',
        location: holiday?.location || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (holiday) {
            put(`/holidays-location/${holiday.id}`, {
                data,
                onSuccess: () => onClose(),
            });
        } else {
            post('/holidays-location', {
                data,
                onSuccess: () => onClose(),
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md mx-4">
                <h2 className="text-xl font-bold mb-4">{holiday ? 'Edit Holiday' : 'Add Holiday'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2">Holiday Name</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        />
                        {errors.name && <p className="text-red-500">{errors.name}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Start Date</label>
                        <input
                            type="date"
                            value={data.startDate}
                            onChange={(e) => setData('startDate', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        />
                        {errors.startDate && <p className="text-red-500">{errors.startDate}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">End Date</label>
                        <input
                            type="date"
                            value={data.endDate}
                            onChange={(e) => setData('endDate', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        />
                        {errors.endDate && <p className="text-red-500">{errors.endDate}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Location</label>
                        <input
                            type="text"
                            value={data.location}
                            onChange={(e) => setData('location', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        />
                        {errors.location && <p className="text-red-500">{errors.location}</p>}
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HolidayForm;
