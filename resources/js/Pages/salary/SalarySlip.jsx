import React, { useState, useEffect } from "react";

const SalarySlip = ({ combinedData, deductions, data }) => {
    const [selectedDeductions, setSelectedDeductions] = useState([]);
    console.log("data", data[0]?.employee_name);
    console.log("data", data[0]?.employee_id);
    console.log("ggggg", data);
    const formatToCurrency = (amount) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(amount || 0);

    const handleDeductionChange = (event) => {
        const { value, checked } = event.target;
        const deduction = deductions.find((ded) => ded.id === parseInt(value));
        setSelectedDeductions((prevSelected) =>
            checked
                ? [...prevSelected, deduction]
                : prevSelected.filter((ded) => ded.id !== parseInt(value))
        );
    };

    useEffect(() => {
        console.log("Selected Deductions:", selectedDeductions);
    }, [selectedDeductions]);

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg rounded-lg">
            {Array.isArray(combinedData) && combinedData.length > 0 ? (
                combinedData.map((employee) => {
                    const {
                        employee_id,
                        employeeName,
                        generate_date,
                        allowance = 0,
                        total_amount = 0,
                        approved_by,
                        approved_date,
                    } = employee;

                    const matchedData = data.find(
                        (item) => item.id === employee_id
                    );

                    let totalSalary = total_amount + allowance;

                    const totalDeduction = selectedDeductions.reduce(
                        (acc, item) => acc + (parseFloat(item.amount) || 0),
                        0
                    );

                    let updatedTotalDeduction = totalDeduction;
                    if (matchedData && matchedData.salary_deduction_amount) {
                        updatedTotalDeduction += parseFloat(
                            matchedData.salary_deduction_amount
                        );
                    }

                    let netSalary = totalSalary - updatedTotalDeduction;

                    return (
                        <div
                            key={employee_id}
                            className="mb-8 bg-white shadow rounded-lg overflow-hidden"
                        >
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                                    <tr>
                                        <th className="px-6 py-3 border border-gray-300">
                                            Field
                                        </th>
                                        <th className="px-6 py-3 border border-gray-300">
                                            Details
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-800">
                                    <tr>
                                        <td className="px-6 py-3 border border-gray-300">
                                            Employee ID
                                        </td>
                                        <td className="px-6 py-3 border border-gray-300">
                                            {data.find(
                                                (d) => d.id === employee_id
                                            )?.employee_id || "N/A"}
                                        </td>
                                    </tr>
                                    <tr className="bg-gray-100">
                                        <td className="px-6 py-3 border border-gray-300">
                                            Employee Name
                                        </td>
                                        <td className="px-6 py-3 border border-gray-300">
                                            {data.find(
                                                (d) => d.id === employee_id
                                            )?.employee_name || "N/A"}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-3 border border-gray-300">
                                            Salary Date
                                        </td>
                                        <td className="px-6 py-3 border border-gray-300">
                                            {generate_date || "N/A"}
                                        </td>
                                    </tr>
                                    <tr className="bg-gray-100">
                                        <td className="px-6 py-3 border border-gray-300">
                                            Basic Salary
                                        </td>
                                        <td className="px-6 py-3 border border-gray-300">
                                            {formatToCurrency(total_amount)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-3 border border-gray-300">
                                            Allowance
                                        </td>
                                        <td className="px-6 py-3 border border-gray-300">
                                            {formatToCurrency(allowance)}
                                        </td>
                                    </tr>
                                    <tr className="bg-gray-100">
                                        <td className="px-6 py-3 border border-gray-300">
                                            Total Earnings
                                        </td>
                                        <td className="px-6 py-3 border border-gray-300">
                                            {formatToCurrency(totalSalary)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-3 border border-gray-300">
                                            Total Deductions
                                        </td>
                                        <td className="px-6 py-3 border border-gray-300">
                                            {formatToCurrency(
                                                updatedTotalDeduction
                                            )}
                                        </td>
                                    </tr>
                                    <tr className="bg-gray-100">
                                        <td className="px-6 py-3 border border-gray-300">
                                            Net Salary
                                        </td>
                                        <td className="px-6 py-3 border border-gray-300">
                                            {formatToCurrency(netSalary)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-3 border border-gray-300">
                                            Approved By
                                        </td>
                                        <td className="px-6 py-3 border border-gray-300">
                                            {approved_by || "N/A"}
                                        </td>
                                    </tr>
                                    <tr className="bg-gray-100">
                                        <td className="px-6 py-3 border border-gray-300">
                                            Approved Date
                                        </td>
                                        <td className="px-6 py-3 border border-gray-300">
                                            {approved_date || "N/A"}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    );
                })
            ) : (
                <p className="text-center text-gray-700 text-lg">
                    No employee data available.
                </p>
            )}

            <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Select Deductions:
                </h2>
                <div className="grid grid-cols-2 gap-4">
                    {deductions.map((deduction) => (
                        <label
                            key={deduction.id}
                            className="flex items-center space-x-2 bg-gray-200 p-4 rounded-lg shadow"
                        >
                            <input
                                type="checkbox"
                                value={deduction.id}
                                onChange={handleDeductionChange}
                                className="h-5 w-5 text-purple-600"
                            />
                            <span className="text-gray-700">
                                {deduction.title} -{" "}
                                {formatToCurrency(deduction.amount)}
                            </span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SalarySlip;
