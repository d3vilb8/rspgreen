import Header from "@/Layouts/Header";
import Nav from "@/Layouts/Nav";
import { Link } from "@inertiajs/react";
import React,{useEffect,useState} from "react"
import { FaAngleRight } from "react-icons/fa6";
const Sidebar = ({children,user,notif,user_type}) => {
  return (
<div className='w-[83.2%] ml-[11.5rem] absolute right-0 overflow-hidden'>
<Header user={user} notif={notif} />
            <Nav user_type={user_type} />
        <div className="flex px-3 space-x-3">


    <div className="w-64 p-4 bg-teal-700 rounded ">
      <ul className="space-y-2">
        <li className="font-medium text-white "> <Link className="flex justify-between" href="/tax"> <span>Tax</span>   <span className="grid place-items-center"><FaAngleRight/></span>  </Link>  </li>
        {/* <li className="font-medium text-white "> <Link className="flex justify-between" href="/account/category"> <span> Account Category</span>   <span className="grid place-items-center"><FaAngleRight/></span>  </Link>  </li>
        <li className="font-medium text-white "> <Link className="flex justify-between" href="/account/category"> <span> Unit</span>   <span className="grid place-items-center"><FaAngleRight/></span>  </Link>  </li>
        <li className="font-medium text-white "> <Link className="flex justify-between" href="/account/accountTypes"> <span> Account Type</span>   <span className="grid place-items-center"><FaAngleRight/></span>  </Link>  </li> */}

        {/* <li className="text-gray-300 hover:text-white">Allowance Option</li> */}
        {/* <li className="text-gray-300 hover:text-white">Loan Option</li> */}
      </ul>
    </div>
    <div className="w-[84rem] px-3">
        {children}
    </div>
    </div>
</div>
  );
};

export default Sidebar
