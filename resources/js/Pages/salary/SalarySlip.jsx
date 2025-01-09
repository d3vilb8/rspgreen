import React, { useState } from "react";
import { useForm } from "@inertiajs/react";

const TAX_SLABS = [
    { maxIncome: 500000, rate: 0.05 },
    { maxIncome: 1000000, rate: 0.1 },
    { maxIncome: Infinity, rate: 0.15 },
];

const calculateTax = (income) => {
    let tax = 0;
    let previousSlabMax = 0;

    for (const slab of TAX_SLABS) {
        if (income > previousSlabMax) {
            const taxableIncomeInSlab =
                Math.min(income, slab.maxIncome) - previousSlabMax;
            tax += taxableIncomeInSlab * slab.rate;
            previousSlabMax = slab.maxIncome;
        } else {
            break;
        }
    }

    return tax;
};

const SalarySlip = ({ combinedData, deductionsss, signatureName }) => {
    const [selectedDeductions, setSelectedDeductions] = useState([]);

    const formatToINR = (amount) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(amount || 0);

    const handleDeductionChange = (event) => {
        const { value, checked } = event.target;
        const deduction = deductionsss.find((ded) => ded.id === parseInt(value));
        setSelectedDeductions((prevSelected) =>
            checked
                ? [...prevSelected, deduction]
                : prevSelected.filter((ded) => ded.id !== parseInt(value))
        );
    };

    return (
        <div className="max-w-6xl mx-auto p-6 rounded shadow-lg bg-white">
            {combinedData.map((employee, index) => {
                const basicSalary = parseFloat(employee.basic_salary);
                const overlappingDays = parseInt(employee.overlapping_days) || 0;
                const perDaySalary = basicSalary / 30; // Assuming 30 days in a month
                const da = basicSalary * 0.2; // 20% of basic salary
                const totalEarnings = basicSalary + da;

                const deductionForOverlappingDays = 
                    overlappingDays === 1 ? perDaySalary * overlappingDays : 0;

                const totalDeductions =
                    deductionForOverlappingDays +
                    selectedDeductions.reduce(
                        (sum, ded) => sum + (parseFloat(ded.amount) || 0),
                        0
                    );

                const netSalary = totalEarnings - totalDeductions;

                return (
                    <div
                        key={index}
                        className="border p-4 rounded mb-6 bg-gray-50"
                    >
                        <header className="flex justify-between items-start mb-6">
                            <div>
                                <h1 className="text-xl font-bold">RSP GREEN</h1>
                                <p><strong>Employee ID: </strong>{employee.employee_id || "N/A"}</p>
                            </div>
                            <div className="text-right">
                                <p>
                                    <strong>Name: </strong>
                                    {employee.employee_name || "N/A"}
                                </p>
                                <p>
                                    <strong>Salary Date: </strong>
                                    {employee.generate_date || "N/A"}
                                </p>
                            </div>
                        </header>

                        {/* Earnings Section */}
                        <section className="mb-6">
                            <h2 className="text-lg font-bold">Earnings</h2>
                            <table className="w-full border-collapse border text-left">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border p-2">Earning</th>
                                        <th className="border p-2">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border p-2">Basic Salary</td>
                                        <td className="border p-2">
                                            {formatToINR(basicSalary)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2">Allowance (DA)</td>
                                        <td className="border p-2">
                                            {formatToINR(da)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2">Total Earnings</td>
                                        <td className="border p-2">
                                            {formatToINR(totalEarnings)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </section>

                        {/* Deductions Section */}
                        <section className="mb-6">
                            <h2 className="text-lg font-bold">Deductions</h2>
                            <table className="w-full border-collapse border text-left">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border p-2">Deduction</th>
                                        <th className="border p-2">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border p-2">
                                            Overlapping Days Deduction
                                        </td>
                                        <td className="border p-2">
                                            {formatToINR(deductionForOverlappingDays)}
                                        </td>
                                    </tr>
                                    {selectedDeductions.map((ded) => (
                                        <tr key={ded.id}>
                                            <td className="border p-2">{ded.title}</td>
                                            <td className="border p-2">
                                                {formatToINR(ded.amount)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </section>

                        {/* Footer */}
                        <footer className="text-right mt-4">
                            <p>
                                <strong>Net Salary: </strong>
                                {formatToINR(netSalary)}
                            </p>
                            <p>
                                <strong>Total Deductions: </strong>
                                {formatToINR(totalDeductions)}
                            </p>
                        </footer>
                    </div>
                );
            })}
        </div>
    );
};

export default SalarySlip;
