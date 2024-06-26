import { useSession, signOut } from 'next-auth/react';
import React from 'react';
import { RiLogoutBoxLine } from 'react-icons/ri';
import { IoPersonCircleOutline } from 'react-icons/io5';
import { AiOutlineHome, AiOutlineAppstoreAdd, AiOutlineBars } from 'react-icons/ai';
import Link from 'next/link';
import { useRouter } from 'next/router';

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

    return(
        <div className='flex flex-col h-full fixed justify-center'>
            <div className='flex flex-col justify-between h-[55vh] p-2 border border-slate-200 rounded-lg'>
                {/* //todo
                1. User Profile
                2. Tools
                3. log out/ darkmode */}
                <div className="px-1">
                    <div className='flex flex-row m-4' id='user-profile'>
                        <div className='w-10 h-10 bg-blurple text-white flex items-center justify-center rounded-lg' style={ styles.pfp }> {name[0]}</div>
                        <div> 
                            <p className='font-bold'>{name}</p>
                            <p className="text-xs font-normal">{role}</p>
                        </div>
                    </div>
                    <div className="border " />
                    <div>
                        {role === 'Staff' ? (
                            staffSidebarItems.map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <Link key={index} href={item.href} className={`flex w-max px-5 py-2 rounded-lg ${useRouter().pathname === item.href ? 'bg-blurple text-white' : 'hover:bg-[rgb(0,0,0,0.05)]'} transition duration-200 ease-in-out`} style={styles.navBarButton}>
                                        <Icon size={20} className='mr-4' />
                                        <p>{item.name}</p>
                                    </Link>
                                );
                            })
                        ) : (
                            hrSidebarItems.map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <Link key={index} href={item.href} className={`flex w-max px-5 py-2 rounded-lg ${useRouter().pathname === item.href ? 'bg-blurple text-white' : 'hover:bg-[rgb(0,0,0,0.05)]'} transition duration-200 ease-in-out`} style={styles.navBarButton}>
                                        <Icon size={20} className='mr-4' />
                                        <p>{item.name}</p>
                                    </Link>
                                );
                            })
                        )}
                    </div>
                </div>

                <div className="px-1">
                    <div className="border " />
                    <button className='flex w-max px-5 py-2 rounded-lg hover:bg-blurple hover:text-white transition duration-200 ease-in-out' style={ styles.navBarButton } onClick={signOut}>
                        <span>
                            <RiLogoutBoxLine size={20} className='mr-4'/> 
                        </span>
                        <span>
                            Logout
                        </span>
                    </button>
                </div>
            </div>
        </div>
    )
}