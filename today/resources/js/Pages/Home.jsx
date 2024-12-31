// import Header from '@/Layouts/Header';
import Header from '@/Layouts/Header';
import Nav from '@/Layouts/Nav';
import React from 'react';

const Home = ({ user }) => {
    return (
        // <Header />remrem]
        <div className='px-[8rem]'>
            <Header user={user} />
            <Nav />
        </div>
    )
}

export default Home;