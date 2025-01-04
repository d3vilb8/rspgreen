import React from "react";

const SalaryModal = ({ isOpen, onClose, onSave, payslipOptions }) => {
    if (!isOpen) return null; // Don't render if the modal is closed

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        onSave(data); // Pass data back to the parent
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg w-[400px] p-6">
                <div className="flex justify-between items-center border-b pb-2 mb-4">
                    <h2 className="text-lg font-semibold">Set Basic Salary</h2>
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
                            htmlFor="payslipType"
                            className="block text-sm font-medium mb-1"
                        >
                            Payslip Type <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="payslipType"
                            id="payslipType"
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        >
                            {payslipOptions.map((option, index) => (
                                <option key={index} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="salary"
                            className="block text-sm font-medium mb-1"
                        >
                            Salary
                        </label>
                        <input
                            type="number"
                            name="salary"
                            id="salary"
                            className="w-full p-2 border border-gray-300 rounded"
                            defaultValue="350"
                            required
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

export default SalaryModal;
