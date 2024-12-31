import React, { useState, useEffect, useRef } from 'react';
import { IoIosNotificationsOutline } from "react-icons/io";
import { FaRegUserCircle } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import { BiTask } from 'react-icons/bi';
import { FaX } from 'react-icons/fa6';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { FaUserCog } from "react-icons/fa";

const Header = ({ user, notif }) => {
    const [notifyModal, setNotifyModal] = useState(false);
    const [profile, setProfile] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef(null);  // Ref for profile dropdown
    const notificationRef = useRef(null);  // Ref for notification dropdown

    useEffect(() => {
        const countUnread = notif?.filter(notification => !notification.read_at).length || 0;
        setUnreadCount(countUnread);
    }, [notif]);

    const handleNotificationClick = async (notificationId) => {
        try {
            await axios.post(`readta/${notificationId}`);
            setUnreadCount(prevCount => Math.max(prevCount - 1, 0));
        } catch (error) {
            console.error('Error marking notification as read', error);
        }
    };

    // Handle click outside of both dropdowns to close them
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                (dropdownRef.current && !dropdownRef.current.contains(event.target)) &&
                (notificationRef.current && !notificationRef.current.contains(event.target))
            ) {
                setProfile(false);  // Close profile dropdown
                setNotifyModal(false);  // Close notification modal
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Toggle notification modal and ensure profile dropdown is closed
    const toggleNotification = (e) => {
        e.stopPropagation();  // Prevent propagation to the body or other handlers
        setNotifyModal(prev => !prev);
        setProfile(false);  // Close profile dropdown when notification is opened
    };

    // Toggle profile dropdown and ensure notification modal is closed
    const toggleProfile = (e) => {
        e.stopPropagation();  // Prevent propagation to the body or other handlers
        setProfile(prev => !prev);
        setNotifyModal(false);  // Close notification modal when profile is opened
    };
    const { props } = usePage();
    console.log(props);
    return (
        <div className='w-[100%] bg-[#fff] shadow-md p-2'>
            {props.auth.user.roles[0]?.name !== "admin" && !props.auth.user.is_exe_login && (
                <div className="fixed flex items-center justify-center inset-0 z-50 bg-black/30 backdrop-blur-sm">
                    <div className="max-w-xl py-4 bg-white px-6 rounded">
                        <div className="text-2xl text-amber-600 font-bold flex justify-center">
                            !! Attention !!
                        </div>
                        <div className="py-6 space-y-3 text-center">
                            <h1 className="font-medium text-gray-600">
                                Please Login to the software or download and
                                install into your machine and refresh the page!
                            </h1>
                            <p className="font-medium text-gray-600">
                                <a download={'RSP Employee'}
                                    href="/software/rsp.msix"
                                    className="text-blue-500 underline"
                                >
                                    Click Here
                                </a>{" "}
                                To Download
                            </p>
                        </div>
                    </div>
                </div>
            )}
            <div className='flex justify-end p-2 nav header'>
                <div className="flex space-x-7">
                    <div className='grid place-items-center'>
                        {/* Notification Button */}
                        <button className='relative' onClick={toggleNotification}>
                            <IoIosNotificationsOutline className={`text-[1.5rem] ${unreadCount > 0 ? '' : ''}`} />
                            {unreadCount > 0 && (
                                <span className='absolute top-0 w-4 h-4 text-[0.6rem] text-white bg-red-500 border border-white rounded-full right-1 grid place-items-center'>
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {/* Notification Modal */}
                        <div ref={notificationRef} className={`fixed top-0 z-30 right-0 border flex justify-end border-gray-300 w-full h-full bg-black/60 transition-all duration-300 ${notifyModal ? 'opacity-100 pointer-events-auto' : 'opacity-0 delay-300 pointer-events-none'}`}>
                            <div className='bg-white scrollbar-thumb-sky-700 scrollbar-track-white'>
                                <div className='flex items-center justify-between px-2 py-3'>
                                    <h1 className='text-xl font-semibold'>Notifications</h1>
                                    <button onClick={toggleNotification}><FaX size={16} /></button>
                                </div>
                                <div className='h-[30rem] w-[20rem] space-y-3 overflow-y-scroll bg-white scrollbar-thin scrollbar-thumb-sky-700 scrollbar-track-white'>
                                    {notif?.map(nofit => (
                                        <a
                                            key={nofit.id}
                                            onClick={() => handleNotificationClick(nofit.id)}
                                            href={nofit.data.url}
                                            className='flex items-center w-full p-2.5 gap-x-4 hover:bg-gray-100 shadow-md shadow-gray-200 rounded'
                                        >
                                            <div className='border border-gray-200 p-1.5 rounded-full'>
                                                <BiTask size={18} className='text-green-500' />
                                            </div>
                                            <div className='flex flex-col'>
                                                <span className='text-sm font-medium text-gray-800'>{nofit.data.project}</span>
                                                <span className='font-semibold text-blue-500'>{nofit.data.employee_id}</span>
                                                <span className='text-sm text-gray-700'>{nofit.data.message}</span>
                                            </div>
                                            {!nofit.read_at && (
                                                <span className='bg-red-500 w-1.5 h-1.5 rounded-full ml-auto'></span>
                                            )}
                                        </a>
                                    ))}
                                </div>
                                <div className='p-5'>
                                    <Link href="/notifications-get" className='flex items-center justify-center w-full py-2 text-sm text-center text-white bg-blue-500 rounded'>
                                        <IoIosNotificationsOutline className='text-[1.5rem]' />
                                        <span>See All Notifications</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Button */}
                    <div className='flex space-x-2 cursor-pointer' onClick={toggleProfile}>
                        <span className="grid place-items-center"><FaRegUserCircle className='text-[1.5rem]' /></span>
                        <span className='text-[1rem]'>{user}</span>
                    </div>

                    {/* Profile Dropdown */}
                    <div className='relative grid place-items-center'>
                        <div ref={dropdownRef} className={`absolute top-full p-4 -right-5 my-5 border border-gray-300 rounded w-[10rem] bg-white shadow-lg transition-all duration-300 shadow-zinc-800/50 ${profile ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none translate-y-14'}`}>
                            <div>
                                <li className='p-2 text-black list-none flex space-x-2'>
                                    <span className='grid place-items-center'><FaUserCog /></span>
                                    <span><Link href="/profile">Profile</Link></span>
                                </li>
                                <li className='p-2 text-black list-none'>
                                    <ResponsiveNavLink method="post" href={route('logout')} as="button" className='flex space-x-2'>
                                        <span className='grid mt-1 place-items-center'><LuLogOut /></span>
                                        <span>Log Out</span>
                                    </ResponsiveNavLink>
                                </li>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
