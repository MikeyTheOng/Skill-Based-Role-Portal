import Head from 'next/head';
import React, { useState, useEffect } from "react";
import { useSession, signIn, signOut } from 'next-auth/react';
import SideNavBar from '../../components/SideNavBar'
import { useRouter } from 'next/router';
import Link from 'next/link';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import ReactPaginate from 'react-paginate';
import {formatDateWithoutTime, validateGreaterTodayDate} from '../../utils/utils.js'
import DropdownCheckboxMenu from '../../components/filterMenu';
import { Divider, Space, Tag } from 'antd';
import BackButton from '../../components/backButton'
import axios from 'axios';

const styles= {
    pageContentContainer:{
        width: '80%'
    },
};




// functions for all
function getColorByPercentage(percentage) {
    if (percentage >= 0 && percentage < 30) {
        return '#dee0fc';
    } else if (percentage >= 30 && percentage <= 70) {
        return '#9ba3f7'
    } else {
        return '#5865f2'; 
    }
}

function MoreDetails(props) {
    const handleButtonClick = () => {
        window.location.href = `/roles/listingDetails?listingID=${props.listingID}`;
    };
    return (
      <button
        className='rounded-lg mt-6 mb-2 py-2 px-4 border border-black border-opacity-80 bg-transparent hover:bg-black hover:text-white transition duration-300 ease-in-out'
        onClick={handleButtonClick} 
      >
        View Details
      </button>
    );
}

// hr functions
function HrCard(props) {
    const start_date = formatDateWithoutTime(props.startDate);
    const end_date = formatDateWithoutTime(props.endDate);

    return (
        <div className="card border-2 rounded-sm p-6 flex flex-row">
            <div className='w-full'>
                <p className='text-sm' data-testid={`listingId${props.listingID}`}>Listing ID {props.listingID}</p>
                <h2 className='text-xl font-bold my-2' data-testid={`listingName${props.listingID}`}>{props.title}</h2>
                <p className='flex items-center'>
                    <span className='mr-6 flex items-center'>
                        <img className='w-5 h-5 mr-2' src="https://img.icons8.com/windows/32/average-2.png" alt="average-2"/>
                        <span data-testid={`listingSalary${props.listingID}`}>{props.salary}</span>
                    </span>
                    <span className='flex items-center'>
                        <img className='w-4 h-4 mr-2' src="https://img.icons8.com/material-outlined/24/department.png" alt="department"/>
                        <span data-testid={`listingDept${props.listingID}`}>{props.department}</span>
                    </span>
                </p>
                <p className='mt-3' data-testid={`listingStartDate${props.listingID}`}><span className='font-bold'>Application Start Date: </span>{start_date}</p>
                <p data-testid={`listingEndDate${props.listingID}`}><span className='font-bold'>Application Deadline: </span>{end_date}</p>
                <MoreDetails
                    listingID={props.listingID}
                />
            </div>
        </div>
    );
};

// staff functions
function StaffCard(props) {
    const end_date = formatDateWithoutTime(props.endDate);

    const matchingPercentage = props.matchingPercentage;
    const color = getColorByPercentage(matchingPercentage);

    return (
        <div className="card border-2 rounded-sm my-6 p-6 flex flex-row">
            <div className='w-full'>
                <p className='text-sm'  data-testid={`listingId${props.listingID}`}>Listing ID {props.listingID}</p>
                <h2 className='text-xl font-bold my-2' data-testid={`listingName${props.listingID}`}>{props.title}</h2>
                <p className='flex items-center'>
                    <span className='mr-6 flex items-center'>
                        <img className='w-5 h-5 mr-2' src="https://img.icons8.com/windows/32/average-2.png" alt="average-2"/>
                        <span data-testid={`listingSalary${props.listingID}`}>{props.salary}</span>
                    </span>
                    <span className='flex items-center'>
                        <img className='w-4 h-4 mr-2' src="https://img.icons8.com/material-outlined/24/department.png" alt="department"/>
                        <span data-testid={`listingDept${props.listingID}`} >{props.department}</span>
                    </span>
                </p>
                <p className='mt-3' data-testid={`listingEndDate${props.listingID}`}><span className='font-bold'>Application Deadline: </span>{end_date}</p>
                <MoreDetails
                    listingID={props.listingID}
                />
            </div>
            <div className='items-center text-center flex mr-4'>
                <div>
                    <p className=''>Skill Match</p>
                    <CircularProgressbar 
                        className='w-40 h-40 items-center' 
                        value={props.matchingPercentage}
                        text={`${props.matchingPercentage}%`} 
                        styles={buildStyles({
                            textColor: '#000000',
                            textSize: '12px',
                            pathColor: color, 
                            trailColor: '#d6d6d6',
                            backgroundColor: '#3e98c7',
                        })}
                    />
                </div>
            </div>
        </div>
    );
};

export default function Home() {// session data
    // const { data, status } = useSession();
    // console.log("Session:", data);
    // console.log("Status:", status);

    const session = useSession();
    const [data, setData] = useState(null);
    const [status, setStatus] = useState(session.status);
    // useEffect(() => {
    //     console.log("Status:", status);
    // }, [status])
    useEffect(()=>{
        setStatus(session.status);
    }, [session])
    useEffect(() => {
        if (session.status === 'authenticated') {
            setData(session.data);
        }
    }, [status])

    const router = useRouter();

     // State variable to hold the search query.
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

     // Function to handle the search query input changes.
    const handleSearchChange = (event) => {
        // performSearch();
        let inputSearchQuery = event.target.value;

        setSearchQuery(inputSearchQuery);
    };

    // console.log("Search Results:", searchQuery ) // data passed through searchQuery

     // Function to perform the search when the user clicks the search button.
    const performSearch = () => {
        console.log("Search Query:", searchQuery);
        var trimmedSearchQuery = searchQuery.trim();

        if (trimmedSearchQuery === '') {
            setSearchListings(originalListings);
        } else {
            axios.get(`http://localhost:5002/search-roles?query=${trimmedSearchQuery}&role=${data.role}`)
                .then((response) => {
                    if (response.status === 200) {
                        // console.log("Search Response: ", response.data);                             
                        setSearchListings(response.data.roles);
                    } else {
                        console.error("Search request failed with status code:", response.status);
                        setSearchResults([]);
                    }
                })
                .catch((error) => {
                    if (error.response.status === 404) {
                        console.log("No search results found.");
                        setSearchListings([]);
                    } else {
                        console.error("Error Response Data:", error.response);
                        console.error("An error occurred during the search request:", error);
                        setSearchResults([]);
                    }
                });
        }
    };

    // role skill
    const [roleSkills, setRoleSkills] = useState([]);

    useEffect(() => {
        fetch('http://127.0.0.1:5003/role_skill', {
        method: 'GET',
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.code === 200) {
                const skillsByListing = {};
                data.data.skills.forEach((skill) => {
                    const listingId = skill.listing_id;
                    const skillName = skill.skill;
                    if (!skillsByListing[listingId]) {
                    skillsByListing[listingId] = {
                        listing_id: listingId,
                        skills: [],
                    };
                    }
                    skillsByListing[listingId].skills.push(skillName);
                });
                const roleSkillsArray = Object.values(skillsByListing);
                setRoleSkills(roleSkillsArray);
            }
        })
        .catch((error) => {
            console.error(error);
        });
    }, []);
    
    // staff skill
    const [staffSkills, setStaffSkills] = useState([]);

    useEffect(() => {
    if (data) {
        fetch(`http://127.0.0.1:5005/get_all_staff_skills/${data.id}`, {
        method: 'GET',
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.code === 200) {
            // console.log(data.data); 
            setStaffSkills(data.data);
            }
        })
        .catch((error) => {
            console.error(error);
        });
    }
    }, [data]);

    // skill match percentage
    const calculateMatchingPercentage = () => {
        const matchingPercentages = []

        for (const role of roleSkills) {
            const roleSkillsCount = role.skills.length;
            const matchingSkills = staffSkills ? staffSkills.filter(skill =>
                role.skills.includes(skill.Skill_Name)
            ) : [];
            const matchingSkillsCount = matchingSkills.length;
            const matchingPercentage = (matchingSkillsCount / roleSkillsCount) * 100;
            matchingPercentages.push({
                roleId: role.listing_id,
                matchingPercentage: matchingPercentage.toFixed(0),
            });
        }
        return matchingPercentages;
    };




    const matchingPercentages = calculateMatchingPercentage();
    // console.log(matchingPercentages)

    // listing data
    const [originalListings, setOriginalListings] = useState([]);
    let [listings, setListings] = useState([]);
    const [searchListings, setSearchListings] = useState([]);
    const [filterListings, setFilterListings] = useState([]);
    useEffect(() => {
        if (originalListings.length > 0) {
            // console.log("Search Listings:", searchListings);
            // console.log("Filter Listings:", filterListings);
            // Find overlap between Search Listings and Filter Listings
            // Find common elements based on listing_id
            const commonListings = searchListings.filter(item1 => filterListings.some(item2 => item2.listing_id === item1.listing_id));
            console.log("Common Listings:", commonListings);

            // if Staff, sort the listings by matching percentage
            if (data.role == 2) {
                setListings(commonListings);
            } else if (data.role==0){
                const sortedListings = [...commonListings].sort((a, b) => {
                    const matchingPercentageA = matchingPercentages.find((percentage) => percentage.roleId === a.listing_id)?.matchingPercentage || 0;
                    const matchingPercentageB = matchingPercentages.find((percentage) => percentage.roleId === b.listing_id)?.matchingPercentage || 0;
                    return matchingPercentageB - matchingPercentageA;
                });
                setListings(sortedListings);
            }
        }
    }, [searchListings, filterListings, originalListings]);
    
    useEffect(() => {
        // console.log("listings:", listings);
    }, [listings]);

    useEffect(() => {
        if (data){
            if (data.role == 0){
                axios.get('http://localhost:5002/listing/active')
                .then((response) => {
                    // console.log("Response:", response.data.data.listings);
                    if (response.status === 200) {
                        // const matchingPercentages = calculateMatchingPercentage();
                        const unsortedListings = response.data.data.listings;
                        // const sortedListings = [...unsortedListings].sort((a, b) => {
                        //     const matchingPercentageA = matchingPercentages.find((percentage) => percentage.roleId === a.listing_id)?.matchingPercentage || 0;
                        //     const matchingPercentageB = matchingPercentages.find((percentage) => percentage.roleId === b.listing_id)?.matchingPercentage || 0;
                        //     return matchingPercentageB - matchingPercentageA;
                        // });
                        // setListings(sortedListings);
                        setOriginalListings(unsortedListings);
                        setSearchListings(unsortedListings);
                        setFilterListings(unsortedListings);
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
            }
            else if (data.role == 2){
                axios.get('http://localhost:5002/listing')
                .then((response) => {
                    if (response.status === 200) {
                        setListings(response.data.data.listings);
                        setOriginalListings(response.data.data.listings);
                        setSearchListings(response.data.data.listings);
                        setFilterListings(response.data.data.listings);
                    }
                })
            }
        }
    }, [data, roleSkills, staffSkills]);

    // pagination
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [subset, setSubset] = useState([]);
    useEffect(() => {
        const totalItems = listings.length;
        setPageCount(Math.ceil(totalItems / itemsPerPage));
        const startIndex = currentPage * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setSubset(listings.slice(startIndex, endIndex));
    }, [currentPage])
    useEffect(() => {
        const totalItems = listings.length;
        setPageCount(Math.ceil(totalItems / itemsPerPage));
        setCurrentPage(0);
        const startIndex = currentPage * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setSubset(listings.slice(startIndex, endIndex));
    }, [listings]);

    const updateListings = (newListings) => {
        setFilterListings(newListings);
        // const matchingPercentages = calculateMatchingPercentage();
        // const unsortedListings = newListings;
        // const sortedListings = [...unsortedListings].sort((a, b) => {
        //     const matchingPercentageA = matchingPercentages.find((percentage) => percentage.roleId === a.listing_id)?.matchingPercentage || 0;
        //     const matchingPercentageB = matchingPercentages.find((percentage) => percentage.roleId === b.listing_id)?.matchingPercentage || 0;
        //     return matchingPercentageB - matchingPercentageA;
        // })
        // setListings(sortedListings);
    };

    const handlePageClick = (selectedPage) => {
        console.log("Selected Page:", selectedPage);
        setCurrentPage(selectedPage.selected);
    };
    
    if (status === 'loading') {
        return (
            <main className='bg-white'>
                <h1> loading... please wait</h1>
            </main>
        );
    }
    else if (status === 'authenticated' && data) {
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
                    <div className='flex flex-row items-start w-screen'>
                        <div className='w-60 min-h-[500px] '>
                            <SideNavBar/>
                        </div>
                        <div className='flex justify-center w-full'>
                            <div className='h-full py-6' style={ styles.pageContentContainer }>
                                <div className='m-5 flex flex-col'>
                                    <div className='flex flex-row justify-between'>
                                        <div className='mr-20 flex w-full content-center'>
                                            {/* Step 5: Update the UI to display the search input field and search button. */}
                                            <div className="grow mr-1.5">
                                                <input
                                                    className='rounded-lg py-2 px-2 w-full border-2 focus:outline-none focus:ring focus:outline-blurple'
                                                    type="text"
                                                    placeholder="Search..."
                                                    value={searchQuery}
                                                    onChange={handleSearchChange}
                                                />    
                                            </div>
                                            <div>
                                                <button
                                                    className='rounded-lg px-4 py-2 bg-blurple text-white h-full mr-1 border border-transparent hover:bg-transparent hover:border-blurple hover:text-blurple transition duration-300 ease-in-out'
                                                    type="button" // Change to "button" to prevent form submission
                                                    onClick={performSearch}
                                                >
                                                    Search
                                                </button>
                                                <DropdownCheckboxMenu updateListings={updateListings} />    
                                            </div>
                                        </div>
                                        {/* <div className='w-1/6 flex'>
                                            <DropdownCheckboxMenu updateListings={updateListings} />
                                        </div> */}
                                        <div>
                                            <Link href="/roles/create-listing">
                                                <button className='rounded-lg w-24 p-2 bg-transparent text-blurple h-full border border-blurple hover:bg-blurple hover:border-blurple hover:text-white transition duration-300 ease-in-out'>Create</button>
                                            </Link>
                                        </div>
                                    </div>
                                    {listings.length === 0 ? (
                                        <p data-testid='noListing' className='h-screen flex items-center justify-center font-bold'>No role listings found.</p>
                                    ) : (
                                        <div >
                                            <p data-testid='listingCount' className='pt-7 opacity-70 mb-6'>Total Listings: {listings.length}</p>
                                            <div className='grid grid-cols-2 gap-4 mb-6'>
                                                {subset.map((listing) => (
                                                    <HrCard
                                                        key={listing.listing_id}
                                                        listingID={listing.listing_id} 
                                                        title={listing.role_name}
                                                        startDate={listing.start_date}
                                                        endDate={listing.end_date}
                                                        department={listing.dept}
                                                        salary={listing.salary}
                                                    />
                                                ))}
                                            </div>
                                         
                                            <ReactPaginate
                                                previousLabel={'<'}
                                                nextLabel={'>'}
                                                breakLabel={'...'}
                                                pageCount={pageCount}
                                                marginPagesDisplayed={2}
                                                pageRangeDisplayed={5}
                                                onPageChange={handlePageClick}
                                                containerClassName={'pagination flex justify-center items-center space-x-2'}
                                                activeClassName={'active border bg-blurple text-white font-bold rounded-lg'}
                                                pageClassName={'cursor-pointer px-3 py-2'}
                                                previousClassName={'cursor-pointer px-3 py-2'}
                                                nextClassName={'cursor-pointer px-3 py-2'}
                                            />
                                        </div>
                                    )} 
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
                    <div className='flex flex-row items-start w-screen'>
                        <div className='w-60 min-h-[500px] '>
                            <SideNavBar/>
                        </div>
                        <div className='flex justify-center w-full'>
                            <div className='h-full py-6' style={ styles.pageContentContainer }>
                                <div className='m-5 '>
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
                    <div className='flex flex-row items-start w-screen'>
                        <div className='w-60 min-h-[500px] '>
                            <SideNavBar/>
                        </div>
                        <div className='flex justify-center w-full'>
                            <div className='h-full py-6' style={ styles.pageContentContainer }>
                                <div className='m-5 flex flex-col'>
                                    <div className='flex flex-row justify-between items-center'>
                                        <div className='mr-4 flex w-full content-center'>
                                            {/* Step 5: Update the UI to display the search input field and search button. */}
                                            <div className="grow mr-1.5">
                                                <input
                                                    className='rounded-lg py-2 px-2 w-full border-2 focus:outline-none focus:ring focus:outline-blurple'
                                                    type="text"
                                                    placeholder="Search..."
                                                    value={searchQuery}
                                                    onChange={handleSearchChange}
                                                />    
                                            </div>
                                            <div>
                                                <button
                                                    className='rounded-lg px-4 py-2 bg-blurple text-white h-full mr-1'
                                                    type="button" // Change to "button" to prevent form submission
                                                    onClick={performSearch}
                                                >
                                                    Search
                                                </button>
                                                <DropdownCheckboxMenu updateListings={updateListings} />    
                                            </div>
                                        </div>
                                        {/* <div className='w-1/6 flex justify-end'>
                                            <DropdownCheckboxMenu updateListings={updateListings} />
                                        </div> */}
                                    </div>
                                    {listings.length === 0 ? (
                                        <p data-testid='noListing' className='h-screen flex items-center justify-center font-bold'>No role listings found.</p>
                                    ) : (
                                        <div>
                                            <p data-testid='listingCount' className='pt-7 opacity-70'>Total Listings: {listings.length}</p>
                                            <div className='flex-col in-block'>
                                                {subset.map((listing) => {
                                                    return (
                                                        <StaffCard
                                                            key={listing.listing_id}
                                                            listingID={listing.listing_id}
                                                            title={listing.role_name}
                                                            endDate={listing.end_date}
                                                            department={listing.dept}
                                                            salary={listing.salary}
                                                            matchingPercentage={
                                                                matchingPercentages.find((percentage) => percentage.roleId === listing.listing_id)?.matchingPercentage || 0
                                                            }
                                                        />
                                                    );
                                                })}
                                            
                                                <ReactPaginate
                                                    previousLabel={'<'}
                                                    nextLabel={'>'}
                                                    breakLabel={'...'}
                                                    pageCount={pageCount}
                                                    marginPagesDisplayed={2}
                                                    pageRangeDisplayed={5}
                                                    onPageChange={handlePageClick}
                                                    containerClassName={'pagination flex justify-center items-center space-x-2'}
                                                    activeClassName={'active border bg-blurple text-white font-bold rounded-lg'}
                                                    pageClassName={'cursor-pointer px-3 py-2'}
                                                    previousClassName={'cursor-pointer px-3 py-2'}
                                                    nextClassName={'cursor-pointer px-3 py-2'}
                                                />
                                            </div>
                                        </div>
                                    )} 
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            );
        }
    }
    else {
        // router.push('/api/auth/signin');
        return null;
    }
}