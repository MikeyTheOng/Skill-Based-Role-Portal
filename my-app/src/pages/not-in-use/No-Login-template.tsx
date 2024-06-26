import Head from 'next/head';
import React from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import SideNavBar from '../../components/SideNavBar'
import { useRouter } from 'next/router';

const styles= {
    pageContentContainer:{
        width: '80%'
    },
};

export default function Home() {
    return (
        <main className='bg-white'>
            <Head>
                <title>No-Login Page</title>
            </Head>
            {/* <div>
                <h1> hi {data.user.name}</h1>
                <img src={data.user.image} alt={data.user.name + ' photo'} />
                <button onClick={signOut}>sign out</button>
            </div> */}
            <div className='flex flex-row'>
                <div className='w-60'>
                    {/* <SideNavBar/> */}
                </div>
                <div className='flex flex-row justify-center'>
                    <div className='border border-slate-200 h-full' style={ styles.pageContentContainer }>
                        <div className='m-5'>
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eius, laboriosam natus a optio nam vel animi, distinctio ratione corrupti iure non ut possimus perspiciatis, inventore consectetur ipsam explicabo dicta similique.
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}