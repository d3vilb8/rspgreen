// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const DeductionPage = ({ employeeId }) => {
//   const [deductions, setDeductions] = useState([]);
//   const [isEditing, setIsEditing] = useState(false);
//   const [currentDeduction, setCurrentDeduction] = useState({ id: null, title: '', amount: '' });
//   const [newDeduction, setNewDeduction] = useState({ title: '', amount: '' });
//   const [loading, setLoading] = useState(false);

//   // Fetch deductions for the employee
//   useEffect(() => {
//     const fetchDeductions = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get(`deductions/${employeeId}`);
//         setDeductions(response.data);
//       } catch (error) {
//         console.error('Error fetching deductions:', error);
//       }
//       setLoading(false);
//     };
//     fetchDeductions();
//   }, [employeeId]);

//   // Handle adding a new deduction
//   const handleAddDeduction = async () => {
//     try {
//       const response = await axios.post('/deductions', {
//         employee_id: employeeId,
//         title: newDeduction.title,
//         amount: newDeduction.amount,
//       });
//       setDeductions([...deductions, response.data]);
//       setNewDeduction({ title: '', amount: '' });
//     } catch (error) {
//       console.error('Error adding deduction:', error);
//     }
//   };

//   // Handle editing an existing deduction
//   const handleEditDeduction = (deduction) => {
//     setCurrentDeduction(deduction);
//     setIsEditing(true);
//   };

//   const handleUpdateDeduction = async () => {
//     try {
//       const response = await axios.put(`/deductions/${currentDeduction.id}`, {
//         title: currentDeduction.title,
//         amount: currentDeduction.amount,
//       });
//       setDeductions(deductions.map(ded => (ded.id === currentDeduction.id ? response.data : ded)));
//       setIsEditing(false);
//       setCurrentDeduction({ id: null, title: '', amount: '' });
//     } catch (error) {
//       console.error('Error updating deduction:', error);
//     }
//   };

//   // Handle deleting a deduction
//   const handleDeleteDeduction = async (id) => {
//     if (window.confirm('Are you sure you want to delete this deduction?')) {
//       try {
//         await axios.delete(`deductions/${id}`);
//         setDeductions(deductions.filter(ded => ded.id !== id));
//       } catch (error) {
//         console.error('Error deleting deduction:', error);
//       }
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto border p-6 rounded shadow-lg">
//       <h1 className="text-xl font-bold mb-4">Employee Deductions</h1>

//       <div className="mb-4">
//         <input
//           type="text"
//           className="border p-2 rounded mr-2"
//           value={newDeduction.title}
//           onChange={(e) => setNewDeduction({ ...newDeduction, title: e.target.value })}
//           placeholder="Deduction Title"
//         />
//         <input
//           type="number"
//           className="border p-2 rounded mr-2"
//           value={newDeduction.amount}
//           onChange={(e) => setNewDeduction({ ...newDeduction, amount: e.target.value })}
//           placeholder="Amount"
//         />
//         <button onClick={handleAddDeduction} className="bg-blue-500 text-white p-2 rounded">
//           Add Deduction
//         </button>
//       </div>

//       {loading ? (
//         <p>Loading deductions...</p>
//       ) : (
//         <table className="w-full border-collapse border text-left">
//           <thead>
//             <tr className="bg-gray-200">
//               <th className="border p-2">Title</th>
//               <th className="border p-2">Amount</th>
//               <th className="border p-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {deductions.map((deduction) => (
//               <tr key={deduction.id}>
//                 <td className="border p-2">{deduction.title}</td>
//                 <td className="border p-2">{deduction.amount}</td>
//                 <td className="border p-2">
//                   <button
//                     onClick={() => handleEditDeduction(deduction)}
//                     className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => handleDeleteDeduction(deduction.id)}
//                     className="bg-red-500 text-white px-2 py-1 rounded"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       {isEditing && (
//         <div className="mt-6">
//           <h2 className="text-xl font-bold mb-4">Edit Deduction</h2>
//           <input
//             type="text"
//             className="border p-2 rounded mr-2"
//             value={currentDeduction.title}
//             onChange={(e) => setCurrentDeduction({ ...currentDeduction, title: e.target.value })}
//             placeholder="Deduction Title"
//           />
//           <input
//             type="number"
//             className="border p-2 rounded mr-2"
//             value={currentDeduction.amount}
//             onChange={(e) => setCurrentDeduction({ ...currentDeduction, amount: e.target.value })}
//             placeholder="Amount"
//           />
//           <button
//             onClick={handleUpdateDeduction}
//             className="bg-green-500 text-white px-4 py-2 rounded mr-2"
//           >
//             Update Deduction
//           </button>
//           <button
//             onClick={() => setIsEditing(false)}
//             className="bg-gray-500 text-white px-4 py-2 rounded"
//           >
//             Cancel
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DeductionPage;
