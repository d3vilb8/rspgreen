import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Head } from '@inertiajs/react';
import Header from "@/Layouts/Header.jsx";
import Nav from "@/Layouts/Nav.jsx";

export default function Edit({ auth, mustVerifyEmail, status,header, children,user,usrrr,notif,user_type }) {
    return (
        <div className='w-[85.2%] absolute right-0 overflow-hidden'>
            <Header user={user} notif={notif}/>
            <Nav user_type={user_type} usrrr={usrrr}/>
            <div className='flex px-5 py-5 space-x-2'>


                <div className="grid  place-items-center">
                    <div className="mx-auto space-y-6 max-w-7xl sm:px-6 lg:px-8">
                        <div className="p-4 bg-white shadow sm:p-8 dark:bg-gray-100 sm:rounded-lg">
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                className="max-w-xl"
                            />
                        </div>

                        <div className="p-4 bg-black shadow sm:p-8 dark:bg-gray-100 sm:rounded-lg">
                            <UpdatePasswordForm className="max-w-xl" />
                        </div>

                        <div className="p-4 bg-white shadow sm:p-8 dark:bg-gray-100 sm:rounded-lg">
                            <DeleteUserForm className="max-w-xl" />
                        </div>
                    </div>
                </div>

            </div>
        </div>

    );
}
