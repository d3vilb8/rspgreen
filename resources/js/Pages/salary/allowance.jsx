import React, { useState } from "react";

const AllowanceModal = ({ isOpen, onClose, onSave, allowanceOptions }) => {
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
                    <h2 className="text-lg font-semibold">Add Allowance</h2>
                    <button
                        className="text-gray-500 hover:text-black"
                        onClick={onClose}
                    >
                        &times;
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            htmlFor="employeeName"
                            className="block text-sm font-medium mb-1"
                        >
                            Employee Name{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="employeeName"
                            id="employeeName"
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="allowanceOption"
                            className="block text-sm font-medium mb-1"
                        >
                            Allowance Option{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="allowanceOption"
                            id="allowanceOption"
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        >
                            {allowanceOptions.map((option, index) => (
                                <option key={index} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="title"
                            className="block text-sm font-medium mb-1"
                        >
                            Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="type"
                            className="block text-sm font-medium mb-1"
                        >
                            Type
                        </label>
                        <select
                            name="type"
                            id="type"
                            className="w-full p-2 border border-gray-300 rounded"
                        >
                            <option value="Fixed">Fixed</option>
                            <option value="Variable">Variable</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="amount"
                            className="block text-sm font-medium mb-1"
                        >
                            Amount
                        </label>
                        <input
                            type="number"
                            name="amount"
                            id="amount"
                            className="w-full p-2 border border-gray-300 rounded"
                        />
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
                            Save Change
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const AllowanceComponent = () => {
    const [allowances, setAllowances] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSave = (data) => {
        setAllowances([...allowances, data]);
        setIsModalOpen(false);
    };

    const allowanceOptions = ["Housing", "Transport", "Medical", "Other"];

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Allowance</h2>
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
                                EMPLOYEE NAME
                            </th>
                            <th className="p-2 border border-gray-300">
                                ALLOWANCE OPTION
                            </th>
                            <th className="p-2 border border-gray-300">
                                TITLE
                            </th>
                            <th className="p-2 border border-gray-300">TYPE</th>
                            <th className="p-2 border border-gray-300">
                                AMOUNT
                            </th>
                            <th className="p-2 border border-gray-300">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {allowances.map((allowance, index) => (
                            <tr key={index}>
                                <td className="p-2 border border-gray-300">
                                    {allowance.employeeName}
                                </td>
                                <td className="p-2 border border-gray-300">
                                    {allowance.allowanceOption}
                                </td>
                                <td className="p-2 border border-gray-300">
                                    {allowance.title}
                                </td>
                                <td className="p-2 border border-gray-300">
                                    {allowance.type}
                                </td>
                                <td className="p-2 border border-gray-300">
                                    {allowance.amount}
                                </td>
                                <td className="p-2 border border-gray-300">
                                    <button
                                        className="px-2 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                                        onClick={() => handleEdit(index)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="px-2 py-1 ml-2 text-white bg-red-500 rounded hover:bg-red-600"
                                        onClick={() => handleDelete(index)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <AllowanceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                allowanceOptions={allowanceOptions}
            />
        </div>
    );
};

export default AllowanceComponent;
