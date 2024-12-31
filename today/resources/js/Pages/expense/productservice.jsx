import React, { useState } from "react";

const ProductServices = () => {
    const [items, setItems] = useState([{ id: 1, qty: '', price: '', discount: '', tax: '' }]);

    const addItem = () => {
        setItems([...items, { id: items.length + 1, qty: '', price: '', discount: '', tax: '' }]);
    };

    return (
        <div className="bg-white p-6 mt-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Product & Services</h2>

            <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="p-2 border border-gray-300">Items</th>
                        <th className="p-2 border border-gray-300">Quantity</th>
                        <th className="p-2 border border-gray-300">Price</th>
                        <th className="p-2 border border-gray-300">Discount</th>
                        <th className="p-2 border border-gray-300">Tax (%)</th>
                        <th className="p-2 border border-gray-300">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <tr key={item.id}>
                            <td className="p-2 border border-gray-300">
                                <select className="w-full p-1 border rounded">
                                    <option>Select Item</option>
                                    {/* Populate items here */}
                                </select>
                            </td>
                            <td className="p-2 border border-gray-300">
                                <input
                                    type="text"
                                    placeholder="Qty"
                                    className="w-full p-1 border rounded"
                                    value={item.qty}
                                    onChange={(e) => {
                                        const newItems = [...items];
                                        newItems[index].qty = e.target.value;
                                        setItems(newItems);
                                    }}
                                />
                            </td>
                            <td className="p-2 border border-gray-300">
                                <input
                                    type="text"
                                    placeholder="Price"
                                    className="w-full p-1 border rounded"
                                    value={item.price}
                                    onChange={(e) => {
                                        const newItems = [...items];
                                        newItems[index].price = e.target.value;
                                        setItems(newItems);
                                    }}
                                />
                            </td>
                            <td className="p-2 border border-gray-300">
                                <input
                                    type="text"
                                    placeholder="Discount"
                                    className="w-full p-1 border rounded"
                                    value={item.discount}
                                    onChange={(e) => {
                                        const newItems = [...items];
                                        newItems[index].discount = e.target.value;
                                        setItems(newItems);
                                    }}
                                />
                            </td>
                            <td className="p-2 border border-gray-300">
                                <input
                                    type="text"
                                    placeholder="Tax (%)"
                                    className="w-full p-1 border rounded"
                                    value={item.tax}
                                    onChange={(e) => {
                                        const newItems = [...items];
                                        newItems[index].tax = e.target.value;
                                        setItems(newItems);
                                    }}
                                />
                            </td>
                            <td className="p-2 border border-gray-300">₹{/* Calculate Amount Here */}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-4 flex justify-end">
                <button
                    onClick={addItem}
                    className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">
                    + Add Item
                </button>
            </div>
        </div>
    );
};

export default ProductServices;
