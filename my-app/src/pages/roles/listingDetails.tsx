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
        window.location.href = `/staff/candidateHub?staffID=${props.staffID}`;
    };
    return (
      <button
        className='rounded-lg mb-2 px-4 py-2 border border-black border-opacity-80 bg-transparent hover:bg-black hover:text-white transition duration-300 ease-in-out'
        onClick={handleButtonClick} 
      >
        View Applicant Details
      </button>
    );
}

function ApplicantCard(props){
    const matchingPercentage = props.matchingPercentage;
    const color = getColorByPercentage(matchingPercentage);

    return (
        <div className="card border-2 rounded-sm p-6 flex flex-row">
            <div className='w-full'>
                <div className='flex flex-row justify-between'>
                    <p><span className='font-bold'>Staff ID: </span>{props.staffID}</p>
                    {props.status === "Reviewing" ? (
                        <Tag color="	#FF7518" className="text-base">
                            {props.status}
                        </Tag>
                    ) : props.status === "Accepted" ? (
                        <Tag color="#87d068" className="text-base">
                            {props.status}
                        </Tag>
                    ) : props.status === "Pending" ? (
                        <Tag color="#CF9FFF" className="text-base">
                            {props.status}
                        </Tag>
                    ) : (
                        <Tag color="#D2042D" className="text-base">
                            {props.status}
                        </Tag>
                    )}
                </div>
                <p className='my-2'><span className='font-bold'>Staff Name: </span>{props.Fname} {props.Lname}</p>
                <p><span className='font-bold'>Skill Match Percentage (%): </span>{props.matchingPercentage}</p>
                <div className=' mt-2 mb-2 h-20'>
                    <Space size={[0, 14]} wrap>
                        {props.staffSkills.map((staffSkill, index) => (
                            props.roleSkills.includes(staffSkill) ? (
                                <div key={index}>
                                    <Tag icon={<CheckCircleOutlined />} color="success" className="text-base">
                                    {staffSkill}
                                    </Tag>
                                </div>
                                ) : (
                                <div key={index}>
                                    <Tag icon={<CloseCircleOutlined />} color="error" className="text-base">
                                    {staffSkill}
                                    </Tag>
                                </div>
                            )                                            
                        ))}                         
                    </Space>
                </div>
                <MoreDetails
                    staffID={props.staffID}
                />
            </div>
        </div>
    )
}

export default function Home() {    

    // session data
    const { data, status } = useSession();
    const router = useRouter();
    // console.log("Session:", data);
    // console.log("Status:", status);

    // listing id
    if (typeof window !== 'undefined') {
        const searchParams = new URLSearchParams(window.location.search);
        var listingID = searchParams.get('listingID');
        // console.log("Listing ID:", listingID);
    }    

    // listing
    const [listingDetails, setListingDetails] = useState([]);

    useEffect(() => {
        fetch(`http://127.0.0.1:5002/listing/${listingID}`, {
        method: 'GET',
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.code === 200) {
                setListingDetails(data.data);
            }
        })
        .catch((error) => {
            console.error(error);
        });
    }, []);
    
    const dept = listingDetails.dept;
    const end_date = formatDateWithoutTime(listingDetails.end_date);
    const listing_id = listingDetails.listing_id;
    const role_description = listingDetails.role_description;
    const role_name = listingDetails.role_name;
    const salary = listingDetails.salary;
    const start_date = formatDateWithoutTime(listingDetails.start_date);

    // role skills
    const [roleSkills, setRoleSkills] = useState([]);
    
    const [modalContent, setModalContent] = useState({
        success: false,
        header: "",
        msg: "",
    });
    const [isModal1, setIsModal1] = useState(false); // confirmation modal
    const [isModal2, setIsModal2] = useState(false); // success modal

    useEffect(() => {
        fetch(`http://127.0.0.1:5003/role_skill/${listingID}`, {
        method: 'GET',
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.code === 200) {
                const skillsOfListing = [];
                data.data.skills.forEach((skill) => {
                    // console.log("Skill:", skill);
                    skillsOfListing.push(skill.skill);
                });
                setRoleSkills(skillsOfListing);
                // console.log("Role Skill Response:", data)
                // console.log("Role Skills:", skillsOfListing)
            }
        })
        .catch((error) => {
            console.error(error);
        });
    }, []);

    // staff's Skills
    const [staffSkills, setStaffSkills] = useState([]);
    useEffect(() => {
        if (data){
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
    }, [data]);

    const [allStaffSkills, setAllStaffSkills] = useState([]);
    useEffect(() => {
        if (data){
            fetch(`http://127.0.0.1:5005/get_all_staff_skills`, { 
                method: 'GET',
            })
            .then((response) => response.json())
            .then((data) => {
                if (data.code === 200) {
                    const staffSkillsDictionary = {};
                    data.data.staff_skills.forEach((skill) => {
                        const staffID = skill.Staff_ID;
                        const skillName = skill.Skill_Name;
                        if (!staffSkillsDictionary[staffID]) {
                            staffSkillsDictionary[staffID] = [skillName];
                        } else {
                            staffSkillsDictionary[staffID].push(skillName);
                        }
                    });
                    setAllStaffSkills(staffSkillsDictionary)
                }
            })
            .catch((error) => {
                console.error(error);
            });
        }
    }, [data]);

    
    // applicants
    const [applicants, setApplicants] = useState([]);

    useEffect(() => {
        if (data){
            fetch(`http://127.0.0.1:5006/application/${listing_id}`, { 
                method: 'GET',
            })
            .then((response) => response.json())
            .then((data) => {
                if (data.code === 200) {
                    setApplicants(data.data.applications);
                    // console.log("Applications:", data.data.applications)
                }
            })
            .catch((error) => {
                console.error(error);
            });
        }
    }, [data, listingDetails]);

    // all staff
    const [staff, setStaff] = useState([]);
    const [applicantsWithDetails, setApplicantsWithDetails] = useState([]);
    useEffect(() => { 
        console.log("applicantsWithDetails:", applicantsWithDetails);
    }, [applicantsWithDetails]);
    useEffect(() => {
        // console.log("Applicants:", applicants);
        // console.log("Applicants with details:", applicantsWithDetails);
        // console.log("Staff:", staff);
        if (applicants.length !== 0 && staff.length !== 0) {
            const staffInApplicants = staff
                .filter((staffMember) => {
                    const applicant = applicants.find((applicant) => applicant.staff_id === staffMember.staff_id);
                    return applicant; 
                })
                .map((staffMember) => {
                    const applicant = applicants.find((applicant) => applicant.staff_id === staffMember.staff_id);
                    return {
                        ...staffMember,
                        skill_match: applicant.skill_match,
                        status: applicant.application_status,
                    };
                });

            // Sort the staffInApplicants array by skill_match in ascending order
            staffInApplicants.sort((a, b) => b.skill_match - a.skill_match);

            setApplicantsWithDetails(staffInApplicants);
            // console.log("Staff in applicants:", staffInApplicants);
        } else {
            console.log("Either 'applicants' or 'staff' is not defined or empty.");
        }
    }, [applicants, staff]);

    useEffect(() => {
        fetch(`http://127.0.0.1:5100/staff`, { 
            method: 'GET',
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.code === 200) {
                const noHr = data.data.staff ? data.data.staff.filter(staff =>
                    staff.access_rights === 0
                ) : [];
                setStaff(noHr);
                // console.log("nohr:", noHr);
            }
        })
        .catch((error) => {
            console.error(error);
        });
    }, []);

    // skill match percentage (staff)
    const matchingSkills = staffSkills ? staffSkills.filter(skill =>
        roleSkills.includes(skill)
    ) : [];
    const matchingSkillsCount = matchingSkills.length;
    const matchingPercentage = (matchingSkillsCount / roleSkills.length) * 100;
    const color = getColorByPercentage(matchingPercentage);

    // Check if staff has already applied for this role
    const [hasApplied, setHasApplied] = useState(false);
    // useEffect(() => {
    //     console.log("Has applied:", hasApplied);
    // }, [hasApplied])
    useEffect(() => {
        if (data){
            if (data.role == 0){
                axios.get(`/api/get-staff-application/${listingID}/${data.id}`)
                .then(response => {
                    console.log('get-application Response:', response.data);
                    if (response.data.status === 200) {
                        setHasApplied(true);
                        console.log("Has applied");
                    } else if (response.data.status === 404) {
                        setHasApplied(false);
                        console.log("Not applied");
                    }
                })
                .catch(error => {
                    console.error('get-application Error:', error);
                })
            }
        }
    }, [data, isModal2]);

    
    const handleApply = () => {
        setIsModal1(true);
    }
    
    const createApplication = () => {   
        setIsModal1(false);
        const payload = {
            "listing_id": listingID,
            "staff_id": data.id,
            "applicationDate": new Date().toISOString().slice(0, 10).replace('T', ' '),
            "applicationStatus": "Pending",
            "skillMatch": matchingPercentage
        }
        console.log("Apply:", payload);
        
        const createApplicationAPIRoute = `/api/create-application`;
        
        axios.post(createApplicationAPIRoute, payload)
        .then(response => {
            console.log('createApplicationAPIRoute Response:', response.data);
            setModalContent(() => ({
                success: true,
                header: "Application Submitted!",
                msg: "Your application has been successfully submitted."
            }));
            setIsModal2(true);
        })
        .catch(error => {
            console.error('createApplicationAPIRoute Error:', error);
            setModalContent(() => ({
                success: false,
                header: "Something went wrong!",
                msg: "Check the console."
            }));
            setIsModal2(true);
        });
    }

    // Check if listing has expired, if yes disable edit button
    const [hasExpired, setHasExpired] = useState(true);
    useEffect(() => {
        if (data){
            if (data.role == 2){
                // console.log("Start Date:", start_date);
                // console.log(validateGreaterTodayDate(end_date));
                if(validateGreaterTodayDate(end_date)){
                    // console.log("Not expired");
                    setHasExpired(false);
                } else {
                    // console.log("Expired")
                    setHasExpired(true);
                }
            }
        }
    }, [data, start_date]);

    const handleEdit = () => {
        router.push(`/roles/update-listing/${listingID}`);
    }

    // pagination
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;
    const totalItems = applicantsWithDetails.length;
    const pageCount = Math.ceil(totalItems / itemsPerPage);
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const subset = applicantsWithDetails.slice(startIndex, endIndex);

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
                                    <div className='flex flex-row justify-between'>
                                        <div className='flex flex-col'>
                                            <p className='text-sm mt-5'>Listing ID {listing_id}</p>
                                            <div className='text-4xl mt-5'>
                                                {role_name}
                                            </div>
                                            <p className='flex items-center my-5'>
                                                <span className='mr-6 flex items-center'>
                                                    <img className='w-5 h-4 mr-5' src="https://img.icons8.com/windows/32/average-2.png" alt="average-2"/>
                                                    {salary}
                                                </span>
                                                <span className='flex items-center'>
                                                    <img className='w-4 h-4 mr-2' src="https://img.icons8.com/material-outlined/24/department.png" alt="department"/>
                                                    {dept}
                                                </span>
                                            </p>
                                        </div>
                                        <div className='flex justify-center items-center'>
                                            <button 
                                                // type="submit"
                                                className={hasExpired ? 'bg-gray-300 w-24 px-6 py-2 rounded-lg text-gray-500' : 'bg-blurple text-white font-semibold rounded-lg w-24 px-6 py-2 border border-blurple hover:bg-transparent hover:border-blurple hover:text-blurple transition duration-200 ease-in-out'}
                                                disabled={hasExpired ? true : false}
                                                onClick={handleEdit}
                                            >
                                                    Edit
                                            </button>
                                        </div>
                                    </div>

                                    <hr />

                                    <h3 className='mt-5 mb-3 font-bold text-xl'>Description</h3>
                                    <p>{role_description}</p>
                                    <h3 className='mt-10 mb-3 font-bold text-xl'>Details</h3>
                                    <p>Application Start Date: {start_date}</p>
                                    <p>Application Deadline: {end_date}</p>
                                    <h3 className='mt-10 mb-3 font-bold text-xl'>Role Skills</h3>
                                    <div>
                                        <Space size={[0, 14]} wrap>
                                            {roleSkills.map((skill, index) => (
                                                <div key={index}>
                                                    <Tag color="processing" className="text-base">
                                                    {skill}
                                                    </Tag>
                                                </div>                                      
                                            ))}                         
                                        </Space>
                                    </div>
                                    <h3 className='mt-10 mb-3 font-bold text-xl'>Applicants</h3>
                                    
                                    {applicantsWithDetails.length === 0 ? (
                                        <p className='py-5 flex items-center justify-center'>No applicants found.</p>
                                    ) : (
                                        <div>
                                            <div className='grid grid-cols-2 gap-4 mb-6'>
                                                {subset.map((applicant, index) => (
                                                    <div key={index}>
                                                        <ApplicantCard
                                                            key={applicant.staff_id}
                                                            Fname={applicant.staff_FName}
                                                            Lname={applicant.staff_LName}
                                                            staffID={applicant.staff_id}
                                                            matchingPercentage= {applicant.skill_match}
                                                            status={applicant.status}
                                                            staffSkills={allStaffSkills[applicant.staff_id] || []}
                                                            roleSkills={roleSkills}
                                                        ></ApplicantCard>
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
                                    <div>
                                        <BackButton/>
                                    </div>
                                    <div className='flex flex-row justify-between'>
                                        <div className='flex flex-col'>
                                            <p className='text-sm mt-5'>Listing ID {listing_id}</p>
                                            <div className='text-4xl mt-5'>
                                                {role_name}
                                            </div>
                                            <p className='flex items-center my-5'>
                                                <span className='mr-6 flex items-center'>
                                                    <img className='w-4 h-4 mr-2' src="https://img.icons8.com/windows/32/bank-card-back-side--v1.png" alt="bank-card-back-side--v1"/>
                                                    {salary}
                                                </span>
                                                <span className='flex items-center'>
                                                    <img className='w-4 h-4 mr-2' src="https://img.icons8.com/material-outlined/24/department.png" alt="department"/>
                                                    {dept}
                                                </span>
                                            </p>
                                        </div>
                                        <div className='flex justify-center items-center'>
                                            <button className={hasApplied? 'bg-gray-300 w-24 px-6 py-2 rounded-lg text-gray-500' : 'bg-blurple text-white font-semibold rounded-lg w-24 px-6 py-2 border border-blurple hover:bg-transparent hover:border-blurple hover:text-blurple transition duration-200 ease-in-out' } disabled={hasApplied? true : false} type="submit" onClick = { handleApply }>{hasApplied? "Applied" : "Apply"}</button>
                                        </div>
                                    </div>

                                    <hr />

                                    <h3 className='mt-5 mb-3 font-bold text-xl'>Description</h3>
                                    <p>{role_description}</p>
                                    <h3 className='mt-10 mb-3 font-bold text-xl'>Details</h3>
                                    <p>Application Deadline: {end_date}</p>
                                   
                                    <div className='flex flex-row mt-10'>
                                        <div className='w-3/4'>
                                            <h3 className='mb-3 font-bold text-xl'>Skill Match</h3>
                                            <div >
                                                <Space size={[0, 14]} wrap>
                                                    {roleSkills.map((skill, index) => (
                                                        staffSkills.includes(skill) ? (
                                                            <div key={index}>
                                                                <Tag icon={<CheckCircleOutlined />} color="success" className="text-base">
                                                                {skill}
                                                                </Tag>
                                                            </div>
                                                          ) : (
                                                            <div key={index}>
                                                                <Tag icon={<CloseCircleOutlined />} color="error" className="text-base">
                                                                {skill}
                                                                </Tag>
                                                            </div>
                                                          )                                            
                                                    ))}                         
                                                </Space>
                                            </div>
                                        </div>
                                        <div className='w-1/4'>
                                            <CircularProgressbar 
                                                className='w-40 h-40 items-center ' 
                                                value={matchingPercentage} 
                                                text={`${matchingPercentage}%`} 
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
                            </div>
                        </div>
                    </div>
                    {/* Confirmation Modal */}
                    <Modal className="w-1/5 h-fit text-center" show={isModal1} onClose={() => setIsModal1(false)}>
                        <div className="px-3">
                            <h1 className="text-2xl font-semibold text-slate-600">Confirmation</h1>
                            <p className='text-slate-600 font-xs font-normal'>Do you want to apply for this role?</p>
                            <div className="grid grid-cols-2 justify-center">
                                <button className="bg-white text-slate-400 font-semibold rounded-lg py-2 mt-4 border border-slate-400 hover:bg-slate-100 hover:border-slate-700 hover:text-slate-700 transition duration-200 ease-in-out" onClick={ createApplication }>
                                    Yes
                                </button>
                                <button className="ml-1 bg-blurple text-white font-semibold rounded-lg py-2 mt-4 border border-blurple hover:bg-transparent hover:border-blurple hover:text-blurple transition duration-200 ease-in-out" onClick={() => setIsModal1(false)}>
                                    No
                                </button>
                            </div>
                        </div> 
                    </Modal>
                    {/* Success Modal */}
                    <Modal className="w-1/5 h-fit text-center" show={isModal2} onClose={() => setIsModal2(false)}>
                        <div className="px-3">
                            <h1 className="text-2xl font-semibold text-slate-600">{modalContent.header}</h1>
                            <p className='text-slate-600 font-xs font-normal'>{modalContent.msg}</p>
                            <div className="flex justify-center mt-2">
                                <button className="bg-blurple text-white font-semibold rounded-lg px-6 py-2 mt-4 border border-blurple hover:bg-transparent hover:border-blurple hover:text-blurple transition duration-200 ease-in-out" onClick={() => setIsModal2(false)}> {modalContent.success ? 'Awesome!' : 'Ok'} </button>
                            </div>
                        </div> 
                    </Modal>
                </main>
            );
        }
    }
    else {
        router.push('/api/auth/signin');
        return null;
    }
}