import React, { useState, useEffect } from "react";
import { Link, useForm, usePage } from "@inertiajs/react";
import Header from "@/Layouts/Header";
import Nav from "@/Layouts/Nav";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import axios from "axios";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import Multiselect from "multiselect-react-dropdown";

const notyf = new Notyf();

const Task = ({
    user,
    tasks,
    user_type,
    notif,
    taskcategory,
    employee,
    projects,
    
}) => {
    const [query, setQuery] = useState("");
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProjectName, setSelectedProjectName] = useState("");
    const [projectQuery, setProjectQuery] = useState("");
    const { data, setData, post, errors } = useForm({
        task_name: "",
        estimate_hours: "",
        sdate: "",
        edate: "",
        employee_id: [], // Initialize as an array
        status: "",
        rate:'',
        project_id: projects.length > 0 ? projects[0].id : "",
    });
    const { props } = usePage()
    useEffect(() => {
        const allTasks = tasks.flatMap((project) => project.tasks);
        const filtered = allTasks.filter(
            (task) =>
                (query === "" ||
                    task.task_name
                        .toLowerCase()
                        .includes(query.toLowerCase()) ||
                    task.users.some((user) =>
                        user.name.toLowerCase().includes(query.toLowerCase())
                    )) &&
                (projectQuery === "" ||
                    tasks.some(
                        (project) =>
                            project.title
                                .toLowerCase()
                                .includes(projectQuery.toLowerCase()) &&
                            project.tasks.includes(task)
                    ))
        );
        setFilteredTasks(filtered);
    }, [query, projectQuery, tasks]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(`Selected ${name}: ${value}`); // Debugging log
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };


    const handleDelete = (e, id) => {
        e.preventDefault();
        if (confirm("Are you sure you want to delete this task?")) {
            axios
                .get(`/task-delete/${id}`)
                .then((response) => {
                    notyf.success(
                        "Task and related task assign deleted successfully."
                    );
                    window.location.reload();
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const handleCopyClick = (projectName) => {
        const selectedProject = projects.find(
            (project) => project.title === projectName
        );

        if (selectedProject) {
            setData((prevData) => ({
                ...prevData,
                project_id: selectedProject.id, // Update project_id dynamically based on the selected project
            }));
            setSelectedProjectName(projectName);
            setIsModalOpen(true);
        } else {
            notyf.error("Project not found.");
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    // Pagination logic
    const indexOfLastTask = currentPage * itemsPerPage;
    const indexOfFirstTask = indexOfLastTask - itemsPerPage;
    const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
console.log("fghj",currentTasks)
    const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
    const pageNumbers = Array.from(
        { length: totalPages },
        (_, index) => index + 1
    );

    const handleSearch = (event) => {
        setQuery(event.target.value);
        setCurrentPage(1);
    };

    // Multiselect handler
    const handleMultipleSelectChange = (selectedList, selectedItem) => {
        setData(
            "employee_id",
            selectedList.map((item) => item.id)
        );
    };
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        // Debugging logs
        console.log("Project ID:", data.project_id);
        console.log("Projects Array:", projects);

        // Find the selected project by ID
        const selectedProjectId = parseInt(data.project_id);
        const selectedProject = projects.find(
            (project) => project.id === selectedProjectId
        );

        // Check if the selected project is found
        if (!selectedProject) {
            notyf.error("Selected project not found.");
            console.error("Selected project not found.");
            return;
        }

        // Parse the estimate hours for the new task
        const estimateHours = parseFloat(data.estimate_hours);

        try {
            // Fetch total task hours under the selected project
            const response = await axios.get(
                `/project-tasks/${selectedProjectId}/total-hours`
            );
            const totalExistingHours = parseFloat(response.data.total_hours); // Total hours of existing tasks

            // Calculate the total hours (existing + new task estimate)
            const totalHours = totalExistingHours + estimateHours;
            const projectEstimateTime = parseFloat(
                selectedProject.estimate_time
            ); // Project's allowed time

            // Validate the total hours against the project estimate time limit
            if (totalHours > projectEstimateTime) {
                notyf.error(
                    `Total hours exceed the allowed limit for the project. Maximum allowed: ${projectEstimateTime} hours.`
                );
                return; // Prevent form submission if validation fails
            }

            // Proceed to post data to the server to create a task
            post("/task-store", {
                data, // Include the data in the post request
                onSuccess: () => {
                    notyf.success(
                        "Task created successfully with notification sent."
                    );
                },
                onError: (errors) => {
                    // Handle errors returned from the server
                    if (typeof errors === "object" && errors !== null) {
                        Object.entries(errors).forEach(([key, value]) => {
                            if (Array.isArray(value)) {
                                value.forEach((message) =>
                                    notyf.error(message)
                                );
                            } else {
                                notyf.error(value);
                            }
                        });
                    } else {
                        notyf.error("An unexpected error occurred.");
                    }
                    console.error("Server-side validation errors:", errors);
                },
            });
        } catch (error) {
            console.error("Error fetching total task hours:", error);
            notyf.error(
                "Failed to validate project hours. Please try again later."
            );
        }
    };

    const normalizedTaskName = data.task_name
        .replace(/\u00A0/g, " ") // Replace non-breaking spaces with regular spaces
        .trim();
    return (
        <div className="w-[85.2%] absolute right-0 overflow-hidden">
            <Header user={user} notif={notif} />
            <Nav user_type={user_type} />
            <div className="px-8 table-section">
                <div className="flex justify-between">
                    <div className="w-[40%] flex space-x-2">
                        <input
                            type="text"
                            value={projectQuery}
                            onChange={(e) => setProjectQuery(e.target.value)}
                            placeholder="Search projects..."
                            className="w-full p-2 border rounded-md"
                        />

                        <input
                            type="text"
                            value={query}
                            onChange={handleSearch}
                            placeholder="Search tasks..."
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                    <div className="flex">
                        {
                            props.permission.includes("create_task") &&
                            <div className="grid p-2 mt-2 text-black underline rounded-lg place-items-center">
                                <Link href="task-create">Add New</Link>
                            </div>
                        }
                        {/* <div className='grid p-2 mt-2 text-black underline rounded-lg place-items-center'>
                            <Link href='task-category'>Add Task type</Link>
                        </div> */}
                    </div>
                </div>
                <br />
                <table className="w-full border border-collapse border-gray-200 table-auto">
                    <thead className="bg-[#0A1B3F] text-white">
                        <tr>
                            <th className="px-4 py-2 border border-gray-300">
                                Project Name
                            </th>
                            <th className="px-4 py-2 border border-gray-300">
                                Rate
                            </th>
                            {/* <th className="px-4 py-2 border border-gray-300">Task Name</th> */}
                            <th className="px-4 py-2 border border-gray-300">
                                Start Date
                            </th>
                            <th className="px-4 py-2 border border-gray-300">
                                End Date
                            </th>
                            {
                                props.auth.user.roles[0]?.name === 'admin' &&
                                <th className="px-4 py-2 border border-gray-300">
                                    Assigned Users
                                </th>
                            }
                            <th className="px-4 py-2 border border-gray-300">
                                Priority
                            </th>
                            <th className="px-4 py-2 border border-gray-300">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentTasks.length > 0 ? (
                            currentTasks.map((task, index) => {
                                const projectName =
                                    tasks.find((project) =>
                                        project.tasks.includes(task)
                                    )?.title || "Unknown Project";
                                return (
                                    <tr key={index}>
                                        {/* <td className="px-4 py-2 border border-gray-300 text-[0.9rem]">{projectName}</td> */}
                                        <td className="px-4 py-2 border border-gray-300 text-[0.9rem]">
                                            {task.task_name}
                                        </td>
                                        <td className="px-4 py-2 border border-gray-300 text-[0.9rem]">
                                            {task.rate}
                                        </td>
                                        <td className="px-4 py-2 border border-gray-300 text-[0.9rem]">
                                            {task.sdate}
                                        </td>
                                        <td className="px-4 py-2 border border-gray-300 text-[0.9rem]">
                                            {task.edate}
                                        </td>
                                        {
                                            props.auth.user.roles[0]?.name === 'admin' &&
                                            <td className="px-4 py-2 border border-gray-300">
                                                {task.users.map(
                                                    (user, userIndex) => (
                                                        <span
                                                            className="bg-blue-400 text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded-full"
                                                            key={userIndex}
                                                        >
                                                            {user.name} -{" "}
                                                            {
                                                                user.pivot
                                                                    .employee_hours
                                                            }{" "}
                                                            hours
                                                            {userIndex <
                                                                task.users.length -
                                                                1 && ", "}
                                                        </span>
                                                    )
                                                )}
                                            </td>
                                        }
                                        <td
                                            className={`px-4 py-2 font-semibold border border-gray-300 text-[0.9rem] ${task.priority === 0
                                                ? "text-green-600"
                                                : task.priority === 1
                                                    ? "text-amber-600"
                                                    : "text-red-500"
                                                }`}
                                        >
                                            {task.priority === 0
                                                ? "Low"
                                                : task.priority == 1
                                                    ? "Medium"
                                                    : "High"}
                                        </td>
                                        <td className="border border-gray-300">
                                            <div className="flex px-4 py-2 space-x-2 ">

                                                {
                                                    props.permission.includes('edit_task') &&
                                                    <Link
                                                        href={`/task-edit/${task.id}`}
                                                    >
                                                        <FaEdit className="text-blue-500 cursor-pointer hover:text-blue-700" />
                                                    </Link>
                                                }
                                                {
                                                    props.permission.includes('delete_task') &&
                                                    <RiDeleteBinLine
                                                        className="text-red-500 cursor-pointer hover:text-red-700"
                                                        onClick={(e) =>
                                                            handleDelete(e, task.id)
                                                        }
                                                    />
                                                }
                                                {/* {
                                                    props.permission.includes('edit_task') &&
                                                    <button
                                                        onClick={() =>
                                                            handleCopyClick(projectName)
                                                        }
                                                        className="text-green-500 cursor-pointer hover:text-green-700"
                                                    >
                                                        Copy
                                                    </button>
                                                } */}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="4" className="p-3 text-center">
                                    No tasks found
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
                            className={`px-4 py-2 mx-1 rounded ${currentPage === number
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200"
                                }`}
                        >
                            {number}
                        </button>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <form
                        onSubmit={handleSubmit}
                        className="px-[8rem] items-center justify-center "
                    >
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-xl font-semibold mb-4">
                                Copied Project Name
                            </h2>
                            <input
                                type="text"
                                value={selectedProjectName}
                                readOnly
                                className="w-full p-2 border rounded-md mb-4"
                            />
                            <div>
                                <label htmlFor="task_name">Task Name</label>
                                <select
                                    className="w-full rounded-lg"
                                    name="task_name"
                                    value={data.task_name}
                                    onChange={handleChange}
                                >
                                    <option value="">Select task</option>
                                    {taskcategory.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.tname}
                                        >
                                            {category.tname}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="sdate">Start Date</label>
                                <input
                                    className="w-full rounded-lg"
                                    id="sdate"
                                    name="sdate"
                                    type="date"
                                    value={data.sdate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                {normalizedTaskName !== "NON-BILLABLE" && (
                                    <>
                                        <label htmlFor="estimate_hours">
                                            Estimate Hours
                                        </label>
                                        <input
                                            className="w-full rounded-lg"
                                            id="estimate_hours"
                                            name="estimate_hours"
                                            type="number"
                                            value={data.estimate_hours}
                                            onChange={handleChange}
                                        />
                                    </>
                                )}
                            </div>
                            <div>
                                <label htmlFor="edate">End Date</label>
                                <input
                                    className="w-full rounded-lg"
                                    id="edate"
                                    name="edate"
                                    type="date"
                                    value={data.edate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="employee_id">
                                    Assign Employees
                                </label>
                                <Multiselect
                                    options={employee}
                                    selectedValues={data.employee_id.map((id) =>
                                        employee.find((e) => e.id === id)
                                    )}
                                    onSelect={handleMultipleSelectChange}
                                    onRemove={handleMultipleSelectChange}
                                    displayValue="name"
                                    placeholder="Select Employees"
                                />
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={handleModalClose}
                                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
                                >
                                    Close
                                </button>
                                <button
                                    type="submit"
                                    className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
                                >
                                    Create
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Task;
