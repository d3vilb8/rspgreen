import React from "react";

const UploadCardView = () => {
  // Static customer data
  const customerInfo = [
    { id: "T12345", name: "John Doe", totalAmount: 150.75 },
    { id: "T67890", name: "Jane Smith", totalAmount: 200.00 },
  ];

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center">
      <div className="w-full max-w-5xl p-6 mt-8 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Customer Transactions</h2>
        {customerInfo.length === 0 ? (
          <p className="text-center text-gray-500">No customer data found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left text-gray-600 font-medium px-4 py-2 border-b">Transaction ID</th>
                  <th className="text-left text-gray-600 font-medium px-4 py-2 border-b">Customer Name</th>
                  <th className="text-left text-gray-600 font-medium px-4 py-2 border-b">Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {customerInfo.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-700 border-b">{customer.id}</td>
                    <td className="px-4 py-2 text-gray-700 border-b">{customer.name}</td>
                    <td className="px-4 py-2 text-gray-700 border-b">${customer.totalAmount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadCardView;
