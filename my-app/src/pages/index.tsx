import React from 'react';
import Head from 'next/head';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

const styles= {
    landingeDiv:{
        backgroundImage: 'linear-gradient(to bottom, #9ca4ed, #b0b5f1, #c3c7f5, #d6d8f9, #e9eafc)'
    },
    contentDiv: {
        backgroundImage: 'url("/images/blurry-gradient-haikei.png")',
        backgroundSize: 'cover',      // Cover the entire container
        backgroundRepeat: 'no-repeat', // No image repetition
        backgroundPosition: 'center',  // Center the image
        width: '100%',                 // Set the width to 100% of the container
        // height: '100%',                // Set the height to 100% of the container
    },
    pageContentContainer:{
        // width: '80%'
    },
};

export default function Home() {
    const { data, status } = useSession();
    const router = useRouter();
    // console.log("Session:", data);
    // console.log("Status:", status);

    if (status === 'loading') {
        return (
            <main className='bg-white'>
                <h1> loading... please wait</h1>
            </main>
        );
    }
    else if (status === 'authenticated') {
        if (data.role === 2){
            router.push('/home/hr')
            return null;
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
        } else if (data.role === 0) {
            router.push('/home/staff')
            return null;
        }
    }
    else {
        router.push('/api/auth/signin');
        return null;
    }
}