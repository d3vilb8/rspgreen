import React, { useState } from "react";

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
      const taxableIncomeInSlab = Math.min(income, slab.maxIncome) - previousSlabMax;
      tax += taxableIncomeInSlab * slab.rate;
      previousSlabMax = slab.maxIncome;
    } else {
      break;
    }
  }

  return tax;
};

const SalarySlip = ({ data, onClose, signatureName }) => {
  const [deductions, setDeductions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newDeduction, setNewDeduction] = useState({ title: "", amount: "" });

  const basicSalary = parseFloat(data.total_amount) || 0;
  const da = basicSalary * 0.2;
  const totalEarnings = basicSalary + da;

  const taxAmount = calculateTax(totalEarnings);

  const updatedDeductions = deductions.find((ded) => ded.title === "Income Tax")
    ? deductions
    : deductions;

  const totalDeductions = updatedDeductions.reduce(
    (sum, ded) => sum + (parseFloat(ded.amount) || 0),
    0
  );

  const formatToINR = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount || 0);

  const handleAddDeduction = () => {
    if (newDeduction.title && newDeduction.amount) {
      setDeductions([
        ...updatedDeductions,
        {
          id: newDeduction.title.toLowerCase().replace(" ", "_"),
          title: newDeduction.title,
          amount: parseFloat(newDeduction.amount),
        },
      ]);
      setNewDeduction({ title: "", amount: "" });
      setShowModal(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto border p-6 rounded shadow-lg bg-white">
      {/* Header Section */}
      <header className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold">RSP GREEN</h1>
          {/* <p>114 New Mexico 371, Wilmington, New York - 87323</p> */}
        </div>
        <div className="text-right">
          <p>
            <span className="font-bold">Name: </span>
            {data.employeeName || "pinaki Ray"}
          </p>
          <p>
            <span className="font-bold">Employee Id: </span>
            {data.position || "1111014"}
          </p>
          <p>
            <span className="font-bold">Salary Date: </span>
            {data.generate_date || ""}
          </p>
        </div>
      </header>

      {/* Earnings Section */}
      <section className="mb-6">
        <table className="w-full border-collapse border text-left">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Earning</th>
              <th className="border p-2">Title</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">Basic Salary</td>
              <td className="border p-2">-</td>
              <td className="border p-2">Fixed</td>
              <td className="border p-2">{formatToINR(basicSalary)}</td>
            </tr>
            <tr>
              <td className="border p-2">Allowance</td>
              <td className="border p-2">Education or Training Allowance</td>
              <td className="border p-2">Fixed</td>
              <td className="border p-2">{formatToINR(da)}</td>
            </tr>
            <tr>
              <td className="border p-2">Total Earnings</td>
              <td colSpan="3" className="border p-2 text-right">
                {formatToINR(totalEarnings)}
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Deductions Section */}
      <section className="mb-6">
        <h2 className="text-lg font-bold">Deductions</h2>
        {/* <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white py-2 px-4 rounded mt-2"
        >
          + Add Deduction
        </button> */}

        <table className="w-full border-collapse border text-left mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Deduction</th>
              <th className="border p-2">Title</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {updatedDeductions.length === 0 ? (
              <tr>
                <td colSpan="4" className="border p-2 text-center text-gray-500">
                  No deductions added yet
                </td>
              </tr>
            ) : (
              updatedDeductions.map((ded) => (
                <tr key={ded.id}>
                  <td className="border p-2">{ded.title}</td>
                  <td className="border p-2">-</td>
                  <td className="border p-2">Fixed</td>
                  <td className="border p-2">
                    {formatToINR(parseFloat(ded.amount) || 0)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      {/* Footer Section */}
      <footer className="text-right mt-4">
        <p>
          <span className="font-bold">Total Deductions: </span>
          {formatToINR(totalDeductions)}
        </p>
        <p>
          <span className="font-bold">Net Salary: </span>
          {formatToINR(totalEarnings - totalDeductions)}
        </p>
      </footer>

      {/* Signature Section */}
      <div className="mt-12 text-center">
        <p className="italic">Signature:</p>
        <p className="font-bold mt-4">{signatureName || "Authorized Signatory"}</p>
      </div>

      {/* Add Deduction Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Add Deduction</h2>
            <div className="mb-4">
              <label htmlFor="deductionTitle" className="block text-sm font-medium">
                Deduction Title
              </label>
              <input
                id="deductionTitle"
                type="text"
                className="w-full p-2 border rounded"
                value={newDeduction.title}
                onChange={(e) =>
                  setNewDeduction({ ...newDeduction, title: e.target.value })
                }
                placeholder="Enter deduction title"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="deductionAmount" className="block text-sm font-medium">
                Deduction Amount
              </label>
              <input
                id="deductionAmount"
                type="number"
                className="w-full p-2 border rounded"
                value={newDeduction.amount}
                onChange={(e) =>
                  setNewDeduction({ ...newDeduction, amount: e.target.value })
                }
                placeholder="Enter deduction amount"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleAddDeduction}
                className="bg-green-500 text-white py-2 px-4 rounded mr-2"
              >
                Add
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-red-500 text-white py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalarySlip;
