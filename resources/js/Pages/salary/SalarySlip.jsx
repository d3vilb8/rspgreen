import React, { useState, useRef } from "react";
import jsPDF from "jspdf";

const SalarySlip = ({ combinedData, deductions, data }) => {
    const [selectedDeductions, setSelectedDeductions] = useState([]);
    const slipRef = useRef(null);

    // Format the amount to currency format
    const formatToCurrency = (amount) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(amount || 0);

    // Handle deduction selection
    const handleDeductionChange = (event) => {
        const { value, checked } = event.target;
        const deduction = deductions.find((ded) => ded.id === parseInt(value));
        setSelectedDeductions((prevSelected) =>
            checked
                ? [...prevSelected, deduction]
                : prevSelected.filter((ded) => ded.id !== parseInt(value))
        );
    };

    // Go back to the previous page
    const goBack = () => {
        window.history.back();
    };

    // Handle PDF download
    const handleDownloadPDF = () => {
        const doc = new jsPDF("p", "pt", "a3");
        const content = slipRef.current;

        doc.html(content, {
            callback: (pdf) => {
                pdf.save("SalarySlip.pdf");
            },
            x: 20,
            y: 20,
            width: 550, // Adjust to fit content
        });
    };

    return (
        <div>
            {/* Buttons */}
            <div className="flex justify-start space-x-4 mb-4 print:hidden">
                <button
                    onClick={goBack}
                    className="bg-teal-400 hover:bg-teal-500 text-white py-2 px-4 rounded-full"
                >
                    Back
                </button>
                <button
                    onClick={handleDownloadPDF}
                    className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-full"
                >
                    Download Payslip
                </button>
            </div>

            {/* Salary Slip */}
            <div
                ref={slipRef}
                className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 shadow-lg rounded-lg"
            >
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

                        const matchedData = data.find((item) => item.id === employee_id);

                        let totalSalary = total_amount + allowance;

                        const totalDeduction = selectedDeductions.reduce(
                            (acc, item) => acc + (parseFloat(item.amount) || 0),
                            0
                        );

                        let leaveDeduction = 0;
                        let lateDeduction = 0;

                        if (matchedData) {
                            if (matchedData.leave_deduction_amount) {
                                leaveDeduction = parseFloat(matchedData.leave_deduction_amount);
                            }
                            if (matchedData.late_deduction_amount) {
                                lateDeduction = parseFloat(matchedData.late_deduction_amount);
                            }
                        }

                        const totalDeductions = totalDeduction + leaveDeduction + lateDeduction;
                        let netSalary = totalSalary - totalDeductions;

                        return (
                            <div
                                key={employee_id}
                                className="mb-8 bg-white shadow-md rounded-lg overflow-hidden"
                            >
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-gradient-to-r from-blue-400 to-blue-500 text-white">
                                        <tr>
                                            <th className="px-6 py-3 border border-gray-300">Field</th>
                                            <th className="px-6 py-3 border border-gray-300">Details</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-800">
                                        <tr className="hover:bg-blue-50">
                                            <td className="px-6 py-3 border border-gray-300 text-black font-semibold">Employee ID</td>
                                            <td className="px-6 py-3 border border-gray-300">
                                                {data.find((d) => d.id === employee_id)?.employee_id || "N/A"}
                                            </td>
                                        </tr>
                                        <tr className="bg-blue-50 hover:bg-blue-100">
                                            <td className="px-6 py-3 border border-gray-300 text-black font-semibold">Employee Name</td>
                                            <td className="px-6 py-3 border border-gray-300 text-indigo-600 font-bold">
                                                {data.find((d) => d.id === employee_id)?.employee_name || "N/A"}
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-blue-50">
                                            <td className="px-6 py-3 border border-gray-300 text-black font-semibold">Salary Date</td>
                                            <td className="px-6 py-3 border border-gray-300">{generate_date || "N/A"}</td>
                                        </tr>
                                        <tr className="bg-blue-50 hover:bg-blue-100">
                                            <td className="px-6 py-3 border border-gray-300 text-black font-semibold">Basic Salary</td>
                                            <td className="px-6 py-3 border border-gray-300 text-green-600 font-bold">
                                                {formatToCurrency(total_amount)}
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-blue-50">
                                            <td className="px-6 py-3 border border-gray-300 text-black font-semibold">Allowance</td>
                                            <td className="px-6 py-3 border border-gray-300 text-teal-600 font-semibold">
                                                {formatToCurrency(allowance)}
                                            </td>
                                        </tr>
                                        <tr className="bg-blue-50 hover:bg-blue-100">
                                            <td className="px-6 py-3 border border-gray-300 text-black font-semibold">Total Earnings</td>
                                            <td className="px-6 py-3 border border-gray-300 text-indigo-600 font-bold">
                                                {formatToCurrency(totalSalary)}
                                            </td>
                                        </tr>

                                        {/* Separate deductions */}
                                        {matchedData && matchedData.leave_deduction_amount > 0 && (
                                            <tr className="hover:bg-blue-50">
                                                <td className="px-6 py-3 border border-gray-300 text-black font-semibold">Leave Deduction</td>
                                                <td className="px-6 py-3 border border-gray-300 text-red-600 font-semibold">
                                                    {formatToCurrency(matchedData.leave_deduction_amount)}
                                                </td>
                                            </tr>
                                        )}

                                        {matchedData && matchedData.late_deduction_amount > 0 && (
                                            <tr className="hover:bg-blue-50">
                                                <td className="px-6 py-3 border border-gray-300 text-black font-semibold">Late Deduction</td>
                                                <td className="px-6 py-3 border border-gray-300 text-red-600 font-semibold">
                                                    {formatToCurrency(matchedData.late_deduction_amount)} (for {matchedData.late_deduction_days} days)
                                                </td>
                                            </tr>
                                        )}

                                        <tr className="hover:bg-blue-50">
                                            <td className="px-6 py-3 border border-gray-300 text-black font-semibold">Total Deductions</td>
                                            <td className="px-6 py-3 border border-gray-300 text-red-600 font-semibold">
                                                {formatToCurrency(totalDeductions)}
                                            </td>
                                        </tr>
                                        <tr className="bg-blue-50 hover:bg-blue-100">
                                            <td className="px-6 py-3 border border-gray-300 text-black font-semibold">Net Salary</td>
                                            <td className="px-6 py-3 border border-gray-300 text-green-700 font-bold">
                                                {formatToCurrency(netSalary)}
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-blue-50">
                                            <td className="px-6 py-3 border border-gray-300 text-black font-semibold">Approved By</td>
                                            <td className="px-6 py-3 border border-gray-300">{approved_by || "N/A"}</td>
                                        </tr>
                                        <tr className="bg-blue-50 hover:bg-blue-100">
                                            <td className="px-6 py-3 border border-gray-300 text-black font-semibold">Approved Date</td>
                                            <td className="px-6 py-3 border border-gray-300">{approved_date || "N/A"}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-center text-gray-700 text-lg">No employee data available.</p>
                )}
            </div>
        </div>
    );
};

export default SalarySlip;
