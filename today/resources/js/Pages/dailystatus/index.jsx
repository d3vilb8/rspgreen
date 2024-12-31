import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { useForm } from "@inertiajs/react";

import { usePage } from "@inertiajs/react";

import { CgPlayTrackNextO } from "react-icons/cg";
import { BiSkipPreviousCircle } from "react-icons/bi";
import { FaPlus } from "react-icons/fa6";
import { FaXmark } from "react-icons/fa6";
import Header from "@/Layouts/Header";
import Nav from "@/Layouts/Nav";
import { FaMessage } from "react-icons/fa6";
import "ldrs/waveform";
import { Notyf } from "notyf";
import "notyf/notyf.min.css"; // Import Notyf styles
const notyf = new Notyf();
// Default values shown
import { MdDelete } from "react-icons/md";
const Timesheet = ({ leave, user, user_type, permissions, notif, userid, taskMappings }) => {
    // console.log(permissions)
    const [modal, setModal] = useState(false);
    const [modalData, setModalData] = useState({ index: null, date: null });

    const [loading, setLoading] = useState(true);
    // console.log(userid)
    const empl = { id: userid };
    useEffect(() => {
        // Simulate an async operation like fetching data or waiting for assets to load
        setTimeout(() => {
            setLoading(false);
        }, 10); // Adjust the delay as needed
    }, []);

    // Function to handle opening the modal and setting modal data
    const handleOpenModal = (index, date) => {
        setModal(true);
        setModalData({ index, date });
    };

    // Function to handle description change
    const handleDescriptionChange = (index, date, value) => {
        const updatedData = [...weekData];
        updatedData[index][`description_${date}`] = value; // Update description for the specific date
        setWeekData(updatedData);

        // Prepare data for the specific entry to be updated
        const updatedEntry = {
            ...updatedData[index],
            date,
            description: value,
        };

        // Send the updated entry via Axios POST request
        axios
            .post("timesheets-store", { timesheets: [updatedEntry] })
            .then((response) => {
                console.log("Description updated successfully", response.data);
                // notyf.success('Description updated successfully');
            })
            .catch((error) => {
                console.error("Error updating the description:", error);
                if (error.response && error.response.data.errors) {
                    Object.values(error.response.data.errors).forEach(
                        (errorMsg) => notyf.error(errorMsg)
                    );
                } else {
                    // notyf.error('An unexpected error occurred while updating the description.');
                }
            });
    };

    const [startDate, setStartDate] = useState(new Date());
    const [noData, setNoData] = useState(false);
    const [weekData, setWeekData] = useState([]);
    const [is_approved, setis_approved] = useState(null);
    const [projects, setProjects] = useState([]);
    const [totals, setTotals] = useState({ total: {}, overtime: {} });
    const [taskMapping, setTaskMapping] = useState(taskMappings);
    const { data, setData, post, errors } = useForm({
        timesheets: [],
    });
    const [selectedWeek, setSelectedWeek] = useState(
        moment().startOf("isoWeek").format("YYYY-MM-DD")
    );
    const [holidays, setHolidays] = useState([]);
    useEffect(() => {
        // axios
        //     .get("/getProjectTasks")
        //     .then((response) => {
        //         const data = response.data || {};
        //         setTaskMapping(data);
        //         setProjects(
        //             Object.keys(data).map((projectId) => ({
        //                 id: projectId,
        //                 project_name: data[projectId].project_name,
        //             }))
        //         );
        //     })
        //     .catch((error) =>
        //         console.error("Error fetching project tasks:", error)
        //     );
        // axios.get("/getProjectTasks").then((res)=>{
        //     const data = res.data || {}
        //     console.log("tasks",res)
        //     // setTaskMapping(data);
        // })

        axios
            .get("/holidays-fetch")
            .then((response) => {
                console.log(response);
                setHolidays(response.data);
            })
            .catch((error) => console.error("Error fetching holidays:", error));
    }, []);
    const [status, setStatus] = useState(null);
    useEffect(() => {
        fetchWeekData(selectedWeek);
        // console.log('Week Data:', selectedWeek);
    }, [selectedWeek]);
    useEffect(() => {
        console.log("Updated Week Data:", weekData);
    }, [weekData]);

    const fetchWeekData = (week) => {
        axios
            .get(`/timesheets/${week}`)
            .then((response) => {
                // console.log(response);
                const fetchedData = response.data.map((entry) => {
                    const entries = entry.entries || {};
                    const formattedEntry = {
                        project_id: entry.project_id,
                        task_id: entry.task_id,
                        status: entry.status,
                        is_approved: entry.is_approved,
                        id: entry.timesheet_ids,
                        ...entries,
                    };
                    console.log("format", formattedEntry);
                    return formattedEntry;
                });

                if (fetchedData.length === 0) {
                    setNoData(true);
                } else {
                    setNoData(false);
                    setWeekData(fetchedData);
                    setData("timesheets", fetchedData);
                    if (fetchedData[0] && fetchedData[0].status !== undefined) {
                        setStatus(fetchedData[0].status);
                    }
                    if (
                        fetchedData[0] &&
                        fetchedData[0].is_approved !== undefined
                    ) {
                        setis_approved(fetchedData[0].is_approved); // Set isApproved state here
                    }
                }
                calculateTotals(fetchedData); // Calculate totals initially
            })
            .catch((error) =>
                console.error("Error fetching the timesheet data!", error)
            );
    };

    const getCurrentDate = (i) => {
        return moment(selectedWeek)
            .startOf("isoWeek")
            .add(i, "days")
            .format("YYYY-MM-DD");
    };
    const CurrentDate = (i) => {
        const date = moment(selectedWeek).startOf("isoWeek").add(i, "days");
        const dayName = date.format("ddd"); // Day name (e.g., Mon)
        const dayDate = date.format("MMM D"); // Date (e.g., Aug 5)
        return { dayName, dayDate };
    };
    const handlePreviousWeek = () => {
        setSelectedWeek(
            moment(selectedWeek).subtract(1, "weeks").format("YYYY-MM-DD")
        );
    };

    const handleNextWeek = () => {
        setSelectedWeek(
            moment(selectedWeek).add(1, "weeks").format("YYYY-MM-DD")
        );
    };

    const leaveStartDate = new Date(leave?.sdate);
    const leaveEndDate = new Date(leave?.edate);

    const isDisabled = (date) => {
        const currentDate = new Date(date);
        return currentDate >= leaveStartDate && currentDate <= leaveEndDate;
    };

    const isHoliday = (date) => {
        return holidays.some((holiday) => {
            const startDate = moment(holiday.start_date, "YYYY-MM-DD");
            const endDate = moment(holiday.end_date, "YYYY-MM-DD");
            const currentDate = moment(date, "YYYY-MM-DD");
            return currentDate.isBetween(startDate, endDate, "day", "[]");
        });
    };

    // New function to check if an employee is assigned to work on a holiday
    const isAssignedToWorkOnHoliday = (date, employeeId) => {
        return holidays.some((holiday) => {
            const startDate = moment(holiday.start_date, "YYYY-MM-DD");
            const endDate = moment(holiday.end_date, "YYYY-MM-DD");
            const currentDate = moment(date, "YYYY-MM-DD");

            // Check if the date is a holiday
            const isHoliday = currentDate.isBetween(
                startDate,
                endDate,
                "day",
                "[]"
            );

            // If it is a holiday, check if the employee is assigned to work
            return (
                isHoliday &&
                holiday.assigned_employees.some((emp) => emp.id === employeeId)
            );
        });
    };

    const handleProjectChange = (index, projectId) => {
        const newWeekData = [...weekData];
        newWeekData[index] = {
            ...newWeekData[index],
            project_id: projectId,
            task_id: "",
        };
        setWeekData(newWeekData);
        setData("timesheets", newWeekData);
    };

    const handleTaskChange = (index, taskId) => {
        const newWeekData = [...weekData];
        newWeekData[index] = {
            ...newWeekData[index],
            task_id: taskId,
        };
        setWeekData(newWeekData);
        setData("timesheets", newWeekData);
    };

    // const handleTimeChange = (index, date, value) => {
    //     const newWeekData = [...weekData];
    //     newWeekData[index] = {
    //         ...newWeekData[index],
    //         [date]: value || '',
    //     };
    //     setWeekData(newWeekData);
    //     const updatedTimesheets = newWeekData.map((entry, i) => ({
    //         ...entry,
    //         date: getCurrentDate(i % 7),
    //     }));
    //     setData('timesheets', updatedTimesheets);
    //     calculateTotals(newWeekData); // Recalculate totals after updating time
    // };
    const handleSubmits = (e) => {
        e.preventDefault();
        const updatedTimesheets = weekData.map((entry, index) => ({
            ...entry,
            date: getCurrentDate(index % 7),
        }));
        setData("timesheets", updatedTimesheets);
        console.log("Data being sent:", updatedTimesheets);
        axios.post("timesheets-store", {
            preserveScroll: true,
            // onSuccess: () => console.log('Timesheets saved successfully'),
            onError: () => console.error("Error saving the timesheets"),
        });
    };
    // const handleTimeChange = (index, date, value) => {
    //     const newWeekData = [...weekData];
    //     const newValue = value || '';

    //     // Update the hours for the specific date in the week data
    //     newWeekData[index] = {
    //         ...newWeekData[index],
    //         [date]: newValue,
    //     };

    //     // Calculate the total hours worked for the task
    //     const totalHours = Object.values(newWeekData[index])
    //         .filter(val => !isNaN(val) && val !== '') // Filter out non-number values
    //         .reduce((sum, val) => sum + Number(val), 0);

    //     // Determine if the task is complete
    //     const taskEstimateHours = newWeekData[index].estimateHours || 5; // Replace with actual estimate hours if available
    //     const isTaskComplete = totalHours >= taskEstimateHours;

    //     // Update the task data to include the disabled flag
    //     newWeekData[index].disabled = isTaskComplete || status === 1 || isDisabled(date) || isHoliday(date) || isWeekend(date);

    //     setWeekData(newWeekData);

    //     const updatedTimesheets = newWeekData.map((entry, i) => ({
    //         ...entry,
    //         date: getCurrentDate(i % 7),
    //     }));
    //     setData('timesheets', updatedTimesheets);

    //     calculateTotals(newWeekData); // Recalculate totals after updating time

    // };
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
    const [tasksWithTimesheets, setTasksWithTimesheets] = useState([]);
    // const [tasksWithTimesheets, setTasksWithTimesheets] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");
    //     const handleTimeChange = async (index, date, value) => {
    //         const newValue = Number(value) || 0;
    //         const newWeekData = [...weekData];
    //         newWeekData[index] = {
    //             ...newWeekData[index],
    //             [date]: newValue,
    //         };

    //         // Calculate the total hours for the current entry
    //         const totalHours = Object.values(newWeekData[index])
    //             .filter(val => !isNaN(val) && val !== '')
    //             .reduce((sum, val) => sum + Number(val), 0);

    //         const taskEstimateHours = newWeekData[index].estimateHours || 5;
    //         const isTaskComplete = totalHours >= taskEstimateHours;
    // //  console.log(empl.id)
    //         newWeekData[index].disabled = isTaskComplete || status === 1 || isDisabled(date) ||  (isHoliday(date) && !isAssignedToWorkOnHoliday(date, empl.id)) || isWeekend(date);

    //         setWeekData(newWeekData);

    //         const updatedTimesheets = newWeekData.map((entry, i) => ({
    //             ...entry,
    //             date: getCurrentDate(i % 7),
    //         }));

    //         // Update tasksWithTimesheets based on new timesheets data
    //         const updatedTasks = tasksWithTimesheets.map(task => {
    //             const taskTimesheets = updatedTimesheets.filter(ts => ts.task_id === task.task_id);
    //             const totalTimeWorked = taskTimesheets.reduce((sum, ts) => sum + (Number(ts.time_number) || 0), 0);
    //             return {
    //                 ...task,
    //                 total_time_worked: totalTimeWorked,
    //             };
    //         });

    //         setTasksWithTimesheets(updatedTasks);

    //         let hasValidationErrors = false;
    //         const validationErrors = [];

    //         const finalTimesheets = updatedTimesheets.map((entry, idx) => {
    //             const task = updatedTasks.find(task => task.task_id === entry.task_id);

    //             if (task) {
    //                 const estimateHours = Number(task.estimate_hours);
    //                 const inputTime = Number(entry.time_number || 0);
    //                 const totalTimeWorked = Number(task.total_time_worked || 0);
    //                 const newTotalTime = totalTimeWorked + inputTime;

    //                 if (newTotalTime > estimateHours) {
    //                     validationErrors.push(`Task ${task.task_name} has exceeded its estimated hours of ${estimateHours}. Please submit your extra task hour in NON-Billable.`);
    //                     hasValidationErrors = true;

    //                     return {
    //                         ...entry,
    //                         date: getCurrentDate(idx % 7),
    //                         time_number: estimateHours.toString(),
    //                     };
    //                 }
    //             }

    //             return {
    //                 ...entry,
    //                 date: getCurrentDate(idx % 7),
    //             };
    //         });

    //         setErrorMessage(validationErrors.join('\n'));
    //         setIsSubmitDisabled(hasValidationErrors);

    //         try {
    //             await axios.post('/timesheets-store', { timesheets: finalTimesheets });
    //             setSuccessMessage('Timesheets updated successfully.');
    //             setErrorMessage('');
    //         } catch (error) {
    //             console.error("Error submitting timesheets:", error);
    //             setErrorMessage('There was an error saving the timesheets. Please try again.');
    //             setSuccessMessage('');
    //         }

    //         calculateTotals(newWeekData); // Recalculate totals after updating time
    //     };

    const handleTimeChange = async (index, date, value) => {
        const newValue = Number(value);

        // Ensure valid input (between 0 to 100)
        if (isNaN(newValue) || newValue < 0 || newValue > 100) {
            return;
        }

        // Copy the current week data
        const newWeekData = [...weekData];
        newWeekData[index] = {
            ...newWeekData[index],
            [date]: newValue, // Set the new value, including 0
        };

        // Update state with new week data
        setWeekData(newWeekData);

        // Calculate the total hours for the current entry
        const totalHours = Object.values(newWeekData[index])
            .filter((val) => !isNaN(val) && val !== "")
            .reduce((sum, val) => sum + Number(val), 0);

        const taskEstimateHours = newWeekData[index].estimateHours || 5;
        const isTaskComplete = totalHours >= taskEstimateHours;

        // Update the disabled state based on task completion and other conditions
        newWeekData[index].disabled =
            isTaskComplete ||
            status === 1 ||
            isDisabled(date) ||
            (isHoliday(date) && !isAssignedToWorkOnHoliday(date, empl.id)) ||
            isWeekend(date);

        // Update state again with the new disabled status
        setWeekData(newWeekData);

        const updatedTimesheets = newWeekData.map((entry, i) => ({
            ...entry,
            date: getCurrentDate(i % 7),
        }));

        // Update tasksWithTimesheets based on new timesheets data
        const updatedTasks = tasksWithTimesheets.map((task) => {
            const taskTimesheets = updatedTimesheets.filter(
                (ts) => ts.task_id === task.task_id
            );
            const totalTimeWorked = taskTimesheets.reduce(
                (sum, ts) => sum + (Number(ts.time_number) || 0),
                0
            );
            return {
                ...task,
                total_time_worked: totalTimeWorked,
            };
        });

        setTasksWithTimesheets(updatedTasks);

        let hasValidationErrors = false;
        const validationErrors = [];

        const finalTimesheets = updatedTimesheets.map((entry, idx) => {
            const task = updatedTasks.find(
                (task) => task.task_id === entry.task_id
            );

            if (task) {
                const estimateHours = Number(task.estimate_hours);
                const inputTime = Number(entry.time_number || 0);
                const totalTimeWorked = Number(task.total_time_worked || 0);
                const newTotalTime = totalTimeWorked + inputTime;

                if (newTotalTime > estimateHours) {
                    validationErrors.push(
                        `Task ${task.task_name} has exceeded its estimated hours of ${estimateHours}. Please submit your extra task hour in NON-Billable.`
                    );
                    hasValidationErrors = true;

                    return {
                        ...entry,
                        date: getCurrentDate(idx % 7),
                        time_number: estimateHours.toString(),
                    };
                }
            }

            return {
                ...entry,
                date: getCurrentDate(idx % 7),
            };
        });

        setErrorMessage(validationErrors.join("\n"));
        setIsSubmitDisabled(hasValidationErrors);

        try {
            await axios.post("/timesheets-store", {
                timesheets: finalTimesheets,
            });
            setSuccessMessage("Timesheets updated successfully.");
            setErrorMessage("");
        } catch (error) {
            console.error("Error submitting timesheets:", error);
            setErrorMessage(
                "There was an error saving the timesheets. Please try again."
            );
            setSuccessMessage("");
        }

        calculateTotals(newWeekData); // Recalculate totals after updating time
    };

    useEffect(() => {
        if (errorMessage) {
            console.log("Error:", errorMessage);
            // You can also display the error message in your UI here
            // Example: setErrorDisplayMessage(errorMessage);
        }
    }, [errorMessage]); // Depend on errorMessage to trigger this effect
    const handleStatusChange = (index, status) => {
        const newWeekData = [...weekData];
        newWeekData[index] = {
            ...newWeekData[index],
            status,
        };
        setWeekData(newWeekData);
        setData("timesheets", newWeekData);
    };

    // useEffect(() => {
    //     // Fetch tasks with timesheets from the backend
    //     fetch('/timesheets-time')
    //         .then(response => response.json())
    //         .then(data => {
    //             setTasksWithTimesheets(data);
    //         })
    //         .catch(error => console.error('Error fetching tasks with timesheets:', error));
    // }, []);

    useEffect(() => {
        // Refresh data when weekData or tasksWithTimesheets changes
        const fetchData = async () => {
            try {
                const response = await axios.get("/timesheets-time"); // Replace with your data fetching endpoint
                // setWeekData(response.data.weekData);
                setTasksWithTimesheets(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [weekData, tasksWithTimesheets]); // Trigger refresh on changes
    // const handleSubmit = (e) => {
    //     e.preventDefault();

    //     const updatedTimesheets = data.timesheets.map((entry, index) => ({
    //         ...entry,
    //         date: getCurrentDate(index % 7),
    //     }));

    //     setData('timesheets', updatedTimesheets);

    //     const overEstimatedTask = tasksWithTimesheets.find(task => {
    //         // Calculate the total time input for this task
    //         const totalInputTime = updatedTimesheets
    //             .filter(ts => ts.task_id === task.task_id)
    //             .reduce((acc, ts) => acc + Number(ts.time_number || 0), 0);

    //         // Check if the total time exceeds the estimate hours
    //         return totalInputTime > task.estimate_hours; // Only trigger if total time exceeds estimate
    //     });

    //     if (overEstimatedTask) {
    //         alert(`Warning: Task "${overEstimatedTask.task_name}" has exceeded its estimated hours of ${overEstimatedTask.estimate_hours}!`);
    //        return
    //     }

    //     // Proceed with form submission
    //     post('timesheets-store', {
    //         preserveScroll: true,
    //         onSuccess: () => console.log('Timesheets saved successfully'),
    //         onError: () => console.error('Error saving the timesheets'),
    //     });
    // };
    const handleSubmit = async (e) => {
        e.nativeEvent.preventDefault();

        let hasValidationErrors = false;
        const validationErrors = {};

        const updatedTimesheets = data.timesheets.map((entry, index) => {
            const task = tasksWithTimesheets.find(
                (task) => task.task_id === entry.task_id
            );

            if (task) {
                const estimateHours = Number(task.estimate_hours);
                const inputTime = Number(entry.time_number || 0);
                const newTotalTime = Number(task.total_time_worked) + inputTime;

                if (newTotalTime > estimateHours) {
                    validationErrors[
                        entry.task_id
                    ] = `Input time for task "${task.task_name}" exceeds the estimated hours of ${estimateHours}.`;
                    hasValidationErrors = true;

                    // Optionally reset the invalid input
                    return {
                        ...entry,
                        date: getCurrentDate(index % 7),
                    };
                }
            }
            window.location.reload();
            return {
                ...entry,
                date: getCurrentDate(index % 7),
            };
        });

        setData("timesheets", updatedTimesheets);

        if (hasValidationErrors) {
            // Display validation errors if any
            Object.values(validationErrors).forEach((error) => alert(error));
        } else {
            // Perform the POST request
            notyf.success("Timesheet updated successfully");
        }
    };

    // useEffect(() => {
    //     tasksWithTimesheets.forEach(task => {
    //         const totalTimeWorked = Number(task.total_time_worked);
    //         const estimateHours = Number(task.estimate_hours);

    //         if (totalTimeWorked > estimateHours) {
    //             alert(`Task "${task.task_name}" has exceeded its estimated hours of ${estimateHours}.`);
    //         }
    //     });
    // }, [tasksWithTimesheets]);

    const [exceededTasks, setExceededTasks] = useState([]);

    useEffect(() => {
        const exceeded = tasksWithTimesheets.filter((task) => {
            const totalTimeWorked = Number(task.total_time_worked);
            const estimateHours = Number(task.estimate_hours);
            return totalTimeWorked > estimateHours;
        });

        setExceededTasks(exceeded);
    }, [tasksWithTimesheets]);

    const isSubmitDisabledss = exceededTasks.length > 0;

    // useEffect(() => {
    //     tasksWithTimesheets.forEach(task => {
    //         const totalTimeWorked = Number(task.total_time_worked);
    //         const estimateHours = Number(task.estimate_hours);

    //         // Only show error if totalTimeWorked exceeds or equals estimateHours
    //         if (totalTimeWorked >= estimateHours) {
    //             alert(`Task "${task.task_name}" has exceeded its estimated hours of ${estimateHours}.`);
    //         }
    //     });
    // }, [tasksWithTimesheets]);

    const handleStatus = (e) => {
        e.preventDefault();

        // Update timesheets data with current dates
        const updatedTimesheets = weekData.map((entry, index) => ({
            ...entry,
            date: getCurrentDate(index % 7),
        }));
        setData("timesheets", updatedTimesheets);

        // Send post request to update timesheet status
        post("timesheets-status", {
            preserveScroll: true,

            onSuccess: () => {
                notyf.success(
                    "Timesheets status updated successfully please contact admin "
                );
                window.location.reload();
            },
            onError: () => {
                console.error("Error updating the timesheets status");
                notyf.error(
                    "An error occurred while updating the timesheets status."
                );
            },
        });
    };

    const addRow = () => {
        setWeekData([
            ...weekData,
            { project_id: "", task_id: "", time_number: "" },
        ]);
        setNoData(false);
    };
    const calculateTotals = (data) => {
        const totals = { total: {}, overtime: {} };

        for (let i = 0; i < 7; i++) {
            const date = getCurrentDate(i);
            let dailyTotal = 0;
            data.forEach((row) => {
                // Only add to dailyTotal if there is a valid time entry
                const time = row[date] ? parseFloat(row[date]) : 0;
                dailyTotal += time;
            });

            totals.total[date] = dailyTotal;

            // Calculate overtime (or under-time) only if there's input
            if (dailyTotal === 0) {
                totals.overtime[date] = 0; // If there's no input, overtime is 0
            } else if (dailyTotal > 8) {
                totals.overtime[date] = dailyTotal - 8;
            } else {
                totals.overtime[date] = dailyTotal - 8; // This can be negative
            }
        }

        setTotals(totals);
    };

    const getWeekRange = (selectedDate) => {
        const startOfWeek = moment(selectedDate).startOf("isoWeek");
        const endOfWeek = moment(selectedDate).endOf("isoWeek");
        return { start: startOfWeek, end: endOfWeek };
    };

    const formatWeekRange = (start, end) => {
        const formattedStart = start.format("dddd, MMMM DD, YYYY");
        const formattedEnd = end.format("dddd, MMMM DD, YYYY");
        return `${formattedStart} - ${formattedEnd}`;
    };

    const weekRange = getWeekRange(selectedWeek);
    const formattedWeekRange = formatWeekRange(weekRange.start, weekRange.end);
    const isWeekend = (i) => {
        const day = moment(selectedWeek)
            .startOf("isoWeek")
            .add(i, "days")
            .day();
        return day === 6 || day === 0; // 6 is Saturday, 0 is Sunday
    };
    const calculateWeeklyTotals = () => {
        let weeklyTotala = 0;
        let weeklyOverUnderTimeCount = 0;

        weekData.forEach((rowData) => {
            Array.from({ length: 7 }).forEach((_, i) => {
                const date = getCurrentDate(i);
                const dailyHours = parseFloat(rowData[date] || 0);

                weeklyTotala += dailyHours;

                if (dailyHours > 8) {
                    weeklyOverUnderTimeCount += 1; // Count as 1 for overtime
                } else if (dailyHours < 8) {
                    weeklyOverUnderTimeCount += 8 - dailyHours; // Count the difference for undertime
                }
                // No need to add anything if dailyHours == 8
            });
        });
        // console.log(weeklyOverUnderTimeCount)
        return { weeklyTotala, weeklyOverUnderTimeCount };
    };

    // Usage
    const { weeklyTotala, weeklyOverUnderTimeCount } = calculateWeeklyTotals();

    const totalTime = Array.from({ length: 7 }).reduce((acc, _, i) => {
        const date = getCurrentDate(i);
        const overtime = totals.overtime[date] || 0;

        if (overtime < 0) {
            acc += Math.abs(overtime); // Add the absolute value of the negative overtime
        }

        return acc;
    }, 0);

    const totalOvertime = Array.from({ length: 7 }).reduce((acc, _, i) => {
        const date = getCurrentDate(i);
        const overtime = totals.overtime[date] || 0;

        if (overtime > 0) {
            acc += overtime; // Add the excess overtime hours directly
        }

        return acc;
    }, 0);

    const [Timesheets, setTimesheets] = useState();
    const overltime = totalOvertime + totalTime;

    const handleRemove = async (index) => {
        const timesheetId = weekData[index].id[0]; // Extract the first ID from the array
        console.log("Deleting timesheet ID:", timesheetId); // Log the ID to check its value

        if (!timesheetId) {
            console.error("No timesheet ID found");
            return; // Exit if there's no ID
        }

        try {
            // Make a DELETE request to the backend
            await axios.get(`/timesheets-delete/${timesheetId}`);
            window.location.reload();
            // Update the local state
            const newWeekData = [...weekData];
            newWeekData.splice(index, 1);
            setWeekData(newWeekData);
            setNoData(newWeekData.length === 0);
            setData("timesheets", newWeekData);
        } catch (error) {
            console.error("Error deleting timesheet entry:", error);
            // Optionally show an error message to the user
        }
    };

    const [nonBillableTitles, setNonBillableTitles] = useState([]); // Holds the titles of non-billable tasks
    const [nonBillableTimesheets, setNonBillableTimesheets] = useState(
        Array(7).fill({ title: "", time: "" })
    );
    const handleNonBillableTitleChange = (index, title) => {
        const updatedNonBillableTimesheets = [...nonBillableTimesheets];
        updatedNonBillableTimesheets[index].title = title;
        setNonBillableTimesheets(updatedNonBillableTimesheets);
    };

    const handleNonBillableTimeChange = (index, time) => {
        const updatedNonBillableTimesheets = [...nonBillableTimesheets];
        updatedNonBillableTimesheets[index].time = time;
        setNonBillableTimesheets(updatedNonBillableTimesheets);
    };
    const fetchNonBillableTitles = async () => {
        try {
            const response = await axios.get("/api/non-billable-tasks");
            setNonBillableTitles(response.data.map((task) => task.name)); // Assuming the task object has a `name` property
        } catch (error) {
            console.error("Error fetching non-billable tasks:", error);
        }
    };

    // Call this function in useEffect to fetch data when the component mounts
    useEffect(() => {
        fetchNonBillableTitles();
    }, []);

    // const getCurrentDate = (i) => {
    //     const date = new Date();
    //     date.setDate(date.getDate() + i);
    //     return date.toISOString().split('T')[0];
    // };
    return (
        <div className="w-[83%]  absolute right-0 overflow-hidden">
            <Header user={user} notif={notif} />
            <Nav user_type={permissions} />
            <div>
                {" "}
                {loading ? (
                    <span className="grid place-items-center h-[20rem]">
                        <l-waveform
                            size="35"
                            stroke="3.5"
                            speed="1"
                            color="black"
                        ></l-waveform>
                    </span>
                ) : (
                    <>
                        {" "}
                        <div
                            className={`modal absolute top-0 left-0 w-full h-full transition-all duration-500 bg-black/50 flex justify-center items-center ${
                                modal
                                    ? "opacity-100 visible pointer-events-auto"
                                    : "opacity-0 invisible pointer-events-none"
                            }`}
                        >
                            <div className="w-2/5 p-4 px-6 bg-white rounded-md">
                                <div className="flex justify-between">
                                    <h1 className="text-xl font-semibold">
                                        Add Description
                                    </h1>
                                    <button onClick={() => setModal(false)}>
                                        <FaXmark />
                                    </button>
                                </div>
                                <hr className="my-2" />
                                <form className="py-3 space-y-5">
                                    <textarea
                                        type="text"
                                        className="w-full p-2 border rounded-md"
                                        placeholder="Description"
                                        value={
                                            modalData.index !== null &&
                                            modalData.date !== null
                                                ? weekData[modalData.index][
                                                      `description_${modalData.date}`
                                                  ] || ""
                                                : ""
                                        }
                                        onChange={(e) =>
                                            handleDescriptionChange(
                                                modalData.index,
                                                modalData.date,
                                                e.target.value
                                            )
                                        }
                                    ></textarea>
                                    <div>
                                        {/* <button
                    onClick={handleSubmits}
                    className='px-8 py-2 text-sm font-semibold text-white bg-blue-500 rounded-md'
                >
                    Submit
                </button> */}
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div
                            className="space-x-2"
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                margin: "1rem",
                            }}
                        >
                            <p>
                                <span className="font-bold ">Week</span>:{" "}
                                <span className="text-red-500 underline">
                                    {" "}
                                    {formattedWeekRange}
                                </span>
                            </p>
                            <div>
                                <button
                                    onClick={handlePreviousWeek}
                                    className="underline"
                                >
                                    <BiSkipPreviousCircle className="text-[2rem] text-blue-500" />
                                </button>
                                <button
                                    onClick={handleNextWeek}
                                    className="underline"
                                >
                                    <CgPlayTrackNextO className="text-[2rem] text-blue-500" />
                                </button>
                            </div>
                        </div>
                        <div className="px-4">
                            <div className="flex justify-end border  bg-[#356A6A] rounded-t-md p-3">
                                {isSubmitDisabledss ? (
                                    <button className="p-2 text-white bg-blue-800 rounded-md">
                                        <FaPlus />
                                    </button>
                                ) : (
                                    <button
                                        onClick={addRow}
                                        className="p-2 text-white bg-blue-800 rounded-md"
                                    >
                                        <FaPlus />
                                    </button>
                                )}
                            </div>

                            {exceededTasks.length > 0 && (
                                <div className="text-red-500">
                                    {exceededTasks.map((task, index) => (
                                        <p key={index}>
                                            Task {task.task_name} has exceeded
                                            its estimated hours of{" "}
                                            {task.estimate_hours}.please Submit
                                            your extra task hour in NON-Billable
                                        </p>
                                    ))}
                                </div>
                            )}
                            <form onSubmit={(e) => e.preventDefault()}>
                                <table className="w-full  border-[3px]">
                                    <thead className="bg-[#465584] text-white">
                                        <tr>
                                            {/* <th className='p-1 border'>Project</th> */}
                                            <th className="p-1 border">
                                                Project
                                            </th>
                                            {Array.from({ length: 7 }).map(
                                                (_, i) => {
                                                    const { dayName, dayDate } =
                                                        CurrentDate(i);
                                                    return (
                                                        <th
                                                            className="p-1 text-center border"
                                                            key={i}
                                                        >
                                                            <div>{dayDate}</div>
                                                            <div>{dayName}</div>
                                                        </th>
                                                    );
                                                }
                                            )}
                                            <td className="w-[88px]">
                                                Total Time
                                            </td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {noData ? (
                                            <tr>
                                                <td colSpan="8">
                                                    {" "}
                                                    <p className="grid place-items-center">
                                                        {" "}
                                                        <h1 className="font-bold text-[1.5rem]">
                                                            We couldn't find any
                                                            data
                                                        </h1>
                                                        Sorry we can't find any
                                                        timesheet records on
                                                        this week. Please add
                                                        timesheet record .
                                                    </p>
                                                </td>
                                            </tr>
                                        ) : (
                                            <>
                                                {weekData.map(
                                                    (rowData, index) => {
                                                        const timesheetId =
                                                            rowData.id;
                                                        console.log(
                                                            timesheetId
                                                        );
                                                        weekData.forEach(
                                                            (rowData) => {
                                                                // ...
                                                            }
                                                        );

                                                        const weeklyTotal =
                                                            Array.from({
                                                                length: 7,
                                                            }).reduce(
                                                                (
                                                                    total,
                                                                    _,
                                                                    i
                                                                ) => {
                                                                    const date =
                                                                        getCurrentDate(
                                                                            i
                                                                        );
                                                                    return (
                                                                        total +
                                                                        parseFloat(
                                                                            rowData[
                                                                                date
                                                                            ] ||
                                                                                0
                                                                        )
                                                                    );
                                                                },
                                                                0
                                                            );

                                                        return (
                                                            <tr key={index}>
                                                                {/* <td className="bg-white w-[]">
                                                                    <select
                                                                        className="bg-[#6699CC] text-white w-[147px] text-[1rem]"
                                                                        name={`timesheets[${index}].project_id`}
                                                                        value={
                                                                            rowData.project_id
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            handleProjectChange(
                                                                                index,
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                    >
                                                                        <option value="">
                                                                            Select
                                                                            Project
                                                                        </option>
                                                                        {projects.map(
                                                                            (
                                                                                project
                                                                            ) => (
                                                                                <option
                                                                                    key={
                                                                                        project.id
                                                                                    }
                                                                                    value={
                                                                                        project.id
                                                                                    }
                                                                                    className=""
                                                                                >
                                                                                    {
                                                                                        project.project_name
                                                                                    }
                                                                                </option>
                                                                            )
                                                                        )}
                                                                    </select>
                                                                </td> */}
                                                                <td className="bg-white w-[]">
                                                                    <select
                                                                        className="bg-[#6699CC] text-white border-white border text-[1rem] w-[147px]"
                                                                        name={`timesheets[${index}].task_id`}
                                                                        value={
                                                                            rowData.task_id
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            handleTaskChange(
                                                                                index,
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                    >
                                                                        <option value="">
                                                                            Select
                                                                            Task
                                                                        </option>
                                                                        {(
                                                                            taskMapping ||
                                                                            []
                                                                        )?.map(
                                                                            (
                                                                                task
                                                                            ) => (
                                                                                <option
                                                                                    key={
                                                                                        task.task_id
                                                                                    }
                                                                                    value={
                                                                                        task.task_id
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        task.tname
                                                                                    }
                                                                                </option>
                                                                            )
                                                                        )}
                                                                    </select>
                                                                </td>
                                                                {Array.from({
                                                                    length: 7,
                                                                }).map(
                                                                    (_, i) => {
                                                                        const date =
                                                                            getCurrentDate(
                                                                                i
                                                                            );

                                                                        const disabled =
                                                                            status ===
                                                                                1 ||
                                                                            isDisabled(
                                                                                date
                                                                            ) ||
                                                                            (isHoliday(
                                                                                date
                                                                            ) &&
                                                                                !isAssignedToWorkOnHoliday(
                                                                                    date,
                                                                                    empl.id
                                                                                )) ||
                                                                            isWeekend(
                                                                                date
                                                                            );
                                                                        return (
                                                                            <td
                                                                                key={
                                                                                    i
                                                                                }
                                                                                className="w-[] bg-white border-2 "
                                                                            >
                                                                                <div className="flex">
                                                                                    <input
                                                                                        className={`form-control ${
                                                                                            disabled
                                                                                                ? "bg-[#f7e0e0] text-white w-[60px] border-[#594684]"
                                                                                                : "w-[60px] border-[#465584]"
                                                                                        }`}
                                                                                        type="number"
                                                                                        name={`timesheets[${index}][${date}]`}
                                                                                        value={
                                                                                            rowData[
                                                                                                date
                                                                                            ] !==
                                                                                            undefined
                                                                                                ? rowData[
                                                                                                      date
                                                                                                  ]
                                                                                                : ""
                                                                                        } // Ensure 0 is treated as valid
                                                                                        onChange={(
                                                                                            e
                                                                                        ) =>
                                                                                            handleTimeChange(
                                                                                                index,
                                                                                                date,
                                                                                                e
                                                                                                    .target
                                                                                                    .value
                                                                                            )
                                                                                        }
                                                                                        disabled={
                                                                                            disabled
                                                                                        }
                                                                                        min={
                                                                                            0
                                                                                        } // Ensure minimum value is 0
                                                                                        max={
                                                                                            100
                                                                                        } // Ensure maximum value is 100
                                                                                    />
                                                                                    <button
                                                                                        onClick={() =>
                                                                                            handleOpenModal(
                                                                                                index,
                                                                                                date
                                                                                            )
                                                                                        }
                                                                                        className="text-[#F6A12E] px-2 py-2 text-sm rounded-md font-medium "
                                                                                    >
                                                                                        <FaMessage />
                                                                                    </button>
                                                                                </div>
                                                                            </td>
                                                                        );
                                                                    }
                                                                )}
                                                                {/* Add a new <td> to display the weekly total */}
                                                                <td className="bg-white">
                                                                    <input
                                                                        className=" text-center form-control w-[88px] bg-[#d3e0ea] text-black"
                                                                        type="number"
                                                                        value={
                                                                            weeklyTotal
                                                                        }
                                                                        disabled
                                                                    />
                                                                </td>
                                                                <td>
                                                                    {status ===
                                                                    1 ? (
                                                                        ""
                                                                    ) : (
                                                                        <button
                                                                            onClick={() =>
                                                                                handleRemove(
                                                                                    index
                                                                                )
                                                                            }
                                                                        >
                                                                            <MdDelete className="text-red-500" />
                                                                        </button>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        );
                                                    }
                                                )}

                                                <tr className="bg-[#e0f7e0] ">
         
                                                    <td className="border ">
                                                        Total
                                                    </td>
                                                    {Array.from({
                                                        length: 7,
                                                    }).map((_, i) => {
                                                        const date =
                                                            getCurrentDate(i);
                                                        return (
                                                            <td
                                                                key={i}
                                                                className="p-2 border"
                                                            >
                                                                {totals.total[
                                                                    date
                                                                ] || 0}
                                                            </td>
                                                        );
                                                    })}
                                                    <td className="text-center">
                                                        {weeklyTotala}
                                                    </td>
                                                </tr>
                                                <tr className="bg-[#fff] ">
                                                    <td className="border ">
                                                        {" "}
                                                        Extra Work hours{" "}
                                                    </td>
                                                    {Array.from({
                                                        length: 7,
                                                    }).map((_, i) => {
                                                        const date =
                                                            getCurrentDate(i);
                                                        const over =
                                                            totals.overtime[
                                                                date
                                                            ] || 0;
                                                        const displayOvertime =
                                                            over > 0
                                                                ? `+${over}`
                                                                : over;
                                                        return (
                                                            <td
                                                                style={{
                                                                    color:
                                                                        displayOvertime >
                                                                        0
                                                                            ? "green"
                                                                            : "red",
                                                                }}
                                                                key={i}
                                                                className="p-2 text-center border"
                                                            >
                                                                {over === 0
                                                                    ? 0
                                                                    : displayOvertime}
                                                            </td>
                                                        );
                                                    })}

                                                    <td className="text-center">
                                                        -{overltime}
                                                    </td>
                                                </tr>
                                            </>
                                        )}
                                    </tbody>
                                </table>

                                {/* {Object.keys(totals.projectWise).map(projectId => (
<div key={projectId}>
<h3>Project ID: {projectId}</h3>
<p>Weekly Total: {totals.projectWise[projectId].weeklyTotal}</p>
<p>Weekly Overtime: {totals.projectWise[projectId].weeklyOvertime}</p>
</div>
))} */}
                                {/* <div>

    <button type="submit">Submit</button>
    <button type="button" onClick={handleStatus}>Update Status</button>
</div> */}
                                <div className="flex justify-between   bg-[#356A6A]">
                                    <div className="w-[50%] grid place-items-center border-2 p-3">
                                        <button
                                            onClick={handleSubmit}
                                            className="border-2 p-2 bg-[#465584] text-white rounded-md"
                                            disabled={status === 1}
                                        >
                                            Save time Status
                                        </button>
                                        {status === 1 ? (
                                            <>
                                                {" "}
                                                <p className="mt-3 text-white">
                                                    Already submitted timesheet
                                                    status as approved
                                                </p>
                                            </>
                                        ) : (
                                            <p className="mt-3 text-white">
                                                Submit your timesheet status as
                                                approved
                                            </p>
                                        )}
                                    </div>

                                    <div className="w-[50%] grid place-items-center border-2 p-3">
                                        {isSubmitDisabledss ? (
                                            <button
                                                className=" p-2 bg-[#777475] text-white rounded-md"
                                                disabled={status === 1}
                                            >
                                                Submit time Status
                                            </button>
                                        ) : (
                                            <button
                                                onClick={handleStatus}
                                                className="border-2 p-2 bg-[#F06495] text-white rounded-md"
                                                disabled={status === 1}
                                            >
                                                Submit time Status
                                            </button>
                                        )}

                                        <div className="mt-3">
                                            {is_approved === 3 ? (
                                                ""
                                            ) : is_approved === 1 ? (
                                                <span className="font-bold text-green-600">
                                                    Timesheet Approved
                                                </span>
                                            ) : is_approved === 0 ? (
                                                <span className="font-bold text-red-600">
                                                    Timesheet Rejected
                                                </span>
                                            ) : (
                                                ""
                                            )}
                                        </div>
                                        {status === 1 ? (
                                            <>
                                                {" "}
                                                <p className="mt-3 text-white">
                                                    contact admin to edit
                                                    timesheet
                                                </p>
                                            </>
                                        ) : (
                                            <p className="mt-3 text-white">
                                                Save to update the pending
                                                timesheet
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Timesheet;
