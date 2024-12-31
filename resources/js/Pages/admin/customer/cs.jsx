import React, { useState } from "react";
import { useForm } from "@inertiajs/inertia-react"; 
import { Inertia } from "@inertiajs/inertia"; 

const UploadTable = ({ customerInfo, id }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);

  const { data, setData, post, processing, errors } = useForm({
    name: "",
    file: null,
  });

  const handleFileChange = (e) => {
    setData("file", e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("file", data.file);

    post(`/upload-documents/${id}`, formData, {
      onFinish: () => {
        setModalOpen(false);
      },
    });
  };

  const handleDelete = (documentId) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      Inertia.delete(`/delete-document/${documentId}`, {
        onSuccess: () => {
          alert("Document deleted successfully");
        },
        onError: () => {
          alert("Failed to delete document");
        },
      });
    }
  };

  const filteredTableData = customerInfo.filter((row) =>
    row.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center">
      <div className="w-full max-w-5xl p-6 mt-8 bg-white shadow-md rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <button
              className="bg-gray-600 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-700 transition"
              onClick={() => window.history.back()}
            >
              Back
            </button>
          </div>
          <button
            className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
            onClick={() => setModalOpen(true)}
          >
            Upload
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by document name..."
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200 shadow-md rounded-md">
            <thead className="bg-blue-100">
              <tr>
                <th className="border border-gray-200 px-4 py-3 text-left text-gray-700">Name</th>
                <th className="border border-gray-200 px-4 py-3 text-left text-gray-700">Uploaded Document</th>
                <th className="border border-gray-200 px-4 py-3 text-left text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTableData.length > 0 ? (
                filteredTableData.map((row, index) => (
                  <tr
                    key={index}
                    className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}
                  >
                    <td className="border border-gray-200 px-4 py-3">{row.name}</td>
                    <td className="border border-gray-200 px-4 py-3">
                      <a
                        href={`/storage/${row.uploaded_file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600"
                      >
                        View Document
                      </a>
                    </td>
                    <td className="border border-gray-200 px-4 py-3">
                      <button
                        onClick={() => handleDelete(row.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center text-gray-500 py-4">
                    No results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for file upload */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Upload New Document</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">File Name</label>
                <input
                  type="text"
                  name="name"
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                />
                {errors.name && <span className="text-red-600">{errors.name}</span>}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">Choose File</label>
                <input
                  type="file"
                  name="file"
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none"
                  onChange={handleFileChange}
                />
                {errors.file && <span className="text-red-600">{errors.file}</span>}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded shadow hover:bg-gray-600 transition mr-2"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition ${
                    processing ? "opacity-50" : ""
                  }`}
                  disabled={processing}
                >
                  {processing ? "Uploading..." : "Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadTable;
