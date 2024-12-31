import Header from '@/Layouts/Header';
import Nav from '@/Layouts/Nav';
import React from 'react';

export default function JournalEntry({ journal }) {
  return (
    <div className='w-[83.2%] ml-[11.5rem] absolute right-0 overflow-hidden'>
      <Header  />
      <Nav  />
      <h2 className="mb-4 text-xl font-semibold">Manage Journal Entry</h2>
<div className="p-6 mx-auto bg-white rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <div>
          <label className="mr-2 text-gray-600">Entries per page:</label>
          <select className="p-1 border rounded">
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
        </div>
        <input
          type="text"
          placeholder="Search..."
          className="w-1/3 p-2 border rounded"
        />
      </div>

      <table className="w-full overflow-hidden bg-white rounded-lg shadow">
        <thead>
          <tr className="text-gray-700 bg-gray-100">
            <th className="p-2">Journal ID</th>
            <th className="p-2">Date</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Description</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
  {journal.map((entry, index) => {
    const totalAmount = entry.rows_sum_debit || entry.rows_sum_credit || 0;

    return (
      <tr key={index} className="border-b">
        <td className="p-2">{entry.journal_number}</td>
        <td className="p-2">{new Date(entry.transaction_date).toLocaleDateString()}</td>
        <td className="p-2">₹{totalAmount}</td>
        <td className="p-2">{entry.description}</td>
        <td className="flex p-2">
          <button className="p-2 mr-2 text-white bg-green-500 rounded">Edit</button>
          <button className="p-2 text-white bg-red-500 rounded">Delete</button>
        </td>
      </tr>
    );
  })}
</tbody>

      </table>

      <div className="mt-4 text-sm text-gray-500">
        Showing 1 to {journal.length} of {journal.length} entries
      </div>
      </div>
    </div>
  );
}
