import Head from 'next/head';
import React, { useState, useEffect } from "react";
import { useSession, signIn, signOut } from 'next-auth/react';
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';
import SideNavBar from '../../components/SideNavBar'
import Modal from '@/components/Modal.jsx';
import { useRouter } from 'next/router';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {formatDateWithoutTime, validateGreaterTodayDate} from '../../utils/utils.js'
import { Divider, Space, Tag } from 'antd';
import BackButton from '../../components/backButton'
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
} from '@ant-design/icons';
import ReactPaginate from 'react-paginate';


const styles= {
    pageContentContainer:{
        width: '80%'
    },
};

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

function AppliedRoleCard(props) {
    const start_date = formatDateWithoutTime(props.startDate);
    const end_date = formatDateWithoutTime(props.endDate);

    return (
        <div className="card border-2 rounded-sm p-6 flex flex-row">
            <div className='w-full'>
            <div className='flex flex-row justify-between'>
                <p className='text-sm'>Listing ID {props.listingID}</p>
                    {props.status === "Reviewing" ? (
                        <Tag color="warning" className="text-base">
                            {props.status}
                        </Tag>
                    ) : props.status === "Accepted" ? (
                        <Tag color="success" className="text-base">
                            {props.status}
                        </Tag>
                    ) : props.status === "Pending" ? (
                        <Tag color="purple" className="text-base">
                            {props.status}
                        </Tag>
                    ) : (
                        <Tag color="error" className="text-base">
                            {props.status}
                        </Tag>
                    )}
                </div>
                <h2 className='text-xl font-bold my-2'>{props.title}</h2>
                <p className='flex items-center'>
                    <span className='mr-6 flex items-center'>
                        <img className='w-5 h-5 mr-2' src="https://img.icons8.com/windows/32/average-2.png" alt="average-2"/>
                        {props.salary}
                    </span>
                    <span className='flex items-center'>
                        <img className='w-4 h-4 mr-2' src="https://img.icons8.com/material-outlined/24/department.png" alt="department"/>
                        {props.department}
                    </span>
                </p>
                <p className='mt-3'><span className='font-bold'>Application Start Date: </span>{start_date}</p>
                <p><span className='font-bold'>Application Deadline: </span>{end_date}</p>
                <MoreDetails
                    listingID={props.listingID}
                />
            </div>
        </div>
    );
};

export default function Home() {    

    // session data
    const { data, status } = useSession();
    const router = useRouter();
    // console.log("Session:", data);
    // console.log("Status:", status);

    // listing id
    if (typeof window !== 'undefined') {
        const searchParams = new URLSearchParams(window.location.search);
        var staffID = searchParams.get('staffID');
        // console.log("Listing ID:", listingID);
    }    

    // staff's Skills
    const [staffSkills, setStaffSkills] = useState([]);
    useEffect(() => {
        if (data){
            if (data.role == 0){
                fetch(`http://127.0.0.1:5005/get_all_staff_skills/${data.id}`, { 
                    method: 'GET',
                })
                .then((response) => response.json())
                .then((data) => {
                    if (data.code === 200) {
                        const skillsOfStaff = [];
                        data.data.forEach((skill) => {
                            skillsOfStaff.push(skill.Skill_Name);
                        });
                        setStaffSkills(skillsOfStaff);
                        // console.log("Staff's skills:", skillsOfStaff)
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
            }
            else if (data.role == 2){
                fetch(`http://127.0.0.1:5005/get_all_staff_skills/${staffID}`, { 
                    method: 'GET',
                })
                .then((response) => response.json())
                .then((data) => {
                    if (data.code === 200) {
                        const skillsOfStaff = [];
                        data.data.forEach((skill) => {
                            skillsOfStaff.push(skill.Skill_Name);
                        });
                        setStaffSkills(skillsOfStaff);
                        // console.log("Staff's skills:", skillsOfStaff)
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
            }
        }
    }, [data]);

    
    // applicants
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        if (data){
            if (data.role == 0){
                fetch(`http://127.0.0.1:5006/application/staff/${data.id}`, { 
                    method: 'GET',
                })
                .then((response) => response.json())
                .then((data) => {
                    if (data.code === 200) {
                        setApplications(data.data.applications);
                        console.log(data.data.applications)
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
            }
            else if (data.role == 2){
                fetch(`http://127.0.0.1:5006/application/staff/${staffID}`, { 
                    method: 'GET',
                })
                .then((response) => response.json())
                .then((data) => {
                    if (data.code === 200) {
                        setApplications(data.data.applications);
                        console.log(data.data.applications)
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
            }
        }
    }, [data]);

    // staff
    const [staff, setStaff] = useState([]);

    useEffect(() => {
        if (data){
            if (data.role == 0){
                fetch(`http://127.0.0.1:5100/staff/${data.id}`, { 
                    method: 'GET',
                })
                .then((response) => response.json())
                .then((data) => {
                    if (data.code === 200) {
                        setStaff(data.data);
                        console.log(data.data)
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
            }
            else if (data.role == 2){
                fetch(`http://127.0.0.1:5100/staff/${staffID}`, { 
                    method: 'GET',
                })
                .then((response) => response.json())
                .then((data) => {
                    if (data.code === 200) {
                        setStaff(data.data);
                        console.log(data.data)
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
            }
            
        }
    }, [data, applications]);

    const dept = staff.dept;
    const fname = staff.staff_FName;
    const lname = staff.staff_LName;
    const country = staff.country;
    const email = staff.email;
    const staff_id = staff.staff_id;

    // listing data
    let [appliedRoles, setAppliedRoles] = useState([]);

    useEffect(() => {
        if (data){
            fetch('http://127.0.0.1:5002/listing', {
            method: 'GET',
            })
            .then((response) => response.json())
            .then((data) => {
                if (data.code === 200) {

                    if (data.data.listings.length !== 0 && applications.length !== 0) {
                        const matchedListingsWithStatus = data.data.listings
                          .filter((listing) => {
                            const matchingApplication = applications.find((application) => application.listing_id === listing.listing_id);
                            return matchingApplication;
                          })
                          .map((listing) => {
                            const matchingApplication = applications.find((application) => application.listing_id === listing.listing_id);
                            return {
                              ... listing,
                              status: matchingApplication.application_status,
                            };
                          });
                      
                        setAppliedRoles(matchedListingsWithStatus);
                        console.log(matchedListingsWithStatus);
                      } else {
                        console.log("Either 'listings' or 'applications' is not defined or empty.");
                      }             
                }
            })
            .catch((error) => {
                console.error(error);
            });
        }
    }, [data, applications]);

    // pagination
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;
    const totalItems = appliedRoles.length;
    const pageCount = Math.ceil(totalItems / itemsPerPage);
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const subset = appliedRoles.slice(startIndex, endIndex);

    const handlePageClick = (selectedPage) => {
        setCurrentPage(selectedPage.selected);
      };

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
                    <div className='flex flex-row items-start w-screen'>
                        <div className='w-60 min-h-[500px] '>
                            <SideNavBar/>
                        </div>
                        <div className='flex justify-center w-full'>
                            <div className='h-full py-6' style={ styles.pageContentContainer }>
                                <div className='m-5 flex flex-col'>
                                    <div>
                                        <BackButton/>
                                    </div>
                                    <p className='text-sm mt-5'>Staff ID {staff_id}</p>
                                    <div className='text-4xl mt-5 mb-2'>
                                        {fname} {lname}
                                    </div>
                                    <p className='my-3'><span className='font-bold'>Email:</span> {email}</p>
                                    <p className='my-3'><span className='font-bold'>Country: </span> {country}</p>
                                    <p className='my-3'><span className='font-bold'>Department:</span> {dept}</p>   
                                    <p className='mt-2 mb-2 font-bold'>Skills:</p>                         
                                    <div className='my-3'>
                                        <Space size={[0, 14]} wrap>
                                            {staffSkills.map((skill, index) => (
                                                <div key={index}>
                                                    <Tag color="processing" className="text-base">
                                                    {skill}
                                                    </Tag>
                                                </div>                                      
                                            ))}                         
                                        </Space>
                                    </div>
                                    <hr className='mt-7'/>
                                    <h3 className='mt-10 mb-3 font-bold text-xl'>Applied Roles</h3>
                                    {appliedRoles.length === 0 ? (
                                        <p className='py-5 flex items-center justify-center'>No roles applied yet.</p>
                                    ) : (
                                        <div>
                                            <div className='grid grid-cols-2 gap-4 mb-6'>
                                                {subset.map((appliedRole, index) => (
                                                    <div key={index}>
                                                        <AppliedRoleCard
                                                            key={appliedRole.listing_id}
                                                            listingID={appliedRole.listing_id} 
                                                            title={appliedRole.role_name}
                                                            startDate={appliedRole.start_date}
                                                            endDate={appliedRole.end_date}
                                                            department={appliedRole.dept}
                                                            salary={appliedRole.salary}
                                                            status={appliedRole.status}
                                                        />
                                                    </div>  
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
            // console.log(data.id)
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
                                    <p className='text-sm mt-5'>Staff ID {staff_id}</p>
                                    <div className='text-4xl mt-5 mb-2'>
                                        {fname} {lname}
                                    </div>
                                    <p className='my-3'><span className='font-bold'>Email:</span> {email}</p>
                                    <p className='my-3'><span className='font-bold'>Country: </span> {country}</p>
                                    <p className='my-3'><span className='font-bold'>Department:</span> {dept}</p>  
                                    <p className='mt-2 mb-2 font-bold'>Skills:</p>                         
                                    <div className='my-3'>
                                        <Space size={[0, 14]} wrap>
                                            {staffSkills.map((skill, index) => (
                                                <div key={index}>
                                                    <Tag color="processing" className="text-base">
                                                    {skill}
                                                    </Tag>
                                                </div>                                      
                                            ))}                         
                                        </Space>
                                    </div>
                                    <hr className='mt-7'/>
                                    <h3 className='mt-10 mb-3 font-bold text-xl'>Applied Roles</h3>
                                    {appliedRoles.length === 0 ? (
                                        <p className='py-5 flex items-center justify-center'>No roles applied yet.</p>
                                    ) : (
                                        <div>
                                            <div className='grid grid-cols-2 gap-4 mb-6'>
                                                {subset.map((appliedRole, index) => (
                                                    <div key={index}>
                                                        <AppliedRoleCard
                                                            key={appliedRole.listing_id}
                                                            listingID={appliedRole.listing_id} 
                                                            title={appliedRole.role_name}
                                                            startDate={appliedRole.start_date}
                                                            endDate={appliedRole.end_date}
                                                            department={appliedRole.dept}
                                                            salary={appliedRole.salary}
                                                            status={appliedRole.status}
                                                        />
                                                    </div>  
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
        }
    }
    else {
        router.push('/api/auth/signin');
        return null;
    }
}