import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import Header from '@/Layouts/Header';
import Nav from '@/Layouts/Nav';
// import AdminLayout from '@/Layouts/AdminLayout';

function IncomeEntryForm({ initialData = {},customers }) {
  const { data, setData, post, put, errors, reset } = useForm({
    customer_id: initialData.customer_id || '',
    status: initialData.status || '',
    date: initialData.date || new Date().toISOString().split('T')[0],
    main_label: initialData.main_label || '',
    income_entries: initialData.income_entries || [{ amount: '', label: '' }],
  });

  // Set the form data on initial load if editing
useEffect(() => {
  console.log('initialData:', initialData);
  if (initialData && Object.keys(initialData).length > 0) {
    setData({
      customer_id: initialData.customer_id || '',
      status: initialData.status || '',
      date: initialData.date || new Date().toISOString().split('T')[0],
      main_label: initialData.main_label || '',
      income_entries: initialData.income_entries || [{ amount: '', label: '' }],
    });
  }
}, [initialData]);

  const handleAddField = () => {
    setData('income_entries', [...data.income_entries, { amount: '', label: '' }]);
  };

  const handleRemoveField = (index) => {
    const entries = [...data.income_entries];
    entries.splice(index, 1);
    setData('income_entries', entries);
  };

  const handleEntryChange = (index, e) => {
    const { name, value } = e.target;
    const entries = [...data.income_entries];
    entries[index][name] = value;
    setData('income_entries', entries);
  };

  const handleFormDataChange = (e) => {
    setData(e.target.name, e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedData = { ...data, income_entries: JSON.stringify(data.income_entries) };

    if (initialData.id) {
        // Update existing record
        put(`/income/${initialData.id}`, {
            data: formattedData,
            onSuccess: () => {
                alert('Income entry updated successfully!');
                reset();
            },
            onError: () => {
                alert('Failed to update income entry.');
            },
        });
    } else {
        // Create new record
        post('/income', {
            data: formattedData,
            onSuccess: () => {
                alert('Income entry created successfully!');
                reset();
            },
            onError: () => {
                alert('Failed to create income entry.');
            },
        });
    }
};


  return (
   <div className='w-[83.2%] absolute right-0 overflow-hidden'>
         <Header/>
            <Nav/>
    <div className="p-6 mx-auto bg-white rounded-md shadow-md ">
      <h2 className="mb-4 text-lg font-semibold text-gray-700">
        {initialData.id ? 'Edit Income Entry' : 'Create Income Entry'}
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Customer Name */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Customer Name <span className="text-red-500">*</span>
          </label>
          <select
            name="customer_id"
            value={data.customer_id}
            onChange={handleFormDataChange}
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">--Select Customer--</option>
            {
                customers.map(cust=>(
<option value={cust.id}>{cust.name}</option>
                ))
            }

          </select>
          {errors.customer_id && <span className="text-sm text-red-500">{errors.customer_id}</span>}
        </div>

        {/* Status */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            name="status"
            value={data.status}
            onChange={handleFormDataChange}
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">--Select Status--</option>
            <option value="0">Paid</option>
            <option value="1">Unpaid</option>
          </select>
          {errors.status && <span className="text-sm text-red-500">{errors.status}</span>}
        </div>

        {/* Date */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="date"
            value={data.date}
            onChange={handleFormDataChange}
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.date && <span className="text-sm text-red-500">{errors.date}</span>}
        </div>

        {/* Main Label */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Main Label <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="main_label"
            value={data.main_label}
            onChange={handleFormDataChange}
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.main_label && <span className="text-sm text-red-500">{errors.main_label}</span>}
        </div>

        {/* Income Entries */}
        <div className="mb-4">
          <h3 className="mb-2 text-sm font-semibold text-gray-700">Income Entries</h3>
          {data.income_entries.map((entry, index) => (
            <div key={index} className="flex items-center mb-2 space-x-2">
              <input
                type="number"
                name="amount"
                placeholder="Income Amount"
                value={entry.amount}
                onChange={(e) => handleEntryChange(index, e)}
                className="flex-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <input
                type="text"
                name="label"
                placeholder="Income Entry Label"
                value={entry.label}
                onChange={(e) => handleEntryChange(index, e)}
                className="flex-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => handleRemoveField(index)}
                className="px-3 py-2 text-sm text-white bg-red-500 rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddField}
            className="px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Add More Field
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-[10rem] py-2 text-sm font-semibold text-white bg-green-500 rounded-md hover:bg-green-600"
        >
          {initialData.id ? 'Update Income Entry' : 'Create Income Entry'}
        </button>
      </form>
    </div>
    </div>
  );
}

export default IncomeEntryForm;
