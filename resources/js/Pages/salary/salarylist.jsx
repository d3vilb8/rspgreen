import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    FaCreditCard,
    FaDownload,
    FaEdit,
    FaPaperPlane,
    FaSms,
    FaTrash,
} from "react-icons/fa";
import { Notyf } from "notyf";
import "notyf/notyf.min.css"; 
// import axios from 'axios';
const notyf = new Notyf();
const SalaryList = ({ salary }) => {
    const [salaries, setSalaries] = useState([]);

    useEffect(() => {
        const fetchSalaries = async () => {
            const response = await axios.get("/salaries");
            setSalaries(response.data.salaries);
        };

        fetchSalaries();
    }, []);

    function handleStatus(type) {
        if (type === "sms") {
            notyf.error("Please configure your sms api!");
        } else {
            notyf.error("Please configure your mail setup!");
        }
    }

    return (
        <div className="w-[70%] mt-8 shadow-[rgba(60,64,67,0.3)_0px_1px_2px_0px,rgba(60,64,67,0.15)_0px_2px_6px_2px] p-4">
            <h3 className="text-2xl font-semibold mb-4">Salary list</h3>
            <div className="overflow-x-auto w-full">
                <table className="min-w-full border border-gray-300 bg-white shadow-md">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-3 text-left border">Sl</th>
                            <th className="p-3 text-left border">
                                Salary Name
                            </th>
                            <th className="p-3 text-left border">
                                Generate Date
                            </th>
                            <th className="p-3 text-left border">
                                Generate By
                            </th>
                            {/* <th className="p-3 text-left border">Status</th> */}
                            <th className="p-3 text-left border">
                                Approved Date
                            </th>
                            <th className="p-3 text-left border">
                                Approved By
                            </th>
                            <th className="p-3 text-left border">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {salary?.map((salary, index) => (
                            <tr key={salary.id} className="border-b">
                                <td className="p-3 border">{index + 1}</td>
                                <td className="p-3 border">
                                    {salary.salary_name}
                                </td>
                                <td className="p-3 border">
                                    {salary.generate_date}
                                </td>
                                <td className="p-3 border">
                                    {salary.generate_by}
                                </td>
                                {/* <td className="p-3 border">
                                    <span
                                        className={`px-2 py-1 text-xs font-semibold rounded ${salary.status === 'Approved'
                                            ? 'bg-green-200 text-green-800'
                                            : 'bg-yellow-200 text-yellow-800'
                                            }`}
                                    >
                                        {salary.status}
                                    </span>
                                </td> */}
                                <td className="p-3 border">
                                    {salary.approved_date || "N/A"}
                                </td>

                                <td className="p-3 border">
                                    {salary.approved_by || "N/A"}
                                </td>
                                <td className="space-x-2">
                                    {" "}
                                    <button
                                        type="button"
                                        onClick={(e) => handleStatus("mail")}
                                        className="px-2 py-2 bg-green-500 rounded text-white"
                                    >
                                        <FaPaperPlane />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(e) => handleStatus("sms")}
                                        className="px-2 py-2 bg-indigo-500 rounded text-white"
                                    >
                                        <FaSms />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SalaryList;
