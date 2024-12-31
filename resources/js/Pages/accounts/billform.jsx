import Header from '@/Layouts/Header';
import Nav from '@/Layouts/Nav';
import React, { useState,useEffect } from 'react';
import { useForm } from '@inertiajs/react';

const BillForm = ({ user, notif, user_type, supplier, product }) => {
 const { data, setData, post, reset } = useForm({
    supplier_id: '',
    category: '',
    bill_date: '',
    due_date: '',
    bill_number: '',
    order_number: '',
    items: [{  product_id: '', quantity: '', price: '', discount: '', tax: '' }],
  });

  // Handle adding new item rows
  const addItem = () => {
    setData('items', [
      ...data.items,
      { id: data.items.length + 1, product_id: '', quantity: '', price: '', discount: '', tax: '' },
    ]);
  };

  // Handle changes in main form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData(name, value);
  };

  // Handle changes in item rows
  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...data.items];
    updatedItems[index][name] = value;
    setData('items', updatedItems);
  };
   const [totals, setTotals] = useState({
        subTotal: 0,
        totalDiscount: 0,
        totalTax: 0,
        totalAmount: 0,
    });
 const handleSubmit = (e) => {
    e.preventDefault();
    post('/billing', {
        ...data, // This spreads all other form data
        billingforms: data.items, // Ensure items are correctly sent as billingforms
        // consol.log(data.items)
    });
};
   const calculateTotals = () => {
        let subTotal = 0;
        let totalDiscount = 0;
        let totalTax = 0;

        data.items.forEach(item => {
            const quantity = parseFloat(item.quantity) || 0;
            const price = parseFloat(item.price) || 0;
            const discount = parseFloat(item.discount) || 0;
            const tax = parseFloat(item.tax) || 0;

            const itemTotal = quantity * price;
            const discountAmount = (itemTotal * discount) / 100;
            const taxableAmount = itemTotal - discountAmount;
            const taxAmount = (taxableAmount * tax) / 100;

            subTotal += itemTotal;
            totalDiscount += discountAmount;
            totalTax += taxAmount;
        });

        const totalAmount = subTotal - totalDiscount + totalTax;

        setTotals({ subTotal, totalDiscount, totalTax, totalAmount });
    };

    // Recalculate totals when items change
    useEffect(() => {
        calculateTotals();
    }, [data.items]);
  return (
    <div className='w-[83.2%] ml-[11.5rem] absolute right-0 overflow-hidden'>
      <Header user={user} notif={notif} />
      <Nav user_type={user_type} />
      <form onSubmit={handleSubmit} className="flex px-3 space-x-3">
        <div className="max-w-4xl p-8 mx-auto bg-white rounded-lg shadow-md">
          <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2">
            {/* Vendor and Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Vendor</label>
              <select name="supplier_id" value={data.supplier_id} onChange={handleInputChange} className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <option>Select Vendor</option>
                {supplier.map((sup) => (
                  <option key={sup.id} value={sup.id}>{sup.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select name="category" value={data.category} onChange={handleInputChange} className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <option>Select Category</option>
                {/* Add actual categories */}
              </select>
            </div>

            {/* Dates */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Bill Date</label>
              <input type="date" name="bill_date" value={data.bill_date} onChange={handleInputChange} className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Due Date</label>
              <input type="date" name="due_date" value={data.due_date} onChange={handleInputChange} className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>

            {/* Bill and Order Numbers */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Bill Number</label>
              <input type="text" name="bill_number" value={data.bill_number} onChange={handleInputChange} className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="#BILL00003" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Order Number</label>
              <input type="text" name="order_number" value={data.order_number} onChange={handleInputChange} className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
          </div>

          <h3 className="mb-4 text-lg font-semibold">Product & Services</h3>
          <div className="mb-4 border-t border-b border-gray-200">
            <div className='flex justify-end'>
              <button type="button" onClick={addItem} className="flex items-center justify-center w-[20%] py-2 mt-4 space-x-2 text-white bg-teal-600 rounded-md hover:bg-teal-700">
                + Add Item
              </button>
            </div>
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-gray-700 bg-gray-50">
                <tr>
                  <th className="p-4">Items</th>
                  <th className="p-4">Quantity</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Discount</th>
                  <th className="p-4">Tax (%)</th>
                  <th className="p-4">Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item, index) => (
                  <tr key={index}>
                    <td className="p-4">
                      <select name="product_id" value={item.product_id} onChange={(e) => handleItemChange(index, e)} className="block w-full px-2 py-1 border border-gray-300 rounded-md">
                        <option>Select Item</option>
                        {product.map((pro) => (
                          <option key={pro.id} value={pro.id}>{pro.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4">
                      <input type="text" name="quantity" value={item.quantity} onChange={(e) => handleItemChange(index, e)} className="block w-full px-2 py-1 border border-gray-300 rounded-md" placeholder="Qty" />
                    </td>
                    <td className="p-4">
                      <input type="text" name="price" value={item.price} onChange={(e) => handleItemChange(index, e)} className="block w-full px-2 py-1 border border-gray-300 rounded-md" placeholder="Price" />
                    </td>
                    <td className="p-4">
                      <input type="text" name="discount" value={item.discount} onChange={(e) => handleItemChange(index, e)} className="block w-full px-2 py-1 border border-gray-300 rounded-md" placeholder="Discount" />
                    </td>
                    <td className="p-4">
                      <input type="text" name="tax" value={item.tax} onChange={(e) => handleItemChange(index, e)} className="block w-full px-2 py-1 border border-gray-300 rounded-md" placeholder="Tax" />
                    </td>
                    <td className="p-4 text-right">0.00</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        <div className='flex justify-end'>
              <div className="mt-6">
                        <div>Subtotal: ₹{totals.subTotal.toFixed(2)}</div>
                        <div>Discount: ₹{totals.totalDiscount.toFixed(2)}</div>
                        <div>Tax: ₹{totals.totalTax.toFixed(2)}</div>
                        <div className="font-bold">Total Amount: ₹{totals.totalAmount.toFixed(2)}</div>
                    </div>
        </div>
          <div className="mt-6">
            <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
              Save Bill
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BillForm;
