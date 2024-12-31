import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';

function ProposalCreate() {
  const { data, setData, post, errors } = useForm({
    customer_id: '',
    category_id: '',
    issue_date: '',
    items: [{ id: 1, item_name: '', quantity: 1, price: 0, discount: 0, tax: 0, amount: 0 }],
  });

  const addItem = () => {
    setData('items', [
      ...data.items,
      { id: data.items.length + 1, item_name: '', quantity: 1, price: 0, discount: 0, tax: 0, amount: 0 },
    ]);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...data.items];
    newItems[index][field] = value;

    // Calculate amount based on quantity, price, discount, and tax
    const { quantity, price, discount, tax } = newItems[index];
    const baseAmount = quantity * price;
    const discountAmount = (baseAmount * discount) / 100;
    const taxAmount = ((baseAmount - discountAmount) * tax) / 100;
    newItems[index].amount = baseAmount - discountAmount + taxAmount;

    setData('items', newItems);
  };

  const calculateTotals = () => {
    const subtotal = data.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
    const totalDiscount = data.items.reduce((acc, item) => acc + (item.quantity * item.price * item.discount) / 100, 0);
    const totalTax = data.items.reduce((acc, item) => acc + ((item.quantity * item.price - (item.quantity * item.price * item.discount) / 100) * item.tax) / 100, 0);
    const totalAmount = subtotal - totalDiscount + totalTax;
    return { subtotal, totalDiscount, totalTax, totalAmount };
  };

  const { subtotal, totalDiscount, totalTax, totalAmount } = calculateTotals();

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/proposals/store'); // Your Laravel route for storing proposals
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Proposal Create</h1>
          <p className="text-sm text-gray-600">Dashboard &gt; Proposal &gt; Proposal Create</p>
        </div>

        {/* Customer and Issue Date Section */}
        <div className="bg-white p-4 rounded-md shadow mb-6 grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Customer</label>
            <select
              value={data.customer_id}
              onChange={(e) => setData('customer_id', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Select Customer</option>
              {/* Populate options dynamically if needed */}
            </select>
            {errors.customer_id && <span className="text-red-500 text-sm">{errors.customer_id}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Issue Date</label>
            <input
              type="date"
              value={data.issue_date}
              onChange={(e) => setData('issue_date', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
            {errors.issue_date && <span className="text-red-500 text-sm">{errors.issue_date}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={data.category_id}
              onChange={(e) => setData('category_id', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Select Category</option>
              {/* Populate options dynamically if needed */}
            </select>
            {errors.category_id && <span className="text-red-500 text-sm">{errors.category_id}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Proposal Number</label>
            <input
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              value="#PROP0003"
              readOnly
            />
          </div>
        </div>

        {/* Product & Services Table */}
        <div className="bg-white p-4 rounded-md shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Product & Services</h2>
          <table className="w-full border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-4 text-left">Items</th>
                <th className="p-4 text-left">Quantity</th>
                <th className="p-4 text-left">Price</th>
                <th className="p-4 text-left">Discount</th>
                <th className="p-4 text-left">Tax (%)</th>
                <th className="p-4 text-left">Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, index) => (
                <tr key={item.id}>
                  <td className="p-4">
                    <input
                      type="text"
                      value={item.item_name}
                      onChange={(e) => handleItemChange(index, 'item_name', e.target.value)}
                      className="border border-gray-300 rounded-md p-2 w-full"
                      placeholder="Item Name"
                    />
                    {errors[`items.${index}.item_name`] && (
                      <span className="text-red-500 text-sm">{errors[`items.${index}.item_name`]}</span>
                    )}
                  </td>
                  <td className="p-4">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                      className="border border-gray-300 rounded-md p-2 w-full"
                      placeholder="Qty"
                    />
                  </td>
                  <td className="p-4">
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)}
                      className="border border-gray-300 rounded-md p-2 w-full"
                      placeholder="Price"
                    />
                  </td>
                  <td className="p-4">
                    <input
                      type="number"
                      value={item.discount}
                      onChange={(e) => handleItemChange(index, 'discount', parseFloat(e.target.value) || 0)}
                      className="border border-gray-300 rounded-md p-2 w-full"
                      placeholder="Discount"
                    />
                  </td>
                  <td className="p-4">
                    <input
                      type="number"
                      value={item.tax}
                      onChange={(e) => handleItemChange(index, 'tax', parseFloat(e.target.value) || 0)}
                      className="border border-gray-300 rounded-md p-2 w-full"
                      placeholder="Tax"
                    />
                  </td>
                  <td className="p-4 text-right">{item.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            type="button"
            onClick={addItem}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            + Add Item
          </button>
        </div>

        {/* Totals Section */}
        <div className="bg-white p-4 rounded-md shadow">
          <div className="grid grid-cols-2 gap-4">
            <p className="text-right font-semibold">Sub Total (₹)</p>
            <p className="text-right">{subtotal.toFixed(2)}</p>

            <p className="text-right font-semibold">Discount (₹)</p>
            <p className="text-right">{totalDiscount.toFixed(2)}</p>

            <p className="text-right font-semibold">Tax (₹)</p>
            <p className="text-right">{totalTax.toFixed(2)}</p>

            <p className="text-right font-bold">Total Amount (₹)</p>
            <p className="text-right font-bold">{totalAmount.toFixed(2)}</p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-6 w-full bg-blue-600 text-white p-4 rounded-md hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default ProposalCreate;
