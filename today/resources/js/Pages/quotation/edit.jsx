import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
// import AdminLayout from '@/Layouts/AdminLayout';
import axios from 'axios';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import Header from '@/Layouts/Header';
import Nav from '@/Layouts/Nav';

const notyf = new Notyf();

const Edit = ({ customer_dets,qt,qt_acc,qt_his }) => {
    const today1 = new Date().toISOString().split('T')[0];
    const { data, setData, put, processing, errors } = useForm({
        quotation_no: qt.quotation_no,
        quotation_date: qt.quotation_date,
        quotation_amount: qt.quotation_amount,
        customer_name: qt.customer_name,
        customer_details: qt.customer_id,
        report:qt.report,
        ref_no:qt.ref_no,
        mobile_no: '',
        email: qt.email,
        status: qt.status,
        Billing_address: qt.address || '',
        message: qt.message,
        product_details: qt_his || [{ product_id: '', p_qty: '', price: '', amount: '' }],
        tax_details: qt_acc || [{ tax_id: '', tax_value: '', tax_name: '' }],
    });

    const [products, setProducts] = React.useState(qt_his || []);
    const [taxOptions, setTaxOptions] = React.useState(qt_acc || []);

    const toolbarOptions = [
        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        ['link', 'image'],
        ['clean'],
    ];

    const modules = {
        toolbar: toolbarOptions,
    };

    const handleMessageChange = (content) => {
        setData('message', content);
    };

    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/getproduct');
                setProducts(response.data);
            } catch (error) {
                console.error("Failed to fetch products", error);
            }
        };

        const fetchTaxOptions = async () => {
            try {
                const response = await axios.get('/gettaxoptions');
                setTaxOptions(response.data);
            } catch (error) {
                console.error("Failed to fetch tax options", error);
            }
        };

        fetchProducts();
        fetchTaxOptions();
    }, []);

    const addProductDetail = () => {
        setData('product_details', [...data.product_details, { product_id: '', p_qty: '', price: '', amount: '' }]);
    };

    const addTaxDetail = () => {
        setData('tax_details', [...data.tax_details, { tax_id: '', tax_value: '' }]);
    };

    const handleProductChange = (index, product_id) => {
        const selectedProduct = products.find(product => product.product_id === parseInt(product_id));
        const newProductDetails = [...data.product_details];
        newProductDetails[index] = {
            ...newProductDetails[index],
            product_id,
            price: selectedProduct ? selectedProduct.price : 0,
            amount: selectedProduct ? selectedProduct.price * newProductDetails[index].p_qty : 0,
        };
        setData('product_details', newProductDetails);
    };

    const handleQuantityChange = (index, quantity) => {
        const newProductDetails = [...data.product_details];
        newProductDetails[index].p_qty = quantity;
        newProductDetails[index].amount = newProductDetails[index].price * quantity;
        setData('product_details', newProductDetails);
    };

    const handleTaxChange = (index, tax_id) => {
        const selectedTax = taxOptions.find(tax => tax.id === parseInt(tax_id));
        const newTaxDetails = [...data.tax_details];
        newTaxDetails[index] = {
            ...newTaxDetails[index],
            tax_id,
            tax_name: selectedTax.name,
            tax_value: selectedTax ? selectedTax.percent : 0, // Updated to use `tax`
        };
        setData('tax_details', newTaxDetails);
    };
    const today = new Date().toISOString().split('T')[0];

    const removeProductDetail = (index) => {
        const newProductDetails = data.product_details.filter((_, i) => i !== index);
        setData('product_details', newProductDetails);
    };

    const removeTaxDetail = (index) => {
        const newTaxDetails = data.tax_details.filter((_, i) => i !== index);
        setData('tax_details', newTaxDetails);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/Quotation/${qt.id}`, {
            onSuccess: () => notyf.success('Quotation updated successfully!'),
            onError: (err) => {
                notyf.error('Failed to updated Quotation. Please check your inputs.')
            },
        });
    };

    useEffect(() => {
        if (data.customer_details) {
            axios.get(`/Get-Customer/${data.customer_details}`)
                .then((response) => {
                    const customerData = response.data;

                    setData((prevData)=>({
                        ...prevData,
                        customer_name: `${customerData.name}`,
                        Billing_address: customerData.address,
                        mobile_no: customerData.phone,
                        email: customerData.email,
                    }));
                })
                .catch((error) => console.error("Failed to fetch service partner details", error));
        }
    }, [data.customer_details]);
    return (
        <div>
        <Header/>
        <Nav/>

            <div className="w-[83.2%] ml-[11.5rem] absolute right-0 overflow-hidden px-3">
                <h2 className="mb-6 text-2xl font-bold text-gray-800">Edit Quotation</h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Quotation No</label>
                        <input
                            type="text"
                            name="quotation_no"
                            readOnly={true}
                            value={data.quotation_no}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter Client Id"
                        />
                        {errors.quotation_no && <p className="mt-1 text-xs text-red-500">{errors.quotation_no}</p>}
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Quotation Date</label>
                        <input
                            type="date"
                            name="quotation_date"
                            value={data.quotation_date}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter Client Id"
                        />
                        {errors.quotation_date && <p className="mt-1 text-xs text-red-500">{errors.quotation_date}</p>}
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Quotation Amount</label>
                        <input
                            type="text"
                            name="quotation_amount"
                            value={data.quotation_amount}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter Quotation Amount"
                        />
                        {errors.quotation_amount &&
                            <p className="mt-1 text-xs text-red-500">{errors.quotation_amount}</p>}
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Report</label>
                        <input
                            type="text"
                            name="report"
                            value={data.report}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter Report"
                        />
                        {errors.report && <p className="mt-1 text-xs text-red-500">{errors.report}</p>}
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Ref No.</label>
                        <input
                            type="text"
                            name="ref_no"
                            value={data.ref_no}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter Ref No."
                        />
                        {errors.ref_no && <p className="mt-1 text-xs text-red-500">{errors.ref_no}</p>}
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Service Partner</label>
                        <select
                            name="customer_details"
                            value={data.customer_details}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">---Select----</option>
                            {customer_dets.map((customer_det) => (
                                <option key={customer_det.id} value={customer_det.id}>
                                    {customer_det.name}
                                </option>
                            ))}
                        </select>
                        {errors.customer_details &&
                            <p className="mt-1 text-xs text-red-500">{errors.customer_details}</p>}
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Mobile No</label>
                        <input
                            type="text"
                            name="mobile_no"
                            value={data.mobile_no}
                            readOnly={true}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter Mobile No"
                        />
                        {errors.mobile_no && <p className="mt-1 text-xs text-red-500">{errors.mobile_no}</p>}
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            readOnly={true}
                            value={data.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter Mobile No"
                        />
                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Status</label>
                        <select
                            name='status'
                            value={data.status}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg"
                        >
                            <option value="">Select Status</option>
                            <option value="1">Open</option>
                            <option value="0">Close</option>
                            <option value="2">Pending</option>
                        </select>
                        {errors.status &&
                            <p className="mt-1 text-xs text-red-500">{errors.status}</p>}
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Billing Address</label>
                        <textarea
                            name="Billing_address"
                            value={data.Billing_address}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter Mobile No"
                        />
                        {errors.Billing_address &&
                            <p className="mt-1 text-xs text-red-500">{errors.Billing_address}</p>}
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <label className="block mb-1 text-sm font-medium text-gray-700">Message</label>
                        <textarea name="message" value={data.message}
                                  onChange={(e) => setData('message', e.target.value)} id="" rows="6"
                                  className="resize-none border border-gray-300 rounded-lg form-textarea w-full"></textarea>
                        {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
                        >
                            {processing ? 'Processing...' : 'Update Quotation'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Edit;
