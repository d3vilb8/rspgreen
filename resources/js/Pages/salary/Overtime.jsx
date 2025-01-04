import React, { useState } from "react";

const OvertimeModal = ({ isOpen, onClose, onSave }) => {
    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        onSave(data); // Pass data to the parent component
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg w-[400px] p-6">
                <div className="flex justify-between items-center border-b pb-2 mb-4">
                    <h2 className="text-lg font-semibold">Create Overtime</h2>
                    <button
                        className="text-gray-500 hover:text-black"
                        onClick={onClose}
                    >
                        &times;
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label
                                htmlFor="overtimeTitle"
                                className="block text-sm font-medium mb-1"
                            >
                                Overtime Title{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="overtimeTitle"
                                id="overtimeTitle"
                                className="w-full p-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="numberOfDays"
                                className="block text-sm font-medium mb-1"
                            >
                                Number of Days
                            </label>
                            <input
                                type="number"
                                name="numberOfDays"
                                id="numberOfDays"
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="hours"
                                className="block text-sm font-medium mb-1"
                            >
                                Hours
                            </label>
                            <input
                                type="number"
                                name="hours"
                                id="hours"
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="rate"
                                className="block text-sm font-medium mb-1"
                            >
                                Rate
                            </label>
                            <input
                                type="number"
                                name="rate"
                                id="rate"
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-teal-600"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const OvertimeComponent = () => {
    const [overtimeEntries, setOvertimeEntries] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSave = (data) => {
        setOvertimeEntries([...overtimeEntries, data]);
        setIsModalOpen(false);
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Overtime</h2>
                <button
                    className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center"
                    onClick={() => setIsModalOpen(true)}
                >
                    +
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 border border-gray-300">
                                OVERTIME TITLE
                            </th>
                            <th className="p-2 border border-gray-300">
                                NUMBER OF DAYS
                            </th>
                            <th className="p-2 border border-gray-300">
                                HOURS
                            </th>
                            <th className="p-2 border border-gray-300">RATE</th>
                        </tr>
                    </thead>
                    <tbody>
                        {overtimeEntries.map((overtime, index) => (
                            <tr key={index}>
                                <td className="p-2 border border-gray-300">
                                    {overtime.overtimeTitle}
                                </td>
                                <td className="p-2 border border-gray-300">
                                    {overtime.numberOfDays}
                                </td>
                                <td className="p-2 border border-gray-300">
                                    {overtime.hours}
                                </td>
                                <td className="p-2 border border-gray-300">
                                    {overtime.rate}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <OvertimeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
            />
        </div>
    );
};

export default OvertimeComponent;
