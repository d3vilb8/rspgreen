import { Link } from '@inertiajs/react';
import React from 'react';

function Quotationprint({ user, data, products, totalAmount }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 bg-gray-100">
      {/* Header Section */}
      <div className="p-4 bg-white rounded-md shadow-md">
        <div className="flex justify-between">
          <div>
            <h1 className="text-lg font-semibold">Quotation</h1>
          </div>
          <div>
            <p className="text-sm text-gray-500">Quotation Number: {data.quotation_id}</p>
            <p className="text-sm text-gray-500">Date: {data.date}</p>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="grid grid-cols-3 gap-4 p-4 mt-4 bg-white rounded-md shadow-md">
        {/* Left Section */}
        <div>
          <h2 className="text-sm font-semibold">Quotation By: {user.name}</h2>
          <p className="text-sm">Email: {user.email}</p>
        </div>

        {/* Middle Section */}
        <div></div>

        {/* Right Section */}
        <div>
          <h2 className="text-sm font-semibold">Quotation To</h2>
          <p className="text-sm">Name: {data.name}</p>
          <p className="text-sm">Email: {data.email}</p>
          <p className="text-sm">Mobile: {data.phone}</p>
        </div>
      </div>

      {/* Product Information Section */}
      <div className="p-4 mt-4 bg-white rounded-md shadow-md">
        <h2 className="text-sm font-semibold">Product Information</h2>
        <table className="w-full mt-2 border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left border">Item Name</th>
              <th className="p-2 text-left border">Quantity</th>
              <th className="p-2 text-left border">Price (Af)</th>
              <th className="p-2 text-left border">Amount (Af)</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index}>
                <td className="p-2 border">{product.name}</td>
                <td className="p-2 border">{product.qty}</td>
                <td className="p-2 border">{product.price}</td>
                <td className="p-2 border">{product.net_amount}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 text-right">
          <p className="text-sm font-semibold">Total Quotation Amount (Af): {totalAmount}</p>
          <p className="text-sm">ACE Tax Consultants (2%): {(totalAmount * 0.02).toFixed(2)}</p>
          <p className="text-sm font-semibold">
            Total Amount (Af): {(totalAmount + totalAmount * 0.02).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Footer Section with Buttons */}
      <div className="flex justify-end mt-4 space-x-2">
        <button
          className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
          onClick={handlePrint}
        >
          Print
        </button>
        <Link href='/Quotation' className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">Close</Link>
      </div>
    </div>
  );
}

export default Quotationprint;
