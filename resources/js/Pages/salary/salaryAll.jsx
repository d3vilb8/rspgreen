import Header from "@/Layouts/Header";
import Nav from "@/Layouts/Nav";
import { useState, useEffect } from "react";
import SalarySlip from "./SalarySlip";

const SalaryPage = ({
    user,
    notif,
    user_type,
    employees,
    salary,
    deductionsss, // Passed from backend
    combinedData
}) => {
    const [selectedEmployee, setSelectedEmployee] = useState("All Employees");
    const [selectedMonth, setSelectedMonth] = useState("2025-01");
    const [filteredSalaries, setFilteredSalaries] = useState([]);
    const [selectedSalary, setSelectedSalary] = useState(null);
    console.log("hhhh", combinedData);
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
                nameMap[sal.employee_id] === selectedEmployee;
            const matchesMonth =
                !selectedMonth || sal.generate_date.startsWith(selectedMonth);
            return matchesEmployee && matchesMonth;
        });
        setFilteredSalaries(filtered);
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
                                onChange={(e) =>
                                    setSelectedEmployee(e.target.value)
                                }
                            >
                                <option value="All Employees">
                                    All Employees
                                </option>
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
                                onChange={(e) =>
                                    setSelectedMonth(e.target.value)
                                }
                            />

                            {/* <button
                className="bg-blue-600 text-white p-2 rounded"
                onClick={handleSearch}
              >
                Search
              </button> */}
                        </div>

                        <table className="w-full border-collapse">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border p-2">
                                        Salary Genearate Date
                                    </th>
                                    <th className="border p-2">
                                        Generate Date
                                    </th>
                                    <th className="border p-2">Status</th>
                                    <th className="border p-2">Total Amount</th>
                                    <th className="border p-2">
                                        Per Day Salary
                                    </th>
                                    <th className="border p-2">
                                        Hourly Salary
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSalaries.map((sal) => (
                                    <tr
                                        key={sal.id}
                                        onClick={() =>
                                            setSelectedSalary({
                                                ...sal,
                                                employeeName:
                                                    nameMap[sal.employee_id],
                                                deductions: deductionsss,
                                            })
                                        }
                                    >
                                        <td className="border p-2">
                                            {sal.salary_name}
                                        </td>
                                        <td className="border p-2">
                                            {sal.generate_date}
                                        </td>
                                        <td className="border p-2">
                                            {sal.status}
                                        </td>
                                        <td className="border p-2">
                                            {sal.total_amount}
                                        </td>
                                        <td className="border p-2">
                                            {sal.perDaySalary}
                                        </td>
                                        <td className="border p-2">
                                            {sal.hourlySalary}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                ) : (
                    <SalarySlip
                        data={selectedSalary}
                        onClose={() => setSelectedSalary(null)}
                        deductionsss={deductionsss}
                        combinedData={combinedData}
                    />
                )}
            </div>
        </div>
    );
};

export default SalaryPage;
