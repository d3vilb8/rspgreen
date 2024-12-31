import React from 'react';
import Header from '@/Layouts/Header';
import Nav from '@/Layouts/Nav';

const Leaveshow = ({ leave }) => {
    return (
        <div className="w-full md:w-[85.2%] ml-0 md:ml-[11.5rem] right-0 absolute bg-gray-50 min-h-screen">
            <Header />
            <Nav />
            <div className="px-6 py-8">
                {/* Leave Information */}
                <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-700">Leave Information</h2>
                    <ul className="space-y-4 text-gray-600">
                        <li><strong className="font-medium">Name:</strong> {leave.name}</li>
                        <li><strong className="font-medium">Start Date:</strong> {leave.sdate}</li>
                        <li><strong className="font-medium">End Date:</strong> {leave.edate}</li>
                        <li><strong className="font-medium">Reason:</strong> {leave.reason}</li>
                        <li><strong className="font-medium">Remark:</strong> {leave.remark}</li>
                        <li><strong className="font-medium">Status:</strong> {
                            leave.status === 0 ? (
                                <span className="text-green-500">Approved</span>
                            ) : leave.status === 1 ? (
                                <span className="text-red-500">Rejected</span>
                            ) : (
                                <span className="text-yellow-500">Pending</span>
                            )}
                        </li>
                        <li><strong className="font-medium">Leave Type:</strong> {leave.type_name}</li>
                        <li><strong className="font-medium">Leave Option:</strong> {
                            leave.is_unpaid === 1 ? (
                                <span className="text-red-600">Unpaid</span>
                            ) : (
                                <span className="text-green-600">Paid</span>
                            )}
                        </li>
                        {/* Admin Rejection Reason */}
                        {leave.status === 1 && leave.admin_reject && (
                            <li>
                                <strong>Admin Rejection Reason:</strong> <strong className="font-medium text-red-500">{leave.admin_reject}</strong>
                            </li>
                        )}
                    </ul>
                </div>

                {/* Leave Documents */}
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-700">Leave Documents</h2>
                    <div className="space-y-4">
                        {/* Render each document if 'documents' is an array */}
                        {Array.isArray(leave.documents) && leave.documents.length > 0 ? (
                            leave.documents.map((doc, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <a
                                        href={`/storage/${doc}`}
                                        target="_blank"
                                        className="text-blue-600 hover:underline"
                                    >
                                        View Document {index + 1}
                                    </a>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No documents available.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Leaveshow;
