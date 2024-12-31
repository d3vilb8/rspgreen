import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import Header from '@/Layouts/Header'
import Nav from '@/Layouts/Nav'

function taskcalendar({ notif, usrrr, user_type, user,events }) {
    return (
        <div className='w-[85.2%] ml-[11.5rem]'>
            <Header user={user} notif={notif} />
            <Nav user_type={user_type} usrrr={usrrr} />
            <div className="w-full px-9">
                <div className='flex justify-between items-center'>
                    <h1 className='text-xl'>Task Calendar</h1>
                </div>
                <div className='pt-10'>
                    <FullCalendar
                        plugins={[dayGridPlugin]}
                        initialView="dayGridMonth"
                        events={events.map((ev,i)=>({
                            title:ev.task_name,
                            start:ev.sdate,
                            end:ev.edate,
                            description:ev.title
                        }))}
                        eventContent={(eventInfo) => (
                            <>
                                <b>{eventInfo.event.title}</b>
                                <p>{eventInfo.event.extendedProps.description}</p>
                            </>
                        )}
                    />
                </div>
            </div>
        </div>
    )
}

export default taskcalendar