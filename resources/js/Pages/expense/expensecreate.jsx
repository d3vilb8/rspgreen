import React, { useState } from "react";

const ExpenseCreate = () => {
    const [payeeType, setPayeeType] = useState("Employee");

    return (
        <div className="p-8 bg-gray-100">
            <div className="bg-white p-6 rounded shadow">
                <h1 className="text-xl font-bold mb-4">Expense Create</h1>

                {/* Payee Section */}
                <div className="flex items-center space-x-4 mb-4">
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="payee"
                            value="Employee"
                            checked={payeeType === "Employee"}
                            onChange={() => setPayeeType("Employee")}
                            className="mr-2"
                        />
                        Employee
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="payee"
                            value="Customer"
                            checked={payeeType === "Customer"}
                            onChange={() => setPayeeType("Customer")}
                            className="mr-2"
                        />
                        Customer
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="payee"
                            value="Vendor"
                            checked={payeeType === "Vendor"}
                            onChange={() => setPayeeType("Vendor")}
                            className="mr-2"
                        />
                        Vendor
                    </label>
                </div>

                {/* Payee Selection, Payment Date, Category */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block mb-1">Payee</label>
                        <select className="w-full p-2 border rounded">
                            <option>Select Employee</option>
                            {/* Populate employees here */}
                        </select>
                    </div>
                    <div>
                        <label className="block mb-1">Payment Date</label>
                        <input type="date" className="w-full p-2 border rounded" />
                    </div>
                    <div>
                        <label className="block mb-1">Category</label>
                        <select className="w-full p-2 border rounded">
                            <option>Select Category</option>
                            {/* Populate categories here */}
                        </select>
                    </div>
                </div>

                {/* Account */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div>
                        <label className="block mb-1">Account</label>
                        <input type="text" value="Cash" className="w-full p-2 border rounded" readOnly />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExpenseCreate;
