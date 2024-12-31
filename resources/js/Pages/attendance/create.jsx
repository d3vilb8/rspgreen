import React from 'react';
import { useForm } from '@inertiajs/react';
import Header from '@/Layouts/Header';
import Nav from '@/Layouts/Nav';

const Create = ({ employees, user, notif, user_type }) => {
    const { data, setData, post, processing, errors } = useForm({
        employee_id: '',
        date: '',
        in_time: '',
        out_time: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/attendances');
    };

    return (
        <div className='w-[85.2%] ml-[11.5rem]'>
            <Header user={user} notif={notif} />
            <Nav user_type={user_type} />
            <div className="container p-6 mx-auto">
                <h1 className="mb-6 text-3xl font-bold">Record Attendance</h1>

                <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md">
                    {/* Employee Select */}
                    <div className="mb-4">
                        <label className="block text-gray-700">Employee</label>
                        <select
                            value={data.employee_id}
                            onChange={(e) => setData('employee_id', e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Select Employee</option>
                            {employees.map(employee => (
                                <option key={employee.id} value={employee.id}>{employee.name}</option>
                            ))}
                        </select>
                        {errors.employee_id && <span className="text-red-600">{errors.employee_id}</span>}
                    </div>

                    {/* Date Input */}
                    <div className="mb-4">
                        <label className="block text-gray-700">Date</label>
                        <input
                            type="date"
                            value={data.date}
                            onChange={(e) => setData('date', e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        {errors.date && <span className="text-red-600">{errors.date}</span>}
                    </div>

                    {/* In Time Input */}
                    <div className="mb-4">
                        <label className="block text-gray-700">In Time</label>
                        <input
                            type="time"
                            value={data.in_time}
                            onChange={(e) => setData('in_time', e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.in_time && <span className="text-red-600">{errors.in_time}</span>}
                    </div>

                    {/* Out Time Input */}
                    <div className="mb-4">
                        <label className="block text-gray-700">Out Time</label>
                        <input
                            type="time"
                            value={data.out_time}
                            onChange={(e) => setData('out_time', e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.out_time && <span className="text-red-600">{errors.out_time}</span>}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                        disabled={processing}
                    >
                        {processing ? 'Processing...' : 'Record Attendance'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Create;
