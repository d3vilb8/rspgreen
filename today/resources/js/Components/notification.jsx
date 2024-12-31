import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the context
export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        // Fetch notifications from the API
        const fetchNotifications = async () => {
            try {
                const response = await axios.get('/notif');
                setNotifications(response.data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
    }, []);

    return (
        <NotificationContext.Provider value={notifications}>
            {children}
        </NotificationContext.Provider>
    );
};
