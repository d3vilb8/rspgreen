import { useForm } from '@inertiajs/react';
import React, { useState } from 'react'
import { useEffect } from 'react';
import { FaTrash } from 'react-icons/fa'
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import Multiselect from 'multiselect-react-dropdown';
import Header from '@/Layouts/Header';
import Nav from '@/Layouts/Nav';

const notyf = new Notyf();
function edit({ customers, products, sale, taxes }) {
    const [rows, setRows] = useState(sale.sales_details);
    console.log(sale.sales_details)
    const [totalTax, setTotalTax] = useState(0);
    const [invoiceType, setInvoiceType] = useState(sale.invoice_type);

    const handleAddRow = () => {
        setRows([...rows, { product: '', quantity: 0, price: 0, amount: 0, amountWithTax: 0, selectedTaxes: [] }]);
    };

    const handleDeleteRow = (index) => {
        const updatedRows = rows.filter((_, i) => i !== index);
        setRows(updatedRows);
    };

    const handleChange = (index, field, value) => {
        const updatedRows = rows.map((row, i) => {
            if (i === index) {
                const updatedRow = { ...row, [field]: field === 'product' ? value : Number(value) };

                // Calculate base amount based on quantity and price
                if (field === 'quantity' || field === 'price') {
                    updatedRow.amount = updatedRow.quantity * updatedRow.price;
                }

                return updatedRow;
            }
            return row;
        });

        setRows(updatedRows);
        calculateTotalTax(updatedRows); // Recalculate tax with updated rows
    };

    const handleTaxSelect = (index, selectedList) => {
        const updatedRows = rows.map((row, i) => {
            if (i === index) {
                return { ...row, selectedTaxes: selectedList }; // Update the selected taxes for the specific row
            }
            return row;
        });

        setRows(updatedRows); // Update rows
        calculateTotalTax(updatedRows); // Recalculate total tax based on updated rows
    };

    // Calculate total tax based on selected taxes for each row
    const calculateTotalTax = (rows) => {
        console.log(rows)
        const updatedRows = rows.map(row => {
            // Calculate total tax for this row based on selected taxes
            const totalTaxForRow = row.selectedTaxes.reduce((taxSum, tax) => {
                return taxSum + (row.amount * (tax.percent / 100));
            }, 0);

            row.amountWithTax = row.amount + totalTaxForRow; // Add tax to the base amount
            return row; // Return updated row
        });

        // Calculate the total tax amount for all rows
        const totalTax = updatedRows.reduce((sum, row) => {
            return sum + (row.amountWithTax - row.amount); // Total tax calculated across all rows
        }, 0);

        setTotalTax(totalTax); // Update total tax state
        setRows(updatedRows); // Update rows to reflect amountWithTax
    };

    const { put, data, setData, errors, processing } = useForm({
        bill_no: sale.bill_no,
        status: sale.status,
        date: sale.date,
        customer_id: sale.customer_id,
        mobile_no: sale.mobile_no,
        amc_type: sale.amc_type,
        email: sale.email,
        discount: sale.discount,
        billing_address: sale.billing_address,
        sales_details: sale.sales_details || [],
        invoice_type: sale.invoice_type // New field to store invoice type
    })

    useEffect(() => {
        setData(prevData => ({
            ...prevData,
            sales_details: rows || []    // Ensure rows is an array
        }));
    }, [rows]);

    function handleSubmit(e) {
        e.preventDefault();
        put(route('sales.edit', sale.id), {
            onSuccess: () => {
                // Show success notification on successful submission
                notyf.success('sales updated successfully!');
            },
            onError: (err) => {
                console.log(err)
                // Show error notification if there are errors
                notyf.error('Failed to add sales. Please check your inputs.');
            }
        })
    }
    return (
        <div className='w-[83.2%] ml-[11.5rem] absolute right-0 overflow-hidden'>
            <Header />
            <Nav />
            <div className="px-8 mx-auto bg-white rounded-lg shadow-md">
                <h2 className="mb-6 text-2xl font-bold text-gray-800">Add Invoice</h2>
                <form onSubmit={handleSubmit} className="flex flex-wrap">
                    {/* Invoice Type */}
                    <div className='flex flex-col w-1/2 gap-2 p-2'>
                        <label htmlFor="invoiceType">Invoice Type</label>
                        <select
                            name="invoiceType"
                            value={invoiceType}
                            onChange={(e) => setInvoiceType(e.target.value)}
                            className='w-full rounded form-select'
                        >
                            <option value="">-- Select Invoice Type --</option>
                            <option value="tax">Tax Invoice</option>
                            <option value="pi">PI Invoice</option>
                            <option value="cash">Cash Invoice</option>
                        </select>
                        {errors.invoice_type && <p className="mt-1 text-xs text-red-500">{errors.invoice_type}</p>}
                    </div>

                    {/* Fields for Customer Details and Invoice Information */}
                    <div className='flex flex-col w-1/2 gap-2 p-2'>
                        <label htmlFor=""> Invoice Number.</label>
                        <input disabled onChange={(e) => setData('bill_no', e.target.value)} value={data.bill_no} type="text" className="w-full rounded form-input" placeholder='Enter bill no' />
                        {errors.bill_no && <p className="mt-1 text-xs text-red-500">{errors.bill_no}</p>}
                    </div>
                    <div className='flex flex-col w-1/2 gap-2 p-2'>
                        <label htmlFor="">Status</label>
                        <select name="status" onChange={(e) => setData('status', e.target.value)} value={data.status} className='w-full rounded form-select' id="">
                            <option value="">-- Select Status --</option>
                            <option value="unpaid">Unpaid</option>
                            <option value="full_paid">Full Paid</option>
                            <option value="half_paid">Half Paid</option>
                        </select>
                        {errors.status && <p className="mt-1 text-xs text-red-500">{errors.status}</p>}
                    </div>
                    <div className='flex flex-col w-1/2 gap-2 p-2'>
                        <label htmlFor="">Invoice Date </label>
                        <input type="date" name='date' onChange={(e) => setData('date', e.target.value)} value={data.date} className="w-full rounded form-input" placeholder='Enter bill no' />
                        {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
                    </div>
                    <div className='flex flex-col w-1/2 gap-2 p-2'>
                        <label htmlFor="">Customer Name</label>
                        <select name="" onChange={(e) => setData('customer_id', e.target.value)} value={data.customer_id} className='w-full rounded form-select' id="">
                            <option value="">-- Select Customer --</option>
                            {
                                customers && customers.map((cust, i) => (
                                    <option key={i} value={cust.user_id}>{cust.name}</option>
                                ))
                            }
                        </select>
                        {errors.customer_id && <p className="mt-1 text-xs text-red-500">{errors.customer_id}</p>}
                    </div>
                    <div className='flex flex-col w-1/2 gap-2 p-2'>
                        <label htmlFor="">Mobile No</label>
                        <input type="tel" onChange={(e) => setData('mobile_no', e.target.value)} value={data.mobile_no} className="w-full rounded form-input" placeholder='Enter mobile no' />
                        {errors.mobile_no && <p className="mt-1 text-xs text-red-500">{errors.mobile_no}</p>}
                    </div>
                    {/* <div className='flex flex-col w-1/2 gap-2 p-2'>
                    <label htmlFor="">AMC Type</label>
                    <select name="" onChange={(e) => setData('amc_type', e.target.value)} value={data.amc_type} className='w-full rounded form-select' id="">
                        <option value="no_amc">No AMC</option>
                        <option value="amc">AMC</option>
                    </select>
                    {errors.amc_type && <p className="mt-1 text-xs text-red-500">{errors.amc_type}</p>}
                </div> */}
                    <div className='flex flex-col w-1/2 gap-2 p-2'>
                        <label htmlFor="">Email</label>
                        <input type="email" onChange={(e) => setData('email', e.target.value)} value={data.email} className="w-full rounded form-input" placeholder='Enter email' />
                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                    </div>
                    <div className='flex flex-col w-1/2 gap-2 p-2'>
                        <label htmlFor="">Discount</label>
                        <input type="number" onChange={(e) => setData('discount', e.target.value)} value={data.discount} className="w-full rounded form-input" placeholder='Enter discount' />
                        {errors.discount && <p className="mt-1 text-xs text-red-500">{errors.discount}</p>}
                    </div>
                    <div className='flex flex-col w-full gap-2 p-2'>
                        <label htmlFor="">Billing Address</label>
                        <textarea name="" onChange={(e) => setData('billing_address', e.target.value)} value={data.billing_address} id="" rows={2} className='w-full rounded resize-none form-textarea'></textarea>
                        {errors.billing_address && <p className="mt-1 text-xs text-red-500">{errors.billing_address}</p>}
                    </div>

                    {/* Sales Details Table */}
                    <div className='w-full py-2'>
                        <h1 className='text-xl font-semibold text-gray-600'>Sales Details</h1>
                    </div>

                    <div className='w-full py-2'>
                        <table className='w-full'>
                            <thead>
                                <tr>
                                    <th className='p-2 border border-gray-300'>Service</th>
                                    <th className='p-2 border border-gray-300'>Quantity</th>
                                    <th className='p-2 border border-gray-300'>Price (Af)</th>
                                    <th className='p-2 border border-gray-300'>Tax</th>
                                    <th className='p-2 border border-gray-300'>Amount (Af)</th>
                                    <th className='p-2 border border-gray-300'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, index) => (
                                    <tr key={index}>
                                        <td className='p-2'>
                                            <select
                                                className="w-full rounded form-select"
                                                value={row.product}
                                                onChange={(e) => handleChange(index, 'product', e.target.value)}
                                            >
                                                <option value="">-- Select Service --</option>
                                                {products.map((pr, i) => (
                                                    <option key={i} value={pr.name}>{pr.name}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className='p-2'>
                                            <input
                                                type="number"
                                                className='w-full rounded form-input'
                                                value={row.quantity}
                                                onChange={(e) => handleChange(index, 'quantity', e.target.value)}
                                            />
                                        </td>
                                        <td className='p-2'>
                                            <input
                                                type="number"
                                                className='w-full rounded form-input'
                                                value={row.price}
                                                onChange={(e) => handleChange(index, 'price', e.target.value)}
                                            />
                                        </td>
                                        <td className='p-2'>
                                            <Multiselect
                                                options={taxes.map(tax => ({
                                                    name: `${tax.name} (${tax.percent}%)`,
                                                    percent: tax.percent
                                                }))}
                                                selectedValues={row.selectedTaxes}
                                                onSelect={(selectedList) => handleTaxSelect(index, selectedList)}
                                                onRemove={(selectedList) => handleTaxSelect(index, selectedList)}
                                                displayValue="name"
                                            />
                                        </td>
                                        <td className='p-2'>
                                            <input
                                                type="number"
                                                className='w-full rounded form-input'
                                                value={row.amountWithTax.toFixed(2)}
                                                readOnly
                                            />
                                        </td>
                                        <td className='p-2'>
                                            {index !== 0 && (
                                                <button
                                                    type='button'
                                                    className='flex items-center gap-1 text-sm font-medium text-red-500'
                                                    onClick={() => handleDeleteRow(index)}
                                                >
                                                    <FaTrash size={15} /><span>Delete</span>
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button type='button' className="px-4 py-2 mt-4 text-white bg-blue-500 rounded" onClick={handleAddRow}>
                            Add Row
                        </button>
                    </div>

                    <div className='w-full py-5'>
                        <button className='px-6 py-2 text-sm font-medium text-white rounded bg-rose-600'>Update Sale</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default edit