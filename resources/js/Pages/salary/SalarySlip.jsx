import React, { useState, useEffect } from "react";

const SalarySlip = ({ combinedData, deductions, data }) => {
    const [selectedDeductions, setSelectedDeductions] = useState([]);
    console.log("Employee Data", combinedData);
    console.log("Additional Data", data);

    // Format amount to INR currency
    const formatToCurrency = (amount) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(amount || 0);

    // Handle checkbox changes for deductions
    const handleDeductionChange = (event) => {
        const { value, checked } = event.target;
        const deduction = deductions.find((ded) => ded.id === parseInt(value));
        setSelectedDeductions((prevSelected) =>
            checked
                ? [...prevSelected, deduction]
                : prevSelected.filter((ded) => ded.id !== parseInt(value))
        );
    };

    // Trigger print functionality
    const handlePrint = () => {
        window.print();
    };

    useEffect(() => {
        console.log("Selected Deductions:", selectedDeductions);
    }, [selectedDeductions]);

    return (
        <div className="max-w-4xl mx-auto p-6 rounded-lg shadow-md bg-white">
            {/* Print Button */}
            {/* <button
                onClick={handlePrint}
                className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
            >
                Print Salary Slip
            </button> */}

            {Array.isArray(combinedData) && combinedData.length > 0 ? (
                combinedData.map((employee) => {
                    const {
                        employee_id,
                        employeeName,
                        generate_date,
                        allowance = 0,
                        perDaySalary = 0,
                        total_amount = 0,
                        approved_by,
                        approved_date,
                    } = employee;

                    // Find matching additional data from the array
                    const matchedData = data.find((item) => item.id === employee_id);

                    // Calculate total salary (basic + allowance)
                    let totalSalary = total_amount + allowance;

                    // Calculate total deductions
                    const totalDeduction = selectedDeductions.reduce(
                        (acc, item) => acc + (parseFloat(item.amount) || 0),
                        0
                    );

                    // If matched data exists, add the salary deduction amount to total deductions
                    let updatedTotalDeduction = totalDeduction;
                    if (matchedData && matchedData.salary_deduction_amount) {
                        updatedTotalDeduction += parseFloat(matchedData.salary_deduction_amount);
                    }

                    // Calculate net salary
                    let netSalary = totalSalary - updatedTotalDeduction;

                    return (
                        <div
                            key={employee_id}
                            className="border border-gray-300 rounded-lg mb-6 bg-gray-50 salary-slip"
                        >
                            {/* Header */}
                            <header className="flex justify-between items-start p-4 border-b">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-700">Rsp Green</h1>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-700">
                                        Employee Id: {employee_id || "N/A"}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Salary Date: {generate_date || "N/A"}
                                    </p>
                                </div>
                            </header>

                            {/* Salary Details */}
                            <div className="p-4">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="text-left border-b">
                                            <th className="py-2">Earning</th>
                                            <th className="py-2">Title</th>
                                            <th className="py-2">Type</th>
                                            <th className="py-2">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="py-2">Basic Salary</td>
                                            <td>-</td>
                                            <td>-</td>
                                            <td>{formatToCurrency(total_amount)}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-2">Allowance</td>
                                            <td>Education or Training</td>
                                            <td>Fixed</td>
                                            <td>{formatToCurrency(allowance)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Deduction Selection */}
                            <div className="p-4 deduction-selection">
                                <h2 className="text-lg font-semibold mb-2">Select Deductions:</h2>
                                {deductions.map((deduction) => (
                                    <div key={deduction.id} className="mb-2">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                value={deduction.id}
                                                onChange={handleDeductionChange}
                                                className="mr-2"
                                            />
                                            {deduction.title} - {formatToCurrency(deduction.amount)}
                                        </label>
                                    </div>
                                ))}
                            </div>

                            {/* Deduction Details */}
                            {selectedDeductions.length > 0 && (
                                <div className="p-4">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="text-left border-b">
                                                <th className="py-2">Title</th>
                                                <th className="py-2">Type</th>
                                                <th className="py-2">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedDeductions.map((deduction) => (
                                                <tr key={deduction.id}>
                                                    <td>{deduction.title || "N/A"}</td>
                                                    <td>{deduction.fixed ? "Fixed" : "Variable"}</td>
                                                    <td>{formatToCurrency(deduction.amount)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Additional Deduction from data if id matches */}
                            {matchedData && (
                                <div className="p-4">
                                    <h3 className="font-semibold text-lg">Additional Deduction Information</h3>
                                    <table className="w-full border-collapse">
                                        <tbody>
                                            <tr>
                                                <td className="py-2">Salary Deduction Amount</td>
                                                <td>{formatToCurrency(matchedData.salary_deduction_amount)}</td>
                                            </tr>
                                            <tr>
                                                <td className="py-2">Salary Deduction Days</td>
                                                <td>{matchedData.salary_deduction_days}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Summary */}
                            <div className="p-4 border-t">
                                <div className="flex justify-between">
                                    <p className="font-semibold">Total Earning:</p>
                                    <p>{formatToCurrency(totalSalary)}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Total Deduction:</p>
                                    <p>{formatToCurrency(updatedTotalDeduction)}</p>
                                </div>
                                <div className="flex justify-between font-bold text-lg">
                                    <p>Net Salary:</p>
                                    <p>{formatToCurrency(netSalary)}</p>
                                </div>
                            </div>

                            {/* Footer */}
                            <footer className="p-4 text-center">
                                <p className="text-sm text-gray-600">
                                    Approved By: {approved_by || "N/A"}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Approved Date: {approved_date || "N/A"}
                                </p>
                                <p className="text-sm text-gray-600">Employee Signature: __________</p>
                            </footer>
                        </div>
                    );
                })
            ) : (
                <p>No employee data available.</p>
            )}
        </div>
    );
};

export default SalarySlip;
