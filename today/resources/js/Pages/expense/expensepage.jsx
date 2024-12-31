import Header from "@/Layouts/Header";
import ExpenseCreate from "./expensecreate";
import ProductServices from "./productservice";
import Nav from "@/Layouts/Nav";

const ExpenseCreatePage = ({user,notif,user_type}) => {
    return (
<div className="w-[85.2%] ml-[11.5rem] absolute right-0 overflow-hidden">
        <Header user={user} notif={notif} />
            <Nav user_type={user_type} />
        <div className="p-6 mx-auto max-w-7xl">
            <ExpenseCreate />
            <ProductServices />
        </div>
        </div>
    );
};

export default ExpenseCreatePage;
