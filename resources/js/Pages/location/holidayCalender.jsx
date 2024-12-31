import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import axios from 'axios';
import Header from '@/Layouts/Header';
import Nav from '@/Layouts/Nav';

function HolidayCalendar({ notif, usrrr, user_type, user, location, holidays, locations }) {
    const [calendarHolidays, setCalendarHolidays] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(location || '');
    const [locationList, setLocationList] = useState(locations || []);  // Ensure locations are passed correctly

    console.log("Selected Location:", selectedLocation);

    useEffect(() => {
        // Function to fetch holidays from backend
        const fetchHolidays = async () => {
            try {
                const response = await axios.get('/holidays-calender', {
                    params: { location: selectedLocation }, // Send selected location to API
                });
    
                const formattedHolidays = response.data.holidays.map((holiday) => ({
                    title: holiday.name,
                    start: holiday.start_date,
                    // Add one day to the end date to make it inclusive
                    end: new Date(new Date(holiday.end_date).setDate(new Date(holiday.end_date).getDate() + 1)).toISOString().split('T')[0],
                    description: holiday.description || 'No description available',
                }));
    
                setCalendarHolidays(formattedHolidays); // Update state with holidays
            } catch (error) {
                console.error('Error fetching holidays:', error);
            }
        };
    
        // Fetch holidays if selected location changes
        if (selectedLocation) {
            fetchHolidays();
        }
    }, [selectedLocation]); // Re-run when selectedLocation changes
    
    useEffect(() => {
        // If holidays are passed via props, filter based on location
        if (holidays && holidays.length > 0) {
            const filteredHolidays = holidays
                .filter((holiday) => holiday.location === selectedLocation || !selectedLocation)
                .map((holiday) => ({
                    title: holiday.name,
                    start: holiday.start_date,
                    // Add one day to the end date to make it inclusive
                    end: new Date(new Date(holiday.end_date).setDate(new Date(holiday.end_date).getDate() + 1)).toISOString().split('T')[0],
                    description: holiday.description || 'No description available',
                }));
    
            setCalendarHolidays(filteredHolidays);
        }
    }, [holidays, selectedLocation]); // Re-run when holidays or selectedLocation changes
      // Re-run when holidays or selectedLocation changes

    return (
        <div className="w-[85.2%] ml-[11.5rem]">
            <Header user={user} notif={notif} />
            <Nav user_type={user_type} usrrr={usrrr} />
            <div className="w-full px-9 py-6 bg-gray-50 min-h-screen">
                <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800" style={{ marginLeft: "20px" }}>
  Holiday Calendar
</h1>

                    <div className="flex items-center">
                        <label htmlFor="location-select" className="mr-2 text-gray-700">Select Location:</label>
                        <select
                            id="location-select"
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}  // Update selected location
                            className="border px-3 py-2 rounded-lg text-gray-700 focus:ring focus:ring-blue-300"
                        >
                            <option value="">--Select Location--</option>
                            {locationList.map((loc, index) => (
                                <option key={index} value={loc}>{loc}</option>  // Display locations in dropdown
                            ))}
                        </select>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <FullCalendar
                        plugins={[dayGridPlugin]}
                        initialView="dayGridMonth"
                        events={calendarHolidays}  // Pass the holidays as events to the calendar
                        eventContent={(eventInfo) => (
                            <div className="text-sm">
                                <strong>{eventInfo.event.title}</strong>
                                {eventInfo.event.extendedProps.description && (
                                    <p className="text-gray-500">{eventInfo.event.extendedProps.description}</p>
                                )}
                            </div>
                        )}
                    />
                </div>
            </div>
        </div>
    );
}

export default HolidayCalendar;
