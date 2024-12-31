import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Header from '@/Layouts/Header';
import Nav from '@/Layouts/Nav';
import { Inertia } from '@inertiajs/inertia';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css'; // Import Notyf styles
const notyf = new Notyf();
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { FaFilePdf } from "react-icons/fa";
import { FaFileExcel } from "react-icons/fa";
const TimesheetSearch = ({ user, user_type, project, employee, usrrr, notif ,tasks}) => {
    const tableRef = useRef(null);

    const getFirstDayOfMonth = () => {
        const date = new Date();
        date.setDate(1);
        return date.toISOString().split('T')[0];
    };

    const reportExport = (timesheets) => {
        Inertia.get(route('report.export'), { timesheets: JSON.stringify(timesheets) });
    };

    const handleDownloadPdf = () => {
        const input = tableRef.current; // Use the tableRef to get the table element
        if (input) {
            html2canvas(input, { scale: 2 }).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save('timesheet.pdf');
            });
        }
    };

    const firstDayOfMonth = getFirstDayOfMonth();
    const today = new Date().toISOString().split('T')[0];
    const [startDate, setStartDate] = useState(firstDayOfMonth);
    const [endDate, setEndDate] = useState(today);
    const [timesheets, setTimesheets] = useState([]);
    const [projectTitle, setProjectTitle] = useState('');
    const [employeeName, setEmployeeName] = useState('');
    const [taskName, setTaskName] = useState('');
    useEffect(() => {
        if (startDate && endDate) {
            fetchTimesheets();
        }
    }, [startDate, endDate, projectTitle, employeeName,taskName]);

    const fetchTimesheets = () => {
        axios.get('/reports', {
            params: {
                startDate,
                endDate,
                projectTitle: projectTitle || undefined,
                employeeName: employeeName || undefined,
                taskName: taskName || undefined,
            }
        })
            .then(response => {
                setTimesheets(response.data);
            })
            .catch(error => console.error('Error fetching timesheets:', error));
    };

    useEffect(() => {
        if (startDate && endDate && projectTitle) {
            fetchTimesheets();
        }
    }, [projectTitle]);

    useEffect(() => {
        if (startDate && endDate && projectTitle && employeeName) {
            fetchTimesheets();
        }
    }, [employeeName]);
    useEffect(() => {
        if (startDate && endDate && projectTitle && employeeName && taskName) {
            fetchTimesheets();
        }
    }, [taskName]);
    return (
        <div className='w-[83%] absolute right-0 '>
            <Header user={user} notif={notif} />
            <Nav user_type={user_type} usrrr={usrrr} />
            <div className='flex py-5 space-x-2'>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
                {usrrr === 1 && (
                    <>
                        <select value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)}>
                            <option value="">Select project</option>
                            {project.map(p => (
                                <option key={p.title} value={p.title}>{p.title}</option>
                            ))}
                        </select>
                        <select value={employeeName} onChange={(e) => setEmployeeName(e.target.value)}>
                            <option value="">Select Employee</option>
                            {employee.map(p => (
                                <option key={p.name} value={p.name}>{p.name}</option>
                            ))}
                        </select>
                        {/*<select value={taskName} onChange={(e) => setTaskName(e.target.value)}>*/}
                        {/*    <option value="">Select Teask</option>*/}
                        {/*    {tasks.map(p => (*/}
                        {/*        <option key={p.task_name} value={p.task_name}>{p.task_name}</option>*/}
                        {/*    ))}*/}
                        {/*</select>*/}
                    </>
                )}
                {/*<div className='flex justify-end w-full pr-8'>*/}
                {/*    <button type='button' onClick={() => reportExport(timesheets)}*/}
                {/*            className='text-green-900 text-[1.5rem]'>*/}
                {/*        <FaFileExcel/>*/}
                {/*    </button>*/}
                {/*    <button onClick={handleDownloadPdf} className=" text-red-600 rounded text-[1.5rem]">*/}
                {/*        <FaFilePdf/>*/}
                {/*    </button>*/}
                {/*</div>*/}
            </div>

            <table ref={tableRef} className='w-[100%] absolute right-8 overflow-hidden px-5'>
                <thead className='w-full px-8'>
                <tr className='border p-2 text-left bg-[#465584] text-white'>
                    {usrrr === 1 && <th className='p-2 text-left border'>Employee Name</th>}
                    <th className='p-2 text-left border'>Project Title</th>
                    <th className='p-2 text-left border'>Task Name</th>
                    <th className='p-2 text-left border'>Date</th>
                    <th className='p-2 text-left border'>Assign Hours</th>
                    <th className='p-2 text-left border'>Time Spent(hours)</th>
                    <th className='p-2 text-left border'>Description</th>
                </tr>
                </thead>
                <tbody>
                {timesheets.map((timesheet, index) => (
                    <tr key={index}>
                        {usrrr === 1 && (
                            <td style={{
                                color: timesheet.time_number > 8 ? 'green' : timesheet.time_number < 0 ? 'red' : 'black',
                                backgroundColor: timesheet.time_number > 8 ? '#e0f7e0' : timesheet.time_number < 0 ? '#f7e0e0' : '#f7e0e0',
                            }} className='p-2 text-left border border-blue-400'>{timesheet.name}</td>
                        )}
                        <td style={{
                            color: timesheet.time_number > 8 ? 'green' : timesheet.time_number < 0 ? 'red' : 'black',
                            backgroundColor: timesheet.time_number > 8 ? '#e0f7e0' : timesheet.time_number < 0 ? '#f7e0e0' : '#f7e0e0',
                        }} className='p-2 text-left border border-blue-400'>{timesheet.title}</td>
                        <td style={{
                            color: timesheet.time_number > 8 ? 'green' : timesheet.time_number < 0 ? 'red' : 'black',
                            backgroundColor: timesheet.time_number > 8 ? '#e0f7e0' : timesheet.time_number < 0 ? '#f7e0e0' : '#f7e0e0',
                        }} className='p-2 text-left border border-blue-400'>{timesheet.task_name}</td>
                        <td style={{
                            color: timesheet.time_number > 8 ? 'green' : timesheet.time_number < 0 ? 'red' : 'black',
                            backgroundColor: timesheet.time_number > 8 ? '#e0f7e0' : timesheet.time_number < 0 ? '#f7e0e0' : '#f7e0e0',
                        }} className='p-2 text-left border border-blue-400'>{timesheet.date}</td>
                        <td style={{
                            color: timesheet.time_number > 8 ? 'green' : timesheet.employee_hours < 0 ? 'red' : 'black',
                            backgroundColor: timesheet.time_number > 8 ? '#e0f7e0' : timesheet.employee_hours < 0 ? '#f7e0e0' : '#f7e0e0',
                        }} className='p-2 text-left border border-blue-400'>{timesheet.employee_hours}</td>
                        <td style={{
                            color: timesheet.time_number > 8 ? 'green' : timesheet.time_number < 0 ? 'red' : 'black',
                            backgroundColor: timesheet.time_number > 8 ? '#e0f7e0' : timesheet.time_number < 0 ? '#f7e0e0' : '#f7e0e0',
                        }} className='p-2 text-left border border-blue-400'>{timesheet.time_number}</td>
                        <td style={{
                            color: timesheet.time_number > 8 ? 'green' : timesheet.time_number < 0 ? 'red' : 'black',
                            backgroundColor: timesheet.time_number > 8 ? '#e0f7e0' : timesheet.time_number < 0 ? '#f7e0e0' : '#f7e0e0',
                        }} className='p-2 text-left border border-blue-400'>{timesheet.description}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default TimesheetSearch;
