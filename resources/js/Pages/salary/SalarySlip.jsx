import React, { useState, useEffect } from "react";

const SalarySlip = ({ combinedData, deductions, data }) => {
    const [selectedDeductions, setSelectedDeductions] = useState([]);
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

    const goBack = () => {
        window.history.back(); // Go back to the previous page
    };

    useEffect(() => {
        console.log("Selected Deductions:", selectedDeductions);
    }, [selectedDeductions]);

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 shadow-lg rounded-lg">
            <button
                onClick={goBack}
                className="bg-teal-400 hover:bg-teal-500 text-white py-2 px-4 rounded-full mb-6"
            >
                Back
            </button>

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
                                        <td className="px-6 py-3 border border-gray-300">{data.find((d) => d.id === employee_id)?.employee_id || "N/A"}</td>
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
                                    <tr className="hover:bg-blue-50">
                                        <td className="px-6 py-3 border border-gray-300 text-black font-semibold">Total Deductions</td>
                                        <td className="px-6 py-3 border border-gray-300 text-red-600 font-semibold">
                                            {formatToCurrency(updatedTotalDeduction)}
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
                                    {/* Added Salary Deduction Days */}
                                    <tr className="bg-blue-50 hover:bg-blue-100">
                                        <td className="px-6 py-3 border border-gray-300 text-black font-semibold">Salary Deduction Days</td>
                                        <td className="px-6 py-3 border border-gray-300 text-red-700 font-semibold">
                                            {matchedData?.salary_deduction_days || "N/A"}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    );
                })
            ) : (
                <p className="text-center text-gray-700 text-lg">No employee data available.</p>
            )}

            <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Select Deductions:</h2>
                <div className="grid grid-cols-2 gap-4">
                    {deductions.map((deduction) => (
                        <label
                            key={deduction.id}
                            className="flex items-center space-x-2 bg-teal-100 p-4 rounded-lg shadow hover:bg-teal-200 transition duration-300 ease-in-out"
                        >
                            <input
                                type="checkbox"
                                value={deduction.id}
                                onChange={handleDeductionChange}
                                className="h-5 w-5 text-purple-600"
                            />
                            <span className="text-gray-700">
                                {deduction.title} - {formatToCurrency(deduction.amount)}
                            </span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SalarySlip;




// import React, { useState, useEffect } from "react";

// const SalarySlip = ({ combinedData, deductions, data }) => {
//     const [selectedDeductions, setSelectedDeductions] = useState([]);
//     console.log("Employee Data", combinedData);
//     console.log("Additional Data", data);

//     // Format amount to INR currency
//     const formatToCurrency = (amount) =>
//         new Intl.NumberFormat("en-IN", {
//             style: "currency",
//             currency: "INR",
//         }).format(amount || 0);

//     // Handle checkbox changes for deductions
//     const handleDeductionChange = (event) => {
//         const { value, checked } = event.target;
//         const deduction = deductions.find((ded) => ded.id === parseInt(value));
//         setSelectedDeductions((prevSelected) =>
//             checked
//                 ? [...prevSelected, deduction]
//                 : prevSelected.filter((ded) => ded.id !== parseInt(value))
//         );
//     };

//     // Trigger print functionality
//     const handlePrint = () => {
//         window.print();
//     };

//     useEffect(() => {
//         console.log("Selected Deductions:", selectedDeductions);
//     }, [selectedDeductions]);

//     return (
//         <div className="max-w-4xl mx-auto p-6 rounded-lg shadow-md bg-white">
//             {/* Print Button */}
//             {/* <button
//                 onClick={handlePrint}
//                 className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
//             >
//                 Print Salary Slip
//             </button> */}

//             {Array.isArray(combinedData) && combinedData.length > 0 ? (
//                 combinedData.map((employee) => {
//                     const {
//                         employee_id,
//                         employeeName,
//                         generate_date,
//                         allowance = 0,
//                         perDaySalary = 0,
//                         total_amount = 0,
//                         approved_by,
//                         approved_date,
//                     } = employee;

//                     // Find matching additional data from the array
//                     const matchedData = data.find((item) => item.id === employee_id);

//                     // Calculate total salary (basic + allowance)
//                     let totalSalary = total_amount + allowance;

//                     // Calculate total deductions
//                     const totalDeduction = selectedDeductions.reduce(
//                         (acc, item) => acc + (parseFloat(item.amount) || 0),
//                         0
//                     );

//                     // If matched data exists, add the salary deduction amount to total deductions
//                     let updatedTotalDeduction = totalDeduction;
//                     if (matchedData && matchedData.salary_deduction_amount) {
//                         updatedTotalDeduction += parseFloat(matchedData.salary_deduction_amount);
//                     }

//                     // Calculate net salary
//                     let netSalary = totalSalary - updatedTotalDeduction;

//                     return (
//                         <div
//                             key={employee_id}
//                             className="border border-gray-300 rounded-lg mb-6 bg-gray-50 salary-slip"
//                         >
//                             {/* Header */}
//                             <header className="flex justify-between items-start p-4 border-b">
//                                 <div>
//                                     <h1 className="text-2xl font-bold text-gray-700">Rsp Green</h1>
//                                 </div>
//                                 <div className="text-right">
//                                     <p className="font-semibold text-gray-700">
//                                         Employee Id: {employee_id || "N/A"}
//                                     </p>
//                                     <p className="text-sm text-gray-600">
//                                         Salary Date: {generate_date || "N/A"}
//                                     </p>
//                                 </div>
//                             </header>

//                             {/* Salary Details */}
//                             <div className="p-4">
//                                 <table className="w-full border-collapse">
//                                     <thead>
//                                         <tr className="text-left border-b">
//                                             <th className="py-2">Earning</th>
//                                             <th className="py-2">Title</th>
//                                             <th className="py-2">Type</th>
//                                             <th className="py-2">Amount</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         <tr>
//                                             <td className="py-2">Basic Salary</td>
//                                             <td>-</td>
//                                             <td>-</td>
//                                             <td>{formatToCurrency(total_amount)}</td>
//                                         </tr>
//                                         <tr>
//                                             <td className="py-2">Allowance</td>
//                                             <td>Education or Training</td>
//                                             <td>Fixed</td>
//                                             <td>{formatToCurrency(allowance)}</td>
//                                         </tr>
//                                     </tbody>
//                                 </table>
//                             </div>

//                             {/* Deduction Selection */}
//                             <div className="p-4 deduction-selection">
//                                 <h2 className="text-lg font-semibold mb-2">Select Deductions:</h2>
//                                 {deductions.map((deduction) => (
//                                     <div key={deduction.id} className="mb-2">
//                                         <label className="flex items-center">
//                                             <input
//                                                 type="checkbox"
//                                                 value={deduction.id}
//                                                 onChange={handleDeductionChange}
//                                                 className="mr-2"
//                                             />
//                                             {deduction.title} - {formatToCurrency(deduction.amount)}
//                                         </label>
//                                     </div>
//                                 ))}
//                             </div>

//                             {/* Deduction Details */}
//                             {selectedDeductions.length > 0 && (
//                                 <div className="p-4">
//                                     <table className="w-full border-collapse">
//                                         <thead>
//                                             <tr className="text-left border-b">
//                                                 <th className="py-2">Title</th>
//                                                 <th className="py-2">Type</th>
//                                                 <th className="py-2">Amount</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody>
//                                             {selectedDeductions.map((deduction) => (
//                                                 <tr key={deduction.id}>
//                                                     <td>{deduction.title || "N/A"}</td>
//                                                     <td>{deduction.fixed ? "Fixed" : "Variable"}</td>
//                                                     <td>{formatToCurrency(deduction.amount)}</td>
//                                                 </tr>
//                                             ))}
//                                         </tbody>
//                                     </table>
//                                 </div>
//                             )}

//                             {/* Additional Deduction from data if id matches */}
//                             {matchedData && (
//                                 <div className="p-4">
//                                     <h3 className="font-semibold text-lg">Additional Deduction Information</h3>
//                                     <table className="w-full border-collapse">
//                                         <tbody>
//                                             <tr>
//                                                 <td className="py-2">Salary Deduction Amount</td>
//                                                 <td>{formatToCurrency(matchedData.salary_deduction_amount)}</td>
//                                             </tr>
//                                             <tr>
//                                                 <td className="py-2">Salary Deduction Days</td>
//                                                 <td>{matchedData.salary_deduction_days}</td>
//                                             </tr>
//                                         </tbody>
//                                     </table>
//                                 </div>
//                             )}

//                             {/* Summary */}
//                             <div className="p-4 border-t">
//                                 <div className="flex justify-between">
//                                     <p className="font-semibold">Total Earning:</p>
//                                     <p>{formatToCurrency(totalSalary)}</p>
//                                 </div>
//                                 <div className="flex justify-between">
//                                     <p className="font-semibold">Total Deduction:</p>
//                                     <p>{formatToCurrency(updatedTotalDeduction)}</p>
//                                 </div>
//                                 <div className="flex justify-between font-bold text-lg">
//                                     <p>Net Salary:</p>
//                                     <p>{formatToCurrency(netSalary)}</p>
//                                 </div>
//                             </div>

//                             {/* Footer */}
//                             <footer className="p-4 text-center">
//                                 <p className="text-sm text-gray-600">
//                                     Approved By: {approved_by || "N/A"}
//                                 </p>
//                                 <p className="text-sm text-gray-600">
//                                     Approved Date: {approved_date || "N/A"}
//                                 </p>
//                                 <p className="text-sm text-gray-600">Employee Signature: __________</p>
//                             </footer>
//                         </div>
//                     );
//                 })
//             ) : (
//                 <p>No employee data available.</p>
//             )}
//         </div>
//     );
// };

// export default SalarySlip;
