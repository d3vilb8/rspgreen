import React from "react";

const Invoice = () => {
  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-gray-100 py-10">
      <div className="bg-white shadow-md rounded-md w-full max-w-4xl p-6">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Purchase</h2>
            <p className="text-sm text-gray-500">#PUR00001</p>
            <p className="text-sm text-gray-500">Issue Date: Jul 22, 2024</p>
          </div>
          <div>
            {/* <div className="w-16 h-16 border rounded-md flex items-center justify-center">
              {/* QR Code Placeholder */}
              {/* <p className="text-sm text-gray-500">QR Code</p>
            </div> */} 
          </div>
        </div>

        {/* Status */}
        <div className="mb-4">
          <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
            Paid
          </span>
        </div>

        {/* Product Summary */}
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Product Summary</h3>
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left text-sm font-medium text-gray-600 p-2 border">#</th>
                <th className="text-left text-sm font-medium text-gray-600 p-2 border">Product</th>
                <th className="text-left text-sm font-medium text-gray-600 p-2 border">Quantity</th>
                <th className="text-left text-sm font-medium text-gray-600 p-2 border">Rate</th>
                <th className="text-left text-sm font-medium text-gray-600 p-2 border">Discount</th>
                <th className="text-left text-sm font-medium text-gray-600 p-2 border">Tax</th>
                <th className="text-left text-sm font-medium text-gray-600 p-2 border">Description</th>
                <th className="text-left text-sm font-medium text-gray-600 p-2 border">Price</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-sm text-gray-700 p-2 border">1</td>
                <td className="text-sm text-gray-700 p-2 border">Product A</td>
                <td className="text-sm text-gray-700 p-2 border">2</td>
                <td className="text-sm text-gray-700 p-2 border">₹525.00</td>
                <td className="text-sm text-gray-700 p-2 border">₹50.00</td>
                <td className="text-sm text-gray-700 p-2 border">CGST (18%)</td>
                <td className="text-sm text-gray-700 p-2 border">Description here</td>
                <td className="text-sm text-gray-700 p-2 border">₹1,018.50</td>
              </tr>
              <tr>
                <td className="text-sm text-gray-700 p-2 border">2</td>
                <td className="text-sm text-gray-700 p-2 border">Product B</td>
                <td className="text-sm text-gray-700 p-2 border">1</td>
                <td className="text-sm text-gray-700 p-2 border">₹150.00</td>
                <td className="text-sm text-gray-700 p-2 border">₹10.00</td>
                <td className="text-sm text-gray-700 p-2 border">SGST (12%)</td>
                <td className="text-sm text-gray-700 p-2 border">Description here</td>
                <td className="text-sm text-gray-700 p-2 border">₹157.20</td>
              </tr>
              <tr>
                <td className="text-sm text-gray-700 p-2 border">3</td>
                <td className="text-sm text-gray-700 p-2 border">Product C</td>
                <td className="text-sm text-gray-700 p-2 border">3</td>
                <td className="text-sm text-gray-700 p-2 border">₹200.00</td>
                <td className="text-sm text-gray-700 p-2 border">₹20.00</td>
                <td className="text-sm text-gray-700 p-2 border">-</td>
                <td className="text-sm text-gray-700 p-2 border">Description here</td>
                <td className="text-sm text-gray-700 p-2 border">₹540.00</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Payment Summary */}
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Payment Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left text-sm font-medium text-gray-600 p-2 border">Payment Receipt</th>
                <th className="text-left text-sm font-medium text-gray-600 p-2 border">Date</th>
                <th className="text-left text-sm font-medium text-gray-600 p-2 border">Amount</th>
                <th className="text-left text-sm font-medium text-gray-600 p-2 border">Account</th>
                <th className="text-left text-sm font-medium text-gray-600 p-2 border">Reference</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-sm text-gray-700 p-2 border">#REC001</td>
                <td className="text-sm text-gray-700 p-2 border">Jul 22, 2024</td>
                <td className="text-sm text-gray-700 p-2 border">₹1,000.00</td>
                <td className="text-sm text-gray-700 p-2 border">Cash</td>
                <td className="text-sm text-gray-700 p-2 border">#REF123</td>
              </tr>
              <tr>
                <td className="text-sm text-gray-700 p-2 border">#REC002</td>
                <td className="text-sm text-gray-700 p-2 border">Jul 23, 2024</td>
                <td className="text-sm text-gray-700 p-2 border">₹500.00</td>
                <td className="text-sm text-gray-700 p-2 border">Bank</td>
                <td className="text-sm text-gray-700 p-2 border">#REF456</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
