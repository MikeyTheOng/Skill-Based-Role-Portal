import Head from 'next/head';
import React from 'react';
import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

// Components
import SideNavBar from '../../../components/SideNavBar'
import RoleListingForm from '../../../components/UpdateRoleListingForm';

const styles= {
    pageContentContainer:{
        width: '100%'
    },
};

export default function UpdateListing() {
    const tcssStyles = {
        formHeader: 'text-3xl font-semibold text-slate-600 px-4 pt-4',
        subtitle: 'text-slate-600/80 text-sm font-normal mb-5 px-4',
        inputFieldGap: 'mt-4',
        inputFieldError: 'text-red-500 text-sm mb-4',
        label: 'text-slate-600 font-semibold',
        textField: 'border border-slate-200 rounded-md p-2 w-full focus:outline-blurple',
        addSkillButton:'flex justify-center items-center mx-1 px-4 py-0.5 text-slate-400 border border-slate-400 rounded-lg bg-slate-200',
        submitButton: 'bg-blurple text-white font-semibold rounded-lg px-6 py-2 mt-4 border border-blurple hover:bg-transparent hover:border-blurple hover:text-blurple transition duration-200 ease-in-out',
        resetButton: 'bg-white text-slate-400 font-semibold rounded-lg px-6 py-2 mt-4 border border-slate-400 hover:bg-red-100 hover:border-red-700 hover:text-red-700 transition duration-200 ease-in-out',
        dropdownButtonClosed : 'w-full text-left pl-3 py-2 border border-slate-200 rounded-md',
        dropdownButtonOpen : 'w-full text-left pl-3 py-2 border-2 border-blurple rounded-md outline-blurple',
    };
    const { data, status } = useSession();
    // console.log("Session:", data);
    // console.log("Status:", status);
    
    const router = useRouter();
    const listing_id = router.query.id;
    // keeps track of whether listing_id exists
    const [isValidListingID, setIsValidListingID] = useState(true);
    // const [isConfirmationModal, setIsConfirmationModal] = useState(false);
    if (status === 'loading') {
        return (
            <main className='bg-white'>
                <h1> loading... please wait</h1>
            </main>
        );
    } else if (status === 'authenticated') {
        if (data.role === 2){
            if (isValidListingID) {
                return (
                    <main className='bg-white'>
                        <Head>
                            <title>Update Listing</title>
                        </Head>
            
                        <div className='flex flex-row w-full'>
                            <div className='w-60'>
                                <SideNavBar/>
                            </div>
                            <div className='lex flex-row w-full justify-center'>
                                <div className='h-full px-10 py-4' style={ styles.pageContentContainer }>
                                    <div className='ml-8'>
                                        <h1 className={`${tcssStyles['formHeader']}`}>
                                            Edit Role Listing 
                                        </h1>
                                        <p className={`${tcssStyles['subtitle']}`}>
                                            (Listing ID: {listing_id})
                                        </p>
                                    </div>
                                    <div className='ml-8'>
                                        <RoleListingForm setIsValidListingID={setIsValidListingID} tcssStyles={tcssStyles}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                );
            } else {
                return(
                    <main className='bg-white'>
                        <Head>
                            <title>Listing Does Not Exist</title>
                        </Head>
                        <div className='w-full h-full'>
                            <div className='flex justify-center mt-12'>
                                <div className='shadow shadow-slate-600/50 border border-slate-600/40 rounded-lg p-8 flex justify-center'>
                                    <div>
                                        <h1 className={`${tcssStyles['formHeader']} text-center mb-2`}> Listing Does Not Exist</h1>
                                        <div className='flex justify-center'>
                                            <button 
                                                onClick={() => {router.push('/')}}
                                                className='px-6 py-2 bg-red-100 border border-transparent text-red-700 font-bold rounded-lg hover:bg-red-700 hover:text-red-100 hover:border-red-100 transition duration-200 ease-in-out'
                                            >
                                                Return to Home
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                );
            }
        } else {
            return (
                <main className='bg-white'>
                    <Head>
                        <title>Access Denied</title>
                    </Head>
                    <div className='w-full h-full'>
                        <div className='flex justify-center mt-12'>
                            <div className='shadow shadow-slate-600/50 border border-slate-600/40 rounded-lg p-8 flex justify-center'>
                                <div>
                                    <h1 className={`${tcssStyles['formHeader']} text-center mb-2`}> Access Denied</h1>
                                    <div className='flex justify-center'>
                                        <button 
                                            onClick={() => {router.push('/')}}
                                            className='px-6 py-2 bg-red-100 border border-transparent text-red-700 font-bold rounded-lg hover:bg-red-700 hover:text-red-100 hover:border-red-100 transition duration-200 ease-in-out'
                                        >
                                            Return to Home
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            );
        }
    } else {
        router.push('/api/auth/signin');
        return null;
    }
}