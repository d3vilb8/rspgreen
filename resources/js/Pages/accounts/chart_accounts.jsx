import React, { useState,useEffect } from "react";
import { useForm } from "@inertiajs/react";
import Header from "@/Layouts/Header";
import Nav from "@/Layouts/Nav";

const ChartAccounts = ({ accountGroups, category, type }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
const [filteredCategories, setFilteredCategories] = useState([]);
  const { data, setData, post, put, reset, clearErrors, errors } = useForm({
    id: "",
    code: "",
    name: "",
    type_id: "",
    category_id: "",
    status: "Enabled",
  });

  const openModal = (account = null) => {
    clearErrors();
    setEditMode(!!account);
    if (account) {
      setSelectedAccount(account);
      setData({
        id: account.id,
        code: account.code,
        name: account.name,
        type_id: account.type_id,
        category_id: account.category_id,
        status: account.status,
      });
    } else {
      reset();
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    reset();
    setSelectedAccount(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editMode) {
      put(`/chart-accounts/${data.id}`, {
        onSuccess: () => closeModal(),
      });
    } else {
      post("/chart-accounts", {
        onSuccess: () => closeModal(),
      });
    }
  };
useEffect(() => {
    // Ensure type_id is a number for accurate filtering
    const typeId = data.type_id ? parseInt(data.type_id, 10) : null;

    // Filter categories based on selected type_id, including base categories
    const filtered = category.filter(
      (c) => c.type_id === typeId || c.type_id === null
    );
    setFilteredCategories(filtered);
  }, [data.type_id, category]);
  return (
    <div className="w-[83.2%] absolute right-0 overflow-hidden">
      <Header />
      <Nav />
      <div className="min-h-screen p-6 bg-gray-50">
        <h1 className="mb-6 text-2xl font-bold">Manage Chart of Accounts</h1>
     <div className="flex justify-end">
         <button
          onClick={() => openModal()}
          className="px-4 py-2 text-white bg-green-600 rounded-md shadow hover:bg-green-700"
        >
          Add New Account
        </button>
     </div>
        {/* Render Account Groups */}
        {accountGroups.map((group) => (
          <div key={group.title} className="mb-8">
            <h3 className="mb-4 text-xl font-semibold">{group.title}</h3>
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow table-auto">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left">Code</th>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Type</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {group.accounts.map((account) => (
                    <tr key={account.id} className="border-b">
                      <td className="px-4 py-2">{account.code}</td>
                      <td className="px-4 py-2">{account.name}</td>
                      <td className="px-4 py-2">{account.type}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-3 py-1 text-sm rounded-full ${
                            account.status === "Enabled"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {account.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={() => openModal(account)}
                          className="mr-4 text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(account.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {/* Add New Account Button */}


        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative p-6 bg-white rounded-md shadow-lg w-96">
              <h2 className="mb-4 text-xl font-bold">
                {editMode ? "Edit Account" : "Add New Account"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Code
                  </label>
                  <input
                    type="text"
                    value={data.code}
                    onChange={(e) => setData("code", e.target.value)}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500"
                  />
                  {errors.code && (
                    <span className="text-sm text-red-600">{errors.code}</span>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500"
                  />
                  {errors.name && (
                    <span className="text-sm text-red-600">{errors.name}</span>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Type
                  </label>
                  <select
                    value={data.type_id}
                    onChange={(e) => setData("type_id", e.target.value)}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500"
                  >
                    <option value="">Select account type</option>
                    {type.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                  {errors.type_id && (
                    <span className="text-sm text-red-600">{errors.type_id}</span>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    value={data.category_id}
                    onChange={(e) => setData("category_id", e.target.value)}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500"
                  >
                    <option value="">Select category</option>
                    {filteredCategories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
                  </select>
                  {errors.category_id && (
                    <span className="text-sm text-red-600">{errors.category_id}</span>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    value={data.status}
                    onChange={(e) => setData("status", e.target.value)}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500"
                  >
                    <option value="Enabled">Enabled</option>
                    <option value="Disabled">Disabled</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-700 bg-gray-300 rounded-md shadow hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-blue-600 rounded-md shadow hover:bg-blue-700"
                  >
                    {editMode ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartAccounts;
