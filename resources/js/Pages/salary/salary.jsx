import React, { useState } from "react";
import Header from "@/Layouts/Header";
import Nav from "@/Layouts/Nav";
import SalaryModal from "./SalaryModal";
import AllowanceComponent from "./allowance";
import LoanComponent from "./Loan";
import CommissionComponent from "./Commission";
import OvertimeComponent from "./Overtime";

const SalaryPage = ({ salary, notif, user, user_type }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [employeeSalaries, setEmployeeSalaries] = useState([
        { payslipType: "Monthly", salary: 350 },
    ]);
    const [allowances, setAllowances] = useState([
        {
            employeeName: "demo",
            allowanceOption: "Alexandra Hewitt",
            title: "Facilis id voluptatu",
            type: "Fixed",
            amount: "₹71.00",
        },
    ]);

    const handleModalOpen = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleSave = (data) => {
        setEmployeeSalaries([...employeeSalaries, data]);
        handleModalClose();
    };

    // const handleP

    // const handleAutosave = () =>{
    //     setCommistion
    // }

    return (
        <div className="w-[85.2%] ml-[11.5rem]">
            <Header user={user} notif={notif} />
            <Nav user_type={user_type} />
            <div className="px-[5rem] py-4 absolute right-0 left-[12rem]">
                <div className="grid grid-cols-2 gap-6">
                    {/* Employee Salary Card */}
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">
                                Employee Salary
                            </h2>
                            <button
                                className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center"
                                onClick={handleModalOpen}
                            >
                                +
                            </button>
                        </div>
                        <div className="text-sm">
                            {employeeSalaries.map((salary, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between py-2"
                                >
                                    <span className="font-medium">
                                        {salary.payslipType}
                                    </span>
                                    <span>{salary.salary}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Allowance Table Card */}
                    <AllowanceComponent />
                </div>

                <div className="grid grid-cols-2 gap-6 py-4">
                    {/* Commission Table Card */}
                    <CommissionComponent />
                    {/* Loan Table Card */}
                    <LoanComponent />
                </div>
                <div className="grid grid-cols-2 gap-6 py-4">
                    {/* Overtime Table Card */}
                    <OvertimeComponent />
                </div>
            </div>

            {/* Salary Modal */}
            <SalaryModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onSave={handleSave}
                payslipOptions={["Monthly", "Weekly", "Daily"]}
            />
        </div>
    );
};

export default SalaryPage;
