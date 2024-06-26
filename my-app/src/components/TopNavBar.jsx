import { useSession, signOut } from 'next-auth/react';
import { RiLogoutBoxLine } from 'react-icons/ri';
import { IoPersonCircleOutline } from 'react-icons/io5';
import { AiOutlineHome, AiOutlineAppstoreAdd, AiOutlineFileDone, AiOutlineBars } from 'react-icons/ai';
import {BiSolidDownArrow} from 'react-icons/bi';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, {useState} from 'react';

const styles = {
    userProfile: {
        marginBottom: '1rem',
    },
    pfp: {
        marginRight: '0.5rem',
    },
    navBarButton: {
        width: '100%',
        // fontSize: '1.1rem',
        fontWeight: 'bold',
        textAlign: 'left',
        marginTop: '0.5rem',
        marginBottom: '0.5rem',
    }
};

const staffSidebarItems = [
    {
        name: 'Home',
        href: '/',
        icon: AiOutlineHome
    },
    {
        name: 'View Listings',
        href: '/roles/listings',
        icon: AiOutlineBars
    },
    {
        name: 'Candidate Hub',
        href: '/staff/candidateHub',
        icon: IoPersonCircleOutline
    }
];

const hrSidebarItems = [
    {
        name: 'Home',
        href: '/',
        icon: AiOutlineHome
    },
    {
        name: 'View Listings',
        href: '/roles/listings',
        icon: AiOutlineBars
    },
    {
        name: 'Create Listing',
        href: '/roles/create-listing',
        icon: AiOutlineAppstoreAdd
    }
];

export default function Component() {
    const { data, status } = useSession();
    let name = data.name;
    let roleArr = ['Staff', 'Manager', 'HR'];
    let role = roleArr[data.role];
    console.log("path", useRouter().pathname);

    const [showDropdown, setShowDropdown] = useState(false);
    return(
        <div className='grid grid-cols-5'>
            <div className='col-span-1 flex items-center'>
                <div className="mr-auto">
                    <img src="/logo/default-logo.png" alt="logo" className="w-[150px]" />
                </div>
            </div>
            <div className='col-span-3 flex items-center justify-center'>
                <div className='flex items-center h-full justify-center'>
                    { 
                        (data.role === 2) ? (
                            hrSidebarItems.map((item, index) => (
                            <div key={index} className={`${useRouter().pathname === item.href ? 'text-[#E9EAFC] underline' : 'text-blurple font-bold text-[18px]'} py-2 px-4 mx-4 hover:text-[#1825B4] hover:bg-[#A5ACF3] hover:rounded-lg transition duration-200 ease-in-out`}>
                                <Link key={index} href={item.href}>{item.name}</Link>
                            </div>))
                        ) : 
                        (data.role === 0) ? (
                            staffSidebarItems.map((item, index) => (
                            <div key={index} className={`${useRouter().pathname === item.href ? 'text-[#E9EAFC] underline' : 'text-blurple font-bold text-[18px]'} py-2 px-4 mx-4 hover:text-[#1825B4] hover:bg-[#A5ACF3] hover:rounded-lg transition duration-200 ease-in-out`}>
                                <Link key={index} href={item.href}>{item.name}</Link>
                            </div>))
                        ) : null
                    }
                </div>
            </div>
            <div className='col-span-1 flex-col ml-auto items-center'>
                <div className='relative' id='user-profile'>
                    <div className={`${showDropdown ? 'bg-[#A5ACF3] rounded-lg' : ''} flex items-center align-middle cursor-pointer px-4 py-2 text-blurple`}
                        onMouseOver={() => setShowDropdown(true)}
                        onMouseOut={() => setShowDropdown(false)}
                    > 
                        <p><span className='font-bold'>{name}</span> </p>
                        &nbsp;
                        <BiSolidDownArrow />
                    </div>
                    <div 
                        className={`${showDropdown ? 'absolute w-full opacity-100' : 'w-full opacity-0'} transition-opacity duration-300`}
                        onMouseOver={() => setShowDropdown(true)}
                        onMouseOut={() => setShowDropdown(false)}
                    >
                        <button onClick={() => signOut()} 
                            className={`${showDropdown ? 'flex flex-row items-center justify-center px-4 py-2 w-full text-white bg-blurple text-sm rounded-b-sm border border-blurple hover:bg-transparent hover:text-blurple transition duration-200 ease-in-out shadow-md drop-shadow-md' : 'hidden'} `}>
                            <RiLogoutBoxLine className='mr-2' />
                            <p>Log Out</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}