import Header from '@/Layouts/Header';
import Nav from '@/Layouts/Nav';
import { Link } from '@inertiajs/react';
import React from 'react';

const PurchaseTable = ({user,notif,user_type}) => {
    const purchases = [
        { id: '#PUR00001', siteLocation: 'Amit kundu', supplierName: 'Thomas Bean', category: 'Category 1', purchaseDate: 'Jul 22, 2024', status: 'Paid' },
        { id: '#PUR00002', siteLocation: 'Amit kundu', supplierName: 'Thomas Bean', category: 'Category 2', purchaseDate: 'Jul 23, 2024', status: 'Sent' },
        { id: '#PUR00003', siteLocation: 'Amit kundu', supplierName: 'Thomas Bean', category: 'Category 3', purchaseDate: 'Jul 25, 2024', status: 'Paid' },
        { id: '#PUR00004', siteLocation: 'Amit kundu', supplierName: 'Thomas Bean', category: 'Category 4', purchaseDate: 'Jul 25, 2024', status: 'Draft' },
        { id: '#PUR00005', siteLocation: 'Amit kundu', supplierName: 'Thomas Bean', category: 'Category 5', purchaseDate: 'Jul 25, 2024', status: 'Paid' },
        { id: '#PUR00006', siteLocation: 'Amit kundu', supplierName: 'Thomas Bean', category: 'Category 6', purchaseDate: 'Jul 25, 2024', status: 'Sent' },
    ];

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Paid':
                return 'bg-teal-600 text-white';
            case 'Sent':
                return 'bg-yellow-400 text-white';
            case 'Draft':
                return 'bg-gray-400 text-white';
            default:
                return 'bg-gray-200 text-gray-800';
        }
    };

    return (
        <div className='w-[83.2%] ml-[11.5rem] absolute right-0 overflow-hidden'>
      <Header user={user} notif={notif} />
      <Nav user_type={user_type} />
        <div className="container p-4 mx-auto">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">Manage Purchase</h2>
                <Link href='/billing/create' className="px-4 py-2 text-white bg-teal-600 rounded hover:bg-teal-700">+ Add Purchase</Link>
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-sm font-medium text-left text-gray-600 uppercase">Purchase</th>
                            {/* <th className="px-6 py-3 text-sm font-medium text-left text-gray-600 uppercase">Site Location</th> */}
                            <th className="px-6 py-3 text-sm font-medium text-left text-gray-600 uppercase">Supplier Name</th>
                            <th className="px-6 py-3 text-sm font-medium text-left text-gray-600 uppercase">Category</th>
                            <th className="px-6 py-3 text-sm font-medium text-left text-gray-600 uppercase">Purchase Date</th>
                            <th className="px-6 py-3 text-sm font-medium text-left text-gray-600 uppercase">Status</th>
                            <th className="px-6 py-3 text-sm font-medium text-left text-gray-600 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-gray-600">
                        {purchases.map((purchase, index) => (
                            <tr key={index} className="border-b hover:bg-gray-100">
                                <td className="px-6 py-4">
                                    <span className="text-teal-600">{purchase.id}</span>
                                </td>
                                {/* <td className="px-6 py-4">{purchase.siteLocation}</td> */}
                                <td className="px-6 py-4">{purchase.supplierName}</td>
                                <td className="px-6 py-4">{purchase.category}</td>
                                <td className="px-6 py-4">{purchase.purchaseDate}</td>
                                <td className="px-6 py-4">
                                    <span className={`py-1 px-3 rounded-full text-xs ${getStatusBadge(purchase.status)}`}>
                                        {purchase.status}
                                    </span>
                                </td>
                                <td className="flex px-6 py-4 space-x-2">
                                    <button className="px-3 py-1 text-white bg-teal-500 rounded hover:bg-teal-600">
                                        <i className="fas fa-eye"></i>
                                    </button>
                                    <button className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600">
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600">
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        </div>
    );
};

export default PurchaseTable;
