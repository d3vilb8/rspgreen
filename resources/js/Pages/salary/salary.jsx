import Header from "@/Layouts/Header";
import SalaryGenerator from "./salarygenerator";
import SalaryList from "./salarylist";
import Nav from "@/Layouts/Nav";

const SalaryPage = ({ salary, notif, user, user_type }) => {
    return (
        <div className="w-[85.2%] ml-[11.5rem]">
            <Header user={user} notif={notif} />
            <Nav user_type={user_type} />
            <div className="px-[5rem] py-4 absolute right-0 left-[12rem] table-section rounded-b-md">
                <div className="flex space-x-4">
                    <SalaryGenerator />
                    <SalaryList salary={salary} />
                </div>
            </div>
        </div>
    );
};

export default SalaryPage;
