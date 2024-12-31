import React, { useState, useEffect } from 'react';
import Header from '@/Layouts/Header';
import Nav from '@/Layouts/Nav';
import { Link, useForm } from '@inertiajs/react';
import { CiEdit } from 'react-icons/ci';
import { RiDeleteBinLine } from 'react-icons/ri';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css'; // Import Notyf styles
const notyf = new Notyf();
function Index({ user, user_type, notif,contracts }) {
  const dummyContracts = [
    { id: 1, contractorName: 'Tenetur laboriosam', contractType: 'Sylvester Mcdaniel', contractValue: '₹13.00', startDate: 'Aug 29, 2022', endDate: 'Jun 25, 2023' },
    { id: 2, contractorName: 'Test', contractType: 'Sylvester Mcdaniel', contractValue: '₹56.00', startDate: 'Jul 22, 2024', endDate: 'Jul 22, 2024' },
  ];

  const [query, setQuery] = useState('');
  const [filteredContracts, setFilteredContracts] = useState(contracts);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const { delete:destroy } = useForm();
  useEffect(() => {
    const filtered =contracts.filter(
      (contract) =>
        contract.contractor_name.toLowerCase().includes(query.toLowerCase()) 
        // contract.contractType.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredContracts(filtered);
  }, [query]);

  const indexOfLastContract = currentPage * itemsPerPage;
  const indexOfFirstContract = indexOfLastContract - itemsPerPage;
  const currentContracts = filteredContracts.slice(indexOfFirstContract, indexOfLastContract);

  const totalPages = Math.ceil(filteredContracts.length / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handleSearch = (event) => {
    setQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleDelete = (e,id) => {
    e.preventDefault();
    if(confirm('are u sure u want to delete?')){
      destroy(`/contract/${id}`, {
          onSuccess: () => {
              console.log('Form submitted successfully');
              notyf.success('Contracts Deleted successfully');
              window.location.reload()
          },
          onError: (err) => {
              console.log('Form submission error', err);
          },
      });
   }
   else{
    console.log(" error fetching data")
}

  }

  return (
    <div className="w-[85.2%] absolute right-0 overflow-hidden">
      <Header user={user} notif={notif} />
      <Nav user_type={user_type} />
      <div className="table-section border-[#0A1B3F] py-3 px-8 rounded-b-md">
        <div className="flex justify-between">
          <div className="w-[40%]">
            <input
              type="text"
              value={query}
              onChange={handleSearch} 
              placeholder="Search contracts..."
              className="p-2 border rounded-md w-[80%]"
            />
          </div>
          <div className="px-4">
                        <Link href="/contract/create" className="flex space-x-2 underline">
                            <span className="font-bold">Create New Contract</span>
                        </Link>
                    </div>
        </div>
        <br />
        <table className="table w-full p-4 border">
          <thead className="border bg-[#0A1B3F] text-white">
            <tr>
              <th className="p-3 text-left border">#</th>
              <th className="p-3 text-left border">Contractor Name</th>
              <th className="p-3 text-left border">Contract Type</th>
              <th className="p-3 text-left border">Contract Value</th>
              <th className="p-3 text-left border">Start Date</th>
              <th className="p-3 text-left border">End Date</th>
              <th className="p-3 text-left border">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentContracts.length > 0 ? (
              currentContracts.map((contract, index) => (
                <tr key={contract.id}>
                  <td className="p-3 border">{index + 1 + indexOfFirstContract}</td>
                  <td className="p-3 border">{contract.contractor_name}</td>
                  <td className="p-3 border">{contract.contractor_type}</td>
                  <td className="p-3 border">{contract.contract_value}</td>
                  <td className="p-3 border">{contract.start_date}</td>
                  <td className="p-3 border">{contract.end_date}</td>
                  <td className="border">
                    <div className="flex justify-center space-x-3">
                      <Link
                        className="text-green-800 text-[1.1rem] bg-[#0C7785] p-1 rounded-md"
                        href={`/contract/${contract.id}/edit`} 
                      >
                        <CiEdit className="text-white" />
                      </Link>
                      <button
                        className="text-white text-[1.1rem] bg-[#FF3A6E] p-1 rounded-md"
                        onClick={(e) => handleDelete(e, contract.id)} 
                      >
                        <RiDeleteBinLine />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-3 text-center">No contracts found</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex justify-center mt-4">
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={`px-4 py-2 mx-1 rounded ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              {number}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Index;
