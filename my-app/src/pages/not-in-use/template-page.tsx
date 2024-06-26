import React from 'react';
import Head from 'next/head';
import { useSession, signIn, signOut } from 'next-auth/react';
import SideNavBar from '../../components/SideNavBar'
import { useRouter } from 'next/router';

const styles= {
    pageContentContainer:{
        width: '80%'
    },
};

export default function Home() {
    const { data, status } = useSession();
    const router = useRouter();
    console.log("Session:", data);
    console.log("Status:", status);
    if (status === 'loading') {
        return (
            <main className='bg-white'>
                <h1> loading... please wait</h1>
            </main>
        );
    }
    else if (status === 'authenticated') {
        if (data.role === 2){
            return (
                <main className='bg-white'>
                    <Head>
                        <title>HR Page</title>
                    </Head>
                    {/* <div>
                        <h1> hi {data.user.name}</h1>
                        <img src={data.user.image} alt={data.user.name + ' photo'} />
                        <button onClick={signOut}>sign out</button>
                    </div> */}
                    <div className='flex flex-row'>
                        <div className='w-60'>
                            <SideNavBar/>
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
        } else if (data.role === 1){
            return (
                <main className='bg-white'>
                    <Head>
                        <title>Manager Page</title>
                    </Head>
                    {/* <div>
                        <h1> hi {data.user.name}</h1>
                        <img src={data.user.image} alt={data.user.name + ' photo'} />
                        <button onClick={signOut}>sign out</button>
                    </div> */}
                    <div className='flex flex-row'>
                        <div className='w-60'>
                            <SideNavBar/>
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
        } else if (data.role === 0) {
            return (
                <main className='bg-white'>
                    <Head>
                        <title>Staff Page</title>
                    </Head>
                    {/* <div>
                        <h1> hi {data.user.name}</h1>
                        <img src={data.user.image} alt={data.user.name + ' photo'} />
                        <button onClick={signOut}>sign out</button>
                    </div> */}
                    <div className='flex flex-row'>
                        <div className='w-60'>
                            <SideNavBar/>
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
    }
    else {
        router.push('/');
        return null;
    }
}