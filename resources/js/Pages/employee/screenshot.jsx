import Header from "@/Layouts/Header";
import Nav from "@/Layouts/Nav";
import React, { useRef, useEffect, useState } from "react";
import Choices from "choices.js";
import "choices.js/public/assets/styles/choices.min.css";
import { FaDownload } from "react-icons/fa";
import { Inertia } from "@inertiajs/inertia";
import { usePage, Link } from "@inertiajs/react";

function Screenshot({
    user,
    user_type,
    notif,
    emp,
    imgs,
    empi,
    sd,
    ed,
    groupedImgsWithUniqueDownload,
}) {
    const employeeSelectRef = useRef(null);
    const imgArray = Object.entries(imgs);
    const [employee, setEmployee] = useState(empi);
    const [startDate, setStartDate] = useState(sd);
    const [endDate, setEndDate] = useState(ed);

    useEffect(() => {
        const employeeChoicesInstance = new Choices(employeeSelectRef.current, {
            removeItemButton: true,
            searchEnabled: true,
        });

        return () => {
            employeeChoicesInstance.destroy();
        };
    }, []);

    const handleDownload = (images) => {
        Inertia.post(
            "/bulk/download",
            { images },
            {
                onSuccess: () => {
                    console.log("Download successful");
                    window.location.reload();
                },
                onError: (error) => {
                    console.error("Error during file generation:", error);
                },
            }
        );
    };

    const handleDelete = (images) => {
       
        if (images && images.length > 0) {
            const imagesToDelete = images.map(image => image.id);

            console.log('Images to delete:', imagesToDelete);

            if (confirm("Are you sure you want to delete these items?")) {
                Inertia.post(
                    "/bulk/delete", // Ensure this endpoint exists in your backend
                    { images: imagesToDelete },
                    {
                        onSuccess: () => {
                            console.log("Deleted successfully");
                            // Reload the page to reflect changes
                           
                            Inertia.get('/screenshot/employee', { employee_id: employee, start_date: startDate, end_date: endDate });
                            window.location.reload();
                        },
                        onError: (error) => {
                            console.error("Error during deletion:", error);
                            alert('An error occurred while deleting the images.');
                        },
                    }
                );
            }
        } else {
            console.error('No images found for deletion.');
        }
    };

    const handleFilter = (e) => {
        e.preventDefault();
        Inertia.get('/screenshot/employee', { employee_id: employee, start_date: startDate, end_date: endDate });
    };

    return (
        <div className="w-[83%] h-full absolute right-0 overflow-hidden">
            <Header user={user} notif={notif} />
            <Nav user_type={user_type} />
            <form onSubmit={handleFilter} className="w-full flex">
                <div className="w-1/4 p-2 flex flex-col space-y-1">
                    <label htmlFor="employee" className="text-sm font-semibold">
                        Employee
                    </label>
                    <select
                        ref={employeeSelectRef}
                        id="employee"
                        value={employee}
                        onChange={(e) => setEmployee(e.target.value)}
                        className="rounded text-sm"
                    >
                        <option value="">All</option>
                        {emp &&
                            emp.map((e) => (
                                <option key={e.id} value={e.id}>
                                    {e.name}
                                </option>
                            ))}
                    </select>
                </div>
                <div className="w-1/4 p-2 flex flex-col space-y-1">
                    <label htmlFor="start_date" className="text-sm font-semibold">
                        Start Date
                    </label>
                    <input
                        type="date"
                        id="start_date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="rounded text-sm"
                    />
                </div>
                <div className="w-1/4 p-2 flex flex-col space-y-1">
                    <label htmlFor="end_date" className="text-sm font-semibold">
                        End Date
                    </label>
                    <input
                        type="date"
                        id="end_date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="rounded text-sm"
                    />
                </div>
                <div className="w-1/4 p-2 pb-5 flex items-end gap-2 justify-start">
                    <Link
                        className="rounded bg-red-500 text-white px-4 py-2 text-sm"
                        href="/screenshot/employee"
                    >
                        Reset
                    </Link>
                    <button
                        type="submit"
                        className="rounded bg-blue-500 text-white px-4 py-2 text-sm"
                    >
                        Filter
                    </button>
                </div>
            </form>
            <div className="px-2">
                <table className="w-full text-left">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 bg-zinc-700 text-white rounded-l">
                                #
                            </th>
                            <th className="py-2 px-4 bg-zinc-700 text-white">
                                Timestamp
                            </th>
                            <th className="py-2 px-4 bg-zinc-700 text-white rounded-r">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {groupedImgsWithUniqueDownload.length > 0
                            ? groupedImgsWithUniqueDownload.map((group, i) => (
                                  <tr key={i}>
                                      <td className="px-4 py-2 text-sm">{i + 1}</td>
                                      <td className="px-4 py-2 text-sm">
                                          {new Date(group.date).toDateString()}
                                      </td>
                                      <td className="px-4 py-2 text-sm">
                                          <div className="flex gap-2">
                                              <button
                                                  onClick={() =>
                                                      handleDownload(group.images)
                                                  }
                                                  className="flex items-center gap-1 bg-blue-500 text-white px-5 py-1 rounded-full"
                                              >
                                                  <FaDownload />
                                                  <span>Download</span>
                                              </button>
                                              {/* Show delete button only if is_download is 1 */}
                                              {group.is_download === 1 && (
                                                  <button
                                                      onClick={() =>
                                                          handleDelete(group.images)
                                                      }
                                                      className="flex items-center gap-1 bg-red-500 text-white px-5 py-1 rounded-full"
                                                  >
                                                      <span>Delete</span>
                                                  </button>
                                              )}
                                          </div>
                                      </td>
                                  </tr>
                              ))
                            : imgArray.map((im, i) => (
                                  <tr key={i}>
                                      <td className="px-4 py-2 text-sm">{i + 1}</td>
                                      <td className="px-4 py-2 text-sm">
                                          {new Date(im[0]).toDateString()}
                                      </td>
                                      <td className="px-4 py-2 text-sm">
                                          <div className="flex gap-2">
                                              <button
                                                  onClick={() => handleDownload(im[1])}
                                                  className="flex items-center gap-1 bg-blue-500 text-white px-5 py-1 rounded-full"
                                              >
                                                  <FaDownload />
                                                  <span>Download</span>
                                              </button>
                                              {/* Show delete button only if is_download is 1 */}
                                              {im[1].some((image) => image.is_download === 1) && (
                                                  <button
                                                      onClick={() => handleDelete(im[1])}
                                                      className="flex items-center gap-1 bg-red-500 text-white px-5 py-1 rounded-full"
                                                  >
                                                      <span>Delete</span>
                                                  </button>
                                              )}
                                          </div>
                                      </td>
                                  </tr>
                              ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Screenshot;
