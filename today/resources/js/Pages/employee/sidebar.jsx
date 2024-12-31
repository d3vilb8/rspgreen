
import { Link } from "@inertiajs/react";
import React,{useEffect,useState} from "react"
const Sidebar = () => {
  return (
    <div className="w-64 p-4 bg-gray-600">
      <ul className="space-y-2">
        <li className="font-medium text-white p-2 border-b border-gray-400"> <Link href="/branches">Branch</Link>  </li>
        <li className="text-gray-300 hover:text-white p-2 border-b border-gray-400"> <Link href="/departments">Department</Link></li>
        <li className="text-gray-300 hover:text-white p-2 border-b border-gray-400"> <Link href="/designations">Designation</Link></li>
        <li className="text-gray-300 hover:text-white p-2 border-b border-gray-400"> <Link href="/leave-type">Leave Type</Link></li>
        {/* <li className="text-gray-300 hover:text-white p-2 border-b border-gray-400"> <Link href="/documents">Document Type</Link></li> */}
        {/* <li className="text-gray-300 hover:text-white p-2 border-b border-gray-400"><Link href="/payslips">Payslip Type</Link> </li> */}
        {/* <li className="text-gray-300 hover:text-white">Allowance Option</li> */}
        {/* <li className="text-gray-300 hover:text-white">Loan Option</li> */}
      </ul>
    </div>
  );
};

export default Sidebar
