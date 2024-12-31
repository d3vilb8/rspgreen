import React, { useState, useEffect } from 'react';
import Header from '@/Layouts/Header';
import Nav from '@/Layouts/Nav';

const Product = ({ user, notif, user_type, holidays }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [currentItem, setCurrentItem] = useState(null);
  const [csrfToken, setCsrfToken] = useState('');

  // Fetch CSRF Token (ensure it's available)
  useEffect(() => {
    const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    setCsrfToken(token);
  }, []);

  // Extract unique locations dynamically from the holidays data
  const uniqueLocations = Array.from(new Set(holidays.map(item => item.location)));

  const handleOpenModal = (item = null) => {
    if (item !== null) {
      setIsEditMode(true);
      setCurrentItem(item);
    } else {
      setIsEditMode(false);
      setCurrentItem(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setCurrentItem(null);
  };

  const handleDelete = async (id) => {
    const confirmation = window.confirm("Are you sure you want to delete this holiday?");
    if (confirmation) {
      try {
        const response = await fetch(`/holidays-location/${id}`, {
          method: 'DELETE',
          headers: {
            'X-CSRF-TOKEN': csrfToken,
          },
        });
        if (response.ok) {
          alert('Holiday deleted successfully!');
          window.location.reload(); // Refresh the page to reflect changes
        } else {
          alert('Failed to delete holiday.');
        }
      } catch (error) {
        console.error('Error deleting holiday:', error);
        alert('Failed to delete holiday.');
      }
    }
  };

  // API call for creating a holiday (POST request)
  const createHoliday = async (formData) => {
    try {
      const response = await fetch('/holidays-location', {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': csrfToken,
        },
        body: formData,
      });

      if (response.ok) {
        alert('Holiday added successfully!');
        window.location.reload(); // Refresh the page to reflect changes
      } else {
        alert('Failed to add holiday.');
      }
    } catch (error) {
      console.error('Error adding holiday:', error);
      alert('Failed to add holiday.');
    }
  };

  // API call for updating a holiday (PUT request)
  const updateHoliday = async (id, formData) => {
    try {
      const response = await fetch(`/holidays-location/${id}`, {
        method: 'PUT',
        headers: {
          'X-CSRF-TOKEN': csrfToken,
        },
        body: formData,
      });

      if (response.ok) {
        alert('Holiday updated successfully!');
        window.location.reload(); // Refresh the page to reflect changes
      } else {
        alert('Failed to update holiday.');
      }
    } catch (error) {
      console.error('Error updating holiday:', error);
      alert('Failed to update holiday.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // Basic Validation
    if (!formData.get('name') || !formData.get('start_date') || !formData.get('end_date') || !formData.get('location')) {
      alert('Please fill in all fields.');
      return;
    }

    if (isEditMode && currentItem) {
      // Update the holiday if in edit mode
      updateHoliday(currentItem.id, formData);
    } else {
      // Create a new holiday
      createHoliday(formData);
    }
  };

  const filteredData = holidays.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = location === '' || item.location === location;
    return matchesSearch && matchesLocation;
  });

  return (
    <div className="w-[83.2%] ml-[11.5rem] absolute right-0">
      <Header user={user} notif={notif} />
      <Nav user_type={user_type} />
      <div className="flex flex-col px-9">
        {/* Search and Filter Section */}
        <div className="flex justify-between items-center mt-6">
          <div className="flex gap-4 items-center">
            <input
              type="text"
              placeholder="Search..."
              className="border border-gray-300 rounded-md px-4 py-2 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="border border-gray-300 rounded-md px-4 py-2 w-48"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="">Select Location</option>
              {uniqueLocations.map((loc, index) => (
                <option key={index} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
          <button
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
            onClick={() => handleOpenModal()}
          >
            Create Holiday
          </button>
        </div>

        {/* Table Section */}
        <div className="mt-6">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left border-b">Holiday Name</th>
                <th className="px-4 py-2 text-left border-b">Start Date</th>
                <th className="px-4 py-2 text-left border-b">End Date</th>
                <th className="px-4 py-2 text-left border-b">Location</th>
                <th className="px-4 py-2 text-left border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id} className="transition duration-200 hover:bg-gray-100">
                    <td className="px-4 py-2 border-b">{item.name}</td>
                    <td className="px-4 py-2 border-b">{item.start_date}</td>
                    <td className="px-4 py-2 border-b">{item.end_date}</td>
                    <td className="px-4 py-2 border-b">{item.location}</td>
                    <td className="px-4 py-2 border-b">
                      <button
                        className="bg-yellow-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-yellow-600"
                        onClick={() => handleOpenModal(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal Section */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={handleCloseModal}
              >
                &times;
              </button>
              <h2 className="text-lg font-bold mb-4">
                {isEditMode ? 'Edit Holiday' : 'Create Holiday'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block mb-2 font-medium">Holiday Name</label>
                  <input
                    type="text"
                    name="name"
                    className="border border-gray-300 rounded-md px-4 py-2 w-full"
                    defaultValue={currentItem ? currentItem.name : ''}
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 font-medium">Start Date</label>
                  <input
                    type="date"
                    name="start_date"
                    className="border border-gray-300 rounded-md px-4 py-2 w-full"
                    defaultValue={currentItem ? currentItem.start_date : ''}
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 font-medium">End Date</label>
                  <input
                    type="date"
                    name="end_date"
                    className="border border-gray-300 rounded-md px-4 py-2 w-full"
                    defaultValue={currentItem ? currentItem.end_date : ''}
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 font-medium">Location</label>
                  <input
                    type="text"
                    name="location"
                    className="border border-gray-300 rounded-md px-4 py-2 w-full"
                    defaultValue={currentItem ? currentItem.location : ''}
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  >
                    {isEditMode ? 'Save Changes' : 'Add Holiday'}
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

export default Product;
