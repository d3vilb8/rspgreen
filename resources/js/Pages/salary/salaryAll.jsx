import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import ReactDOMServer from "react-dom/server";
import Header from "@/Layouts/Header";
import Nav from "@/Layouts/Nav";
import SalarySlip from "./SalarySlip";
import Salarypdf from "./Salarypdf";

const SalaryPage = ({
    user,
    notif,
    user_type,
    employees,
    salary,
    deductions,
    deductionsss,
    combinedData,
}) => {
    const [selectedEmployee, setSelectedEmployee] = useState("All Employees");
    const [selectedMonth, setSelectedMonth] = useState("2025-01");
    const [filteredSalaries, setFilteredSalaries] = useState([]);
    const [selectedSalary, setSelectedSalary] = useState(null);

    const nameMap = employees.reduce((acc, emp) => {
        acc[emp.id] = emp.name;
        return acc;
    }, {});

    useEffect(() => {
        const calculateSalaries = () => {
            const updatedSalaries = salary?.map((sal) => {
                const generateDate = new Date(sal.generate_date);
                const daysInMonth = new Date(
                    generateDate.getFullYear(),
                    generateDate.getMonth() + 1,
                    0
                ).getDate();

                const totalAmount = parseFloat(sal.total_amount);
                const perDaySalary = totalAmount / daysInMonth;
                const hourlySalary = totalAmount / (daysInMonth * 8);

                return {
                    ...sal,
                    perDaySalary: perDaySalary.toFixed(2),
                    hourlySalary: hourlySalary.toFixed(2),
                };
            });
            setFilteredSalaries(updatedSalaries);
        };

        calculateSalaries();
    }, [salary]);

    const handleSearch = () => {
        const filtered = salary.filter((sal) => {
            const matchesEmployee =
                selectedEmployee === "All Employees" ||
                nameMap[sal?.employee_id] === selectedEmployee;
            const matchesMonth =
                !selectedMonth || sal.generate_date.startsWith(selectedMonth);
            return matchesEmployee && matchesMonth;
        });
        setFilteredSalaries(filtered);
    };
  

    const generatePDF = (salaryData) => {
        console.log("Salary Data:", salaryData); // Log the salary data
    
        // Create a new jsPDF instance
        const doc = new jsPDF();
    
        // Convert Salarypdf component to static HTML
        const salaryPdfHtml = ReactDOMServer.renderToStaticMarkup(
            <Salarypdf
            combinedData={[selectedSalary]}
            deductions={deductions}
            signatureName={selectedSalary?.employeeName}
            salary={salary}
            data={combinedData}
            />
        );
    
        console.log("Generated HTML for PDF:", salaryPdfHtml); // Log the generated HTML for debugging
    
        // Add the HTML content to the PDF document
        doc.html(salaryPdfHtml, {
            callback: function (doc) {
                // Save the PDF
                const fileName = `SalarySlip_${salaryData?.employeeName || "Employee"}.pdf`;
                doc.save(fileName);
            },
            x: 10,
            y: 10,
        });
    };
    return (
        <div className="flex flex-col w-full ml-[11.5rem]">
            <Header user={user} notif={notif} />
            <Nav user_type={user_type} />
            <div className="px-[5rem] py-4 w-full">
                {!selectedSalary ? (
                    <>
                        <div className="flex items-center space-x-4 mb-6">
                            <select
                                className="border p-2 rounded"
                                value={selectedEmployee}
                                onChange={(e) => setSelectedEmployee(e.target.value)}
                            >
                                <option value="All Employees">All Employees</option>
                                {employees.map((emp) => (
                                    <option key={emp.id} value={emp.name}>
                                        {emp.name}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="month"
                                className="border p-2 rounded"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                            />
                            <button
                                className="bg-blue-500 text-white p-2 rounded"
                                onClick={handleSearch}
                            >
                                Search
                            </button>
                        </div>

                        <table className="w-full border-collapse">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border p-2">Salary Generate Date</th>
                                    <th className="border p-2">Generate Date</th>
                                    <th className="border p-2">Status</th>
                                    <th className="border p-2">Total Amount</th>
                                    <th className="border p-2">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSalaries.map((sal) => (
                                    <tr key={sal.id}>
                                        <td className="border p-2">{sal.salary_name}</td>
                                        <td className="border p-2">{sal.generate_date}</td>
                                        <td className="border p-2">{sal.status}</td>
                                        <td className="border p-2">{sal.total_amount}</td>
                                        <td className="border p-2">
                                            <button
                                                className="bg-blue-500 text-white p-2 rounded mr-2"
                                                onClick={() =>
                                                    setSelectedSalary({
                                                        ...sal,
                                                        employeeName: nameMap[sal.employee_id],
                                                        deductions: deductionsss,
                                                    })
                                                }
                                            >
                                                View Details
                                            </button>
                                            {/* <button
                                                className="bg-green-500 text-white p-2 rounded"
                                                onClick={() => generatePDF(sal)}
                                            >
                                                PDF Salary Slip
                                            </button> */}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                ) : (
                    <SalarySlip
                        combinedData={[selectedSalary]}
                        deductions={deductions}
                        signatureName={selectedSalary.employeeName}
                        salary={salary}
                        data={combinedData}
                    />
                )}
            </div>
        </div>
    );
};

export default SalaryPage;
