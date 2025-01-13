import React, { useState, useEffect } from "react";
import { useForm } from "@inertiajs/inertia-react"; // Import useForm

const OfficeHours = () => {
  const [officeHours, setOfficeHours] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  // Set up useForm hook for managing form state
  const { data, setData, post, put, errors, reset } = useForm({
    start_time: "",
    end_time: "",
  });

  useEffect(() => {
    // Fetch office hours from your API (assuming it's a local API)
    fetch("/office-hours")
      .then((response) => response.json())
      .then((data) => setOfficeHours(data))
      .catch((error) => console.error("Error fetching office hours:", error));
  }, []);

  const handleAdd = () => {
    setModalData(null);
    reset(); // Reset form data
    setIsModalOpen(true);
  };

  const handleEdit = (hour) => {
    setModalData(hour);
    setData("start_time", hour.start_time);
    setData("end_time", hour.end_time);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this office hour?")) {
      fetch(`/office-hours/${id}`, {
        method: "DELETE",
      })
        .then(() => setOfficeHours(officeHours.filter((hour) => hour.id !== id)))
        .catch((error) => console.error("Error deleting office hour:", error));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (modalData) {
      // Update existing office hour
      fetch(`/office-hours/${modalData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((updatedHour) => {
          setOfficeHours(
            officeHours.map((hour) =>
              hour.id === updatedHour.id ? updatedHour : hour
            )
          );
        })
        .catch((error) => console.error("Error updating office hour:", error));
    } else {
      // Add new office hour
      fetch("/office-hours", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((newHour) => {
          setOfficeHours([...officeHours, newHour]);
        })
        .catch((error) => console.error("Error adding office hour:", error));
    }

    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Office Hours</h2>
        <button
          onClick={handleAdd}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Add Office Hour
        </button>
        {officeHours.length === 0 ? (
          <p className="text-center text-gray-500">No office hours available</p>
        ) : (
          <ul>
            {officeHours.map((hour) => (
              <li
                key={hour.id}
                className="flex justify-between items-center py-2 border-b border-gray-300"
              >
                <span className="text-lg">{`${hour.start_time} - ${hour.end_time}`}</span>
                <div>
                  <button
                    onClick={() => handleEdit(hour)}
                    className="text-yellow-500 mx-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(hour.id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {modalData ? "Edit" : "Add"} Office Hour
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="start_time"
                  className="block text-sm font-medium text-gray-700"
                >
                  Start Time
                </label>
                <input
                  type="time"
                  id="start_time"
                  value={data.start_time}
                  onChange={(e) => setData("start_time", e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  required
                />
                {errors.start_time && (
                  <div className="text-sm text-red-500">{errors.start_time}</div>
                )}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="end_time"
                  className="block text-sm font-medium text-gray-700"
                >
                  End Time
                </label>
                <input
                  type="time"
                  id="end_time"
                  value={data.end_time}
                  onChange={(e) => setData("end_time", e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  required
                />
                {errors.end_time && (
                  <div className="text-sm text-red-500">{errors.end_time}</div>
                )}
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="mr-2 px-4 py-2 bg-gray-500 text-white rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  {modalData ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficeHours;
