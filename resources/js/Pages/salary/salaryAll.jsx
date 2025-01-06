import Header from "@/Layouts/Header";
import Nav from "@/Layouts/Nav";
import { useState } from "react";

const SalaryPage = ({
    user,
    notif,
    user_type,
    employees,
    salaries,
    salary,
    Employee,
}) => {
    const [selectedEmployee, setSelectedEmployee] = useState("All Employees");
    const [selectedMonth, setSelectedMonth] = useState("2025-01");
    const [filteredSalaries, setFilteredSalaries] = useState(salaries);
    console.log("hhhh", salary);
    const handleSearch = () => {
        const filtered = salaries.filter((salary) => {
            const matchesEmployee =
                selectedEmployee === "All Employees" ||
                salary.employee_name === selectedEmployee;
            const matchesMonth =
                !selectedMonth ||
                salary.generate_date.startsWith(selectedMonth);
            return matchesEmployee && matchesMonth;
        });
        setFilteredSalaries(filtered);
    };
    console.log("hyhhhhh", employees);

    return (
        <div className="flex flex-col w-full ml-[11.5rem]">
            {/* Header */}
            <Header user={user} notif={notif} />
            <Nav user_type={user_type} />

            <div className="px-[5rem] py-4 w-full">
                {/* Filters */}
                <div className="px-10 py-6">
                    <div className="flex items-center space-x-4 mb-6">
                        <select
                            className="border p-2 rounded"
                            value={selectedEmployee}
                            onChange={(e) =>
                                setSelectedEmployee(e.target.value)
                            }
                        >
                            <option>All Employees</option>
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
                            className="bg-blue-600 text-white p-2 rounded"
                            onClick={handleSearch}
                        >
                            Search
                        </button>
                    </div>

                    {/* Table */}
                    <div className="border rounded-lg shadow-md">
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-100">
                                <tr>
                                    {/* <th className="border p-2 text-left">ID</th> */}
                                    {/* <th className="border p-2 text-left">
                                        Name
                                    </th> */}
                                    {/* <th className="border p-2 text-left">
                                        Payment Mode
                                    </th> */}
                                    {/* <th className="border p-2 text-left">
                                        Basic Salary
                                    </th> */}
                                    {/* <th className="border p-2 text-left">
                                        Generate Date
                                    </th>
                                    <th className="border p-2 text-left">
                                        Status
                                    </th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {salary?.length > 0 ? (
                                    salary.map((sal) => (
                                        <tr
                                            key={sal.employee_id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="border p-2">
                                                {sal.employee_id}
                                            </td>
                                            <td className="border p-2">
                                                {sal.salary_name}
                                            </td>
                                            <td className="border p-2">
                                                {sal.generate_date}
                                            </td>
                                            {/* <td className="border p-2">
                                                ${sal.basic_salary.toFixed(2)}
                                            </td> */}
                                            {/* <td className="border p-2">
                                                ${sal.net_salary.toFixed(2)}
                                            </td> */}
                                            <td
                                                className={`border p-2 ${
                                                    sal.status === "Paid"
                                                        ? "text-green-600"
                                                        : "text-red-500"
                                                }`}
                                            >
                                                {sal.status}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="border p-2 text-center text-gray-500"
                                        >
                                            No salaries found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalaryPage;
