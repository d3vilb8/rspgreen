import { useForm } from "@inertiajs/react";
import Nav from "@/Layouts/Nav";
import Header from "@/Layouts/Header";
import React, { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { Link } from "@inertiajs/react";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import Multiselect from "multiselect-react-dropdown";
import Choices from "choices.js";
import "choices.js/public/assets/styles/choices.min.css";
import { useEffect } from "react";
import { useRef } from "react";

const notyf = new Notyf();

const EditProject = ({ project, employees, user, user_type, notif, tls }) => {
    const [selectedOptions, setSelectedOptions] = useState(
        project.assignments.map((assign) => assign.employee_id) || []
    );
    const [employeeEstimates, setEmployeeEstimates] = useState(
        project.assignments.reduce((acc, assign) => {
            acc[assign.employee_id] = assign.employee_hours || "";
            return acc;
        }, {})
    );
    const [errors, setErrors] = useState({});

    const { data, setData, post } = useForm({
        task_name: project.task_name || "",
        estimate_hours: project.estimate_hours || "",
        estimate_budget: project.estimate_budget || "",
        sdate: project.sdate || "",
        edate: project.edate || "",
        leader_id:project.team.map((tm)=>tm.user_id) || [],
        employee_id: selectedOptions || [],
        employee_hours: employeeEstimates || {},
        priority: project.priority || 0,
    });

    const MAX_HOURS = 40; // Max allowed hours for validation

    const handleSubmit = (e) => {
        e.preventDefault();
        // Calculate the total employee hours
        const totalEmployeeHours = Object.values(employeeEstimates).reduce(
            (total, hours) => {
                return total + parseFloat(hours || 0); // Ensure hours is a number
            },
            0
        );

        // Check if the total employee hours exceed the task estimate
        if (totalEmployeeHours > parseFloat(data.estimate_hours)) {
            // Trigger error notification using Notyf
            notyf.error(
                `Total employee hours (${totalEmployeeHours} hours) exceed the task estimate of ${data.estimate_hours} hours.`
            );
            return; // Prevent form submission
        }

        // Proceed with form submission if validation passes
        post(`/task-update/${project.id}`, {
            onSuccess: () => {
                notyf.success("Task updated successfully");
            },
        });
    };

    // Handle multiselect value change
    const handleSelect = (selectedList) => {
        const employeeIds = selectedList.map((item) => item.id);
        setSelectedOptions(employeeIds);
        setData("employee_id", employeeIds);
    };

    const handleRemove = (selectedList) => {
        const employeeIds = selectedList.map((item) => item.id);
        setSelectedOptions(employeeIds);
        setData("employee_id", employeeIds);

        // Remove estimate time for unselected employees
        const updatedEstimates = { ...employeeEstimates };
        employeeIds.forEach((id) => {
            if (!selectedOptions.includes(id)) {
                delete updatedEstimates[id];
            }
        });
        setEmployeeEstimates(updatedEstimates);
        setData("employee_hours", updatedEstimates);
    };

    // Handle estimate time change for a specific employee
    const handleEstimateChange = (employeeId, value) => {
        const hours = parseFloat(value);
        const updatedEstimates = { ...employeeEstimates, [employeeId]: value };

        // Check if the hours exceed the max allowed limit
        // if (hours > MAX_HOURS) {
        //     setErrors((prevErrors) => ({
        //         ...prevErrors,
        //         [`employee_hours_${employeeId}`]: `Estimated hours for this employee cannot exceed ${MAX_HOURS} hours.`,
        //     }));
        // } else {
        //     const newErrors = { ...errors };
        //     delete newErrors[`employee_hours_${employeeId}`];
        //     setErrors(newErrors);
        // }

        setEmployeeEstimates(updatedEstimates);
        setData("employee_hours", updatedEstimates);
    };
const projectSelectRef = useRef(null);
    useEffect(() => {
        const projectChoicesInstance = new Choices(projectSelectRef.current, {
            removeItemButton: true,
            searchEnabled: true,
        });

        return () => {
            projectChoicesInstance.destroy();
           
        };
    }, []);
    const handleTeamLeader = (e) => {
        const selectedEmployees = Array.from(
            e.target.selectedOptions,
            (option) => option.value
        );
        setData("leader_id", selectedEmployees);

        // Initialize employee hours when employees are selected
        // setData((prevData) => {
        //     const newEmployeeHours = { ...prevData.employee_hours };
        //     selectedEmployees.forEach((employeeId) => {
        //         if (!newEmployeeHours[employeeId]) {
        //             newEmployeeHours[employeeId] = ""; // Add default value
        //         }
        //     });
        //     return { ...prevData, employee_hours: newEmployeeHours };
        // });
    };

    return (
        <div className="w-[85.2%] ml-[12rem]">
            <Header user={user} notif={notif} />
            <Nav user_type={user_type} />
            <form
                onSubmit={handleSubmit}
                className="px-[8rem] grid grid-cols-2 gap-4"
            >
                <div>
                    <label htmlFor="title">Title:</label>
                    <input
                        className="w-full rounded-lg"
                        type="text"
                        id="title"
                        value={data.task_name}
                        onChange={(e) => setData("task_name", e.target.value)}
                    />
                    {errors.task_name && <div>{errors.task_name}</div>}
                </div>

                {project.task_name !== "NON-BILLABLE" && (
                    <div>
                        <label htmlFor="estimate_hours">Estimate Time:</label>
                        <input
                            className="w-full rounded-lg"
                            type="text"
                            id="estimate_hours"
                            value={data.estimate_hours}
                            onChange={(e) =>
                                setData("estimate_hours", e.target.value)
                            }
                        />
                        {errors.estimate_hours && (
                            <div>{errors.estimate_hours}</div>
                        )}
                    </div>
                )}

                <div>
                    <label htmlFor="start_date">Start Date:</label>
                    <input
                        className="w-full rounded-lg"
                        type="date"
                        id="sdate"
                        value={data.sdate}
                        onChange={(e) => setData("sdate", e.target.value)}
                    />
                    {errors.sdate && <div>{errors.sdate}</div>}
                </div>
                <div>
                    <label htmlFor="end_date">End Date:</label>
                    <input
                        className="w-full rounded-lg"
                        type="date"
                        id="edate"
                        value={data.edate}
                        onChange={(e) => setData("edate", e.target.value)}
                    />
                    {errors.edate && <div>{errors.edate}</div>}
                </div>
                <div>
                    <label htmlFor="employee_id">Team Leader</label>
                    <select
                        ref={projectSelectRef}
                        multiple
                        name="leader_id"
                        id="leader_id"
                        value={data.leader_id}
                        onChange={handleTeamLeader}
                        className="w-full rounded-lg"
                    >
                        <option value="">Select Employee</option>
                        {tls.map((tl) => (
                            <option key={tl.id} value={tl.id}>
                                {tl.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="employees">Assign Employees:</label>
                    {/* <Multiselect
                        options={employees}
                        selectedValues={employees.filter(employee => selectedOptions.includes(employee.id))}
                        onSelect={handleSelect}
                        onRemove={handleRemove}
                        displayValue="name"
                        className='w-full rounded-lg'
                    /> */}
                    <Multiselect
                        options={employees}
                        selectedValues={employees.filter((employee) =>
                            selectedOptions.includes(employee.id)
                        )}
                        onSelect={(selectedList, selectedItem) => {
                            setData("employee_id", [
                                ...data.employee_id,
                                selectedItem.id,
                            ]);
                        }}
                        onRemove={(selectedList, removedItem) => {
                            setData(
                                "employee_id",
                                data.employee_id.filter(
                                    (id) => id !== removedItem.id
                                )
                            );
                        }}
                        displayValue="name"
                        className="w-full rounded-lg"
                    />
                    {errors.employee_id && <div>{errors.employee_id}</div>}
                </div>

                {data.employee_id.map((employeeId) => (
                    <div key={employeeId}>
                        <label htmlFor={`estimate_time_${employeeId}`}>
                            Estimate Time for{" "}
                            {
                                employees.find((emp) => emp.id === employeeId)
                                    ?.name
                            }
                            :
                        </label>
                        <input
                            type="text"
                            id={`employee_hours_${employeeId}`}
                            value={employeeEstimates[employeeId] || ""}
                            onChange={(e) =>
                                handleEstimateChange(employeeId, e.target.value)
                            }
                            className="w-full rounded-lg"
                        />
                        {errors[`employee_hours_${employeeId}`] && (
                            <div>{errors[`employee_hours_${employeeId}`]}</div>
                        )}
                    </div>
                ))}
                <div>
                    <label htmlFor="">Priority</label>
                    <select
                        id=""
                        className="w-full rounded-lg"
                        name="priority"
                        value={data.priority}
                        onChange={(e) => setData("priority", e.target.value)}
                    >
                        <option value="">-- Select Priority --</option>
                        <option value="0">Low</option>
                        <option value="1">Medium</option>
                        <option value="2">High</option>
                    </select>
                </div>

                <br />
                <button
                    type="submit"
                    className="bg-blue-600 p-2 rounded-md text-white w-[30%]"
                >
                    Save
                </button>
            </form>
        </div>
    );
};

export default EditProject;
