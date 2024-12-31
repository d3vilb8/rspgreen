import React from 'react';
import Header from '@/Layouts/Header';
import Nav from '@/Layouts/Nav';

const EmployeeDetails = ({ employee }) => {
    return (
        <div className='w-full md:w-[85.2%] ml-0 md:ml-[11.5rem] absolute right-0 bg-gray-50 min-h-screen'>
            <Header />
            <Nav />
            <div className="px-6 py-8">
                <h1 className="text-3xl font-bold mb-6 text-gray-800 ml-6">Employee Details</h1>

                {/* Grid Layout for Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">Personal Information</h2>
                        <ul className="space-y-2 text-gray-600">
                            <li><strong>Name:</strong> {employee?.name}</li>
                            <li><strong>Email:</strong> {employee?.email}</li>
                            <li><strong>Phone:</strong> {employee?.phone}</li>
                            <li><strong>Address:</strong> {employee?.address}</li>
                            <li><strong>Date of Birth:</strong> {employee?.dob}</li>
                            <li><strong>Gender:</strong> {employee?.gender}</li>
                        </ul>
                    </div>

                    {/* Job Details */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">Job Details</h2>
                        <ul className="space-y-2 text-gray-600">
                            <li><strong>Department:</strong> {employee?.d_name}</li>
                            <li><strong>Designation:</strong> {employee?.desig_name}</li>
                            <li><strong>Branch:</strong> {employee?.b_name}</li>
                            <li><strong>Joining Date:</strong> {employee?.joinning_date}</li>
                            <li><strong>Company DOJ:</strong> {employee?.company_doj}</li>
                            <li><strong>Status:</strong> {employee?.is_active ? "Active" : "Inactive"}</li>
                        </ul>
                    </div>

                    {/* Bank Details */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">Bank Details</h2>
                        <ul className="space-y-2 text-gray-600">
                            <li><strong>Account Number:</strong> {employee?.account_number}</li>
                            <li><strong>Bank Name:</strong> {employee?.bank_name}</li>
                            <li><strong>Bank Code:</strong> {employee?.bank_identifier_code}</li>
                            <li><strong>Branch Location:</strong> {employee?.branch_location}</li>
                            <li><strong>IFSC Code:</strong> {employee?.ifsc_code}</li>
                        </ul>
                    </div>

                    {/* Salary Details */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">Salary Details</h2>
                        <ul className="space-y-2 text-gray-600">
                            <li><strong>Basic Salary:</strong> {employee?.basic_salary}</li>
                            <li><strong>Net Salary:</strong> {employee?.net_salary}</li>
                            <li><strong>Salary Type:</strong> {employee?.salary_type}</li>
                            <li><strong>APC No:</strong> {employee?.apc_no}</li>
                            <li><strong>P-Tax No:</strong> {employee?.ptax_no}</li>
                            <li><strong>PF No:</strong> {employee?.pf_no}</li>
                            <li><strong>ESI No:</strong> {employee?.esi_no}</li>
                            <li><strong>PAN No:</strong> {employee?.pan_no}</li>
                            <li><strong>Aadhar No:</strong> {employee?.aadhar_no}</li>
                        </ul>
                    </div>
                </div>

                {/* Documents Section */}
                <div className="bg-white shadow rounded-lg p-6 mt-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Employee Documents</h2>
                    <div className="flex flex-wrap gap-4">
                        <a
                            href={`/storage/${employee?.cv}`}
                            target="_blank"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-200"
                            rel="noopener noreferrer"
                        >
                            View CV
                        </a>
                        <a
                            href={`/storage/${employee?.declaration}`}
                            target="_blank"
                            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition duration-200"
                            rel="noopener noreferrer"
                        >
                            View Declaration
                        </a>
                        <a
                            href={`/storage/${employee?.can_cheque}`}
                            target="_blank"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition duration-200"
                            rel="noopener noreferrer"
                        >
                            View Cheque
                        </a>
                        <a
                            href={`/storage/${employee?.employee}`}
                            target="_blank"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition duration-200"
                            rel="noopener noreferrer"
                        >
                            View Employee
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDetails;
