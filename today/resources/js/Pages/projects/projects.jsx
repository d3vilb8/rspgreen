import React, { useState, useEffect } from "react";
import Header from "@/Layouts/Header";
import Nav from "@/Layouts/Nav";
import axios from "axios";
import { Link } from "@inertiajs/react";
import { RiDeleteBinLine } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import { Notyf } from "notyf";
import "notyf/notyf.min.css"; // Import Notyf styles
const notyf = new Notyf();
const Projects = ({ user, projects, user_type, notif }) => {
    const [query, setQuery] = useState("");
    const [filteredProjects, setFilteredProjects] = useState(projects);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Adjust items per page as needed

    useEffect(() => {
        // Filter projects based on the search query
        const filtered = projects.filter(
            (proj) =>
                proj.title.toLowerCase().includes(query.toLowerCase()) ||
                proj.start_date.toLowerCase().includes(query.toLowerCase()) ||
                proj.end_date.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredProjects(filtered);
    }, [query, projects]);

    // Pagination logic
    const indexOfLastProject = currentPage * itemsPerPage;
    const indexOfFirstProject = indexOfLastProject - itemsPerPage;
    const currentProjects = filteredProjects.slice(
        indexOfFirstProject,
        indexOfLastProject
    );

    // Page numbers
    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
    const pageNumbers = Array.from(
        { length: totalPages },
        (_, index) => index + 1
    );

    const handleSearch = (event) => {
        setQuery(event.target.value);
        setCurrentPage(1); // Reset to first page when search query changes
    };

    const handleDelete = (e, id) => {
        e.preventDefault();
        if (confirm("Are you sure you want to delete this project?")) {
            axios
                .get(`/projects-delete/${id}`)
                .then((response) => {
                    // console.log(response);
                    // alert('Project deleted successfully');
                    notyf.success(
                        "Project and related assignments deleted successfully."
                    );
                    // Optionally, you might want to refresh the data here
                    window.location.reload();
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

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
                            placeholder="Search projects..."
                            className="p-2 border rounded-md w-[80%]"
                        />
                    </div>
                    <div className="px-4">
                        <Link
                            href="projects-create"
                            className="flex space-x-2 underline"
                        >
                            <span className="font-bold">
                                Create New Project
                            </span>
                        </Link>
                    </div>
                </div>
                <br />
                <table className="table w-full p-4 border">
                    <thead className="border bg-[#0A1B3F] text-white">
                        <tr>
                            <th className="p-3 text-left border">
                                Project Name
                            </th>
                            <th className="p-3 text-left border">Start Date</th>
                            <th className="p-3 text-left border">End Date</th>
                            <th className="p-3 text-left border">
                                Estimate hours
                            </th>
                            <th className="p-3 text-left border">Priority</th>
                            <th className="p-3 text-left border">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProjects.length > 0 ? (
                            currentProjects.map((proj) => (
                                <tr key={proj.id}>
                                    <td className="p-3 border">{proj.title}</td>
                                    <td className="p-3 border">
                                        {proj.start_date}
                                    </td>
                                    <td className="p-3 border">
                                        {proj.end_date}
                                    </td>
                                    <td className="p-3 border">
                                        {proj.estimate_time}hrs
                                    </td>
                                    <td className="p-3 border">
                                        {proj.priority == 0
                                            ? "Low"
                                            : proj.priority == 1
                                            ? "Medium"
                                            : "High"}
                                    </td>
                                    <td className="border">
                                        <div className="flex justify-center space-x-3">
                                            <Link
                                                className="text-green-800 text-[1.1rem] bg-[#0C7785] p-1 rounded-md"
                                                href={`projects-edit/${proj.id}`}
                                            >
                                                <CiEdit className="text-white" />
                                            </Link>
                                            <button
                                                className="text-white text-[1.1rem] bg-[#FF3A6E] p-1 rounded-md"
                                                onClick={(e) =>
                                                    handleDelete(e, proj.id)
                                                }
                                            >
                                                <RiDeleteBinLine />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="p-3 text-center">
                                    No projects found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div className="flex justify-center mt-4">
                    {pageNumbers.map((number) => (
                        <button
                            key={number}
                            onClick={() => setCurrentPage(number)}
                            className={`px-4 py-2 mx-1 rounded ${
                                currentPage === number
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200"
                            }`}
                        >
                            {number}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Projects;
