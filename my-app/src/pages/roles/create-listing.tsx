"use client"

import React, { ChangeEvent } from 'react';
import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import SideNavBar from '../../components/SideNavBar'
import { compareTwoDates } from '../../utils/compareTwoDates.js'
import { validateGreaterTodayDate } from '../../utils/validateGreaterTodayDate.js'
import { useRouter } from 'next/router';
import { text } from 'stream/consumers';
import axios from 'axios';
// import SkillsSelect from '../../components/SkillsSelect';
import Modal from '../../components/Modal.jsx';
import {MdOutlineCancel} from 'react-icons/md';

const styles= {
    pageContentContainer:{
        width: '100%'
    },
};

function SkillsChip ({ skill, handleRemoveSkill }) {
    const handleClick = (skill:Object) => {
        handleRemoveSkill(skill);
        // console.log("Onclick:", skill);
    }
    if (skill.isSelected) {
        return(
            <button 
                className='bg-white text-slate-400 font-semibold rounded-3xl px-2 py-1 mx-1 my-1 border border-slate-400 hover:bg-red-100 hover:border-red-700 hover:text-red-700 transition duration-200 ease-in-out'
                name={skill.skill}
                onClick={ () => { handleClick(skill) } }
            >
                <div className='flex items-center'>
                    <p>{skill.skill}</p>
                    <MdOutlineCancel className='ml-2'/>
                </div>
            </button>
        )
    } else {
        return null;
    }
}

function SelectedItems ({ skillsSelectionList, setSkillsSelectionList }) {
    // console.log("SelectedItems", skillsSelectionList)
    const handleRemoveSkill = (skill:object) => {
        // console.log("Remove Skill:", skill);
        // console.log("Delete Skill:", skill);
        const tempSkillList = [];
        for( let skillRow of skillsSelectionList ) {
            // console.log("Skill Row:", skillRow);
            if (skillRow.skill === skill.skill) {
                let tempSkillRow = {
                    "skill": skillRow.skill,
                    isSelected: false
                }
                tempSkillList.push(tempSkillRow);
            } else {
                tempSkillList.push(skillRow);
            }
        }
        setSkillsSelectionList(tempSkillList);
        // console.log("Remove Skill:", skill);
        // console.log(tempSkillList);
        // console.log("Updated Skills List:", skillsSelectionList);
    }
    // console.log("SelectedItems", skillsSelectionList)
    return (
        <div>
            <div>
                <p className='text-slate-400 mt-1'>Selected skills will appear here:</p>
            </div>
            <div>
                {skillsSelectionList.map((skill) => {
                        return <SkillsChip key={skill.skill} skill={skill} handleRemoveSkill={() => handleRemoveSkill(skill)} />
                    }
                )}
            </div>
        </div>
    )
}

function SkillsSelect ({ skillList, skillsSelectionList, setSkillsSelectionList, show, onClose}) {
    const SkillsSelectStyles = {
        listOfSkills : 'mt-2 h-36 overflow-y-auto bg-slate-50 shadow-lg shadow-gray-300 border border-slate-200 rounded-md p-2 w-full focus:outline-blurple',
        liItem : 'w-full py-1 px-2 border border-transparent rounded-md hover:border-slate-100 hover:bg-slate-100 cursor-pointer',
        liItemSelected: 'w-full py-1 px-2 border border-slate-200 bg-slate-200 rounded-md'
    }
    
    // keep track of whether user has clicked outside of dropdown menu
    const dropdownSkills = useRef(null);
    const checkClick = (event) => {
        if (show && dropdownSkills.current && !dropdownSkills.current.contains(event.target) ) {
            onClose();
        }
    };
    
    useEffect(() => {
        if (show) {
            setTimeout(() => {
                document.addEventListener('click', checkClick);
            },50);
        }
        return () => {
            document.removeEventListener('click', checkClick);
        };
    }, [show]);

    const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        // console.log("Handle Selection")
        const { name, value, checked } = e.target; // destructuring (value refers to skill name)
        // deptList.find(deptRow => deptRow.value === value)
        console.log( name, value, checked );
        const updatedSkillsSelectionList = [];
        for( let skillRow of skillsSelectionList ) {
            if (skillRow.skill === value) {
                let tempSkillRow = {
                    "skill": skillRow.skill,
                    isSelected: !skillRow.isSelected
                }
                console.log("Temp Skill Row:", tempSkillRow);
                updatedSkillsSelectionList.push(tempSkillRow);
            } else {
                updatedSkillsSelectionList.push(skillRow);
            }
        }
        setSkillsSelectionList(updatedSkillsSelectionList);
        // console.log("Updated Skills List:", updatedSkillsSelectionList);
    }

    return (
        <div ref={dropdownSkills} id="skills-dropdown-menu" className={`${show ? "" : "hidden"} relative`}>
            <div id='list-of-skills' className={`${SkillsSelectStyles.listOfSkills} absolute`}>

                <ul className='grid grid-cols-3 gap-1 px-1 py-1'>
                    {skillsSelectionList.map((skill: any) => {
                        const skillName = skill.skill;
                        return (
                                <label key={skill.skill}>
                                    <li className={`${skill.isSelected ?  SkillsSelectStyles.liItemSelected : SkillsSelectStyles.liItem}`}>
                                        <input
                                            type='checkbox'
                                            value={skill.skill} 
                                            onChange={ handleSelect } 
                                            className='mr-2'
                                            checked={skill.isSelected}
                                        />                                                        
                                        { skillName.toString() }
                                    </li>
                                </label>
                            )
                        }
                    )}
                </ul>
            </div>
        </div>
    );
}

export default function CreateListing() {
    const { data, status } = useSession();
    const router = useRouter();
    // console.log("Session:", data);
    // console.log("Status:", status);

    // deptList is an array of objects (value, label)
    const [deptList, setDeptList] = useState([{ value: '', label:'' }]);

    // skillList is an array of skill names
    const [skillList, setSkillList] = useState([]);

    // Initialize skillsSelectionList to track skills selected by user
    const [skillsSelectionList, setSkillsSelectionList] = useState([{ skill: '', isSelected: false}]);

    // Handle dropdown menu state
    const [isOpen, setIsOpen] = useState(false);
    const handleToggleMenu = (e) => {
        // console.log("Toggle button clicked");
        setIsOpen(!isOpen);
    }

    useEffect(() => {
        const tempSkillList: any = [];
        for (let skill of skillList) {
            // console.log("Skill:", skill);
            let tempSkill = {
                "skill": skill,
                isSelected: false
            }
            tempSkillList.push(tempSkill);
        }
        setSkillsSelectionList(tempSkillList);
        // console.log("skillList:", tempSkillList);
    }, [skillList]);

    
    useEffect(() => {
        async function fetchDeptsAndSkills() {
            // console.log("Fetching Departments and Skills");
            axios.get('/api/get-departments')
            .then(response => {
                // console.log('Data:', response.data);
                setDeptList(response.data['response'])
            })
            .catch(error => {
                console.error('Error:', error);
            });

            axios.get('/api/get-skills')
            .then(response => {
                // console.log('Skills:', response.data);
                setSkillList(response.data['response'])
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
        fetchDeptsAndSkills();
    }, []);
    
    // Track user's input in form fields
    const [isDirty, setIsDirty] = useState(false); // to track if user has interacted with form fields
    // useEffect(() => {
    //     console.log("isDirty:", isDirty);
    // }, [isDirty]);
    const [formData, setFormData] = useState({
        role_name: '',
        role_description: '',
        start_date: '',
        end_date: '',
        dept: deptList[0].label,
        salary: '',
        // skillsSelected: []
    });

    // check if form is dirty
    useEffect(() => {
        function checkForm(){
            const [role_name, role_description, start_date, end_date, dept, salary] = Object.values(formData);
            if(role_name != "" || role_description != "" || start_date != "" || end_date != "" || dept != "" || salary != "" || skillsSelectionList.some(item => item.isSelected === true)) {
                // console.log("Dirty")
                setIsDirty(true);
            } else {
                // console.log("Clean")
                setIsDirty(false);
            }
        }
        checkForm();
    }, [formData, skillsSelectionList]);

    // prompt the user if they try and leave with unsaved changes  
    useEffect(() => {
        // console.log("Mounted");
        const warningText =
            'You have unsaved changes - are you sure you wish to leave this page?';
        const handleWindowClose = (e: BeforeUnloadEvent) => {
            if (!isDirty) return;
            e.preventDefault();
            return (e.returnValue = warningText);
        };
        const handleBrowseAway = () => {
            if (!isDirty) return;
            if (window.confirm(warningText)) return;
            router.events.emit('routeChangeError');
            throw 'routeChange aborted.';
        };
        window.addEventListener('beforeunload', handleWindowClose);
        router.events.on('routeChangeStart', handleBrowseAway);
        return () => {
            // console.log("Cleanup");
            window.removeEventListener('beforeunload', handleWindowClose);
            router.events.off('routeChangeStart', handleBrowseAway);
        };
    }, [isDirty, router.events]);

    // modal
    const [isModal1, setIsModal1] = useState(false); // Create confirmation
    const [modalContent, setModalContent] = useState({
        success: false,
        header: "",
        msg: "",
    });
    const [isModal2, setIsModal2] = useState(false); // Success modal
    const [isModal3, setIsModal3] = useState(false); // Reset confirmation

    // form validation w messages
    const [validationData, setValidationData] = useState({
        role_name: { isValid: true, errMsg: ''},
        role_description: { isValid: true, errMsg: ''},
        start_date: { isValid: true, errMsg: ''},
        end_date: { isValid: true, errMsg: ''},
        dept: { isValid: true, errMsg: ''},
        salary: { isValid: true, errMsg: ''},
        skillsSelected: { isValid: true, errMsg: ''},
    });

    const tcssStyles = {
        formHeader: 'text-3xl font-semibold text-slate-600 mb-5 px-4 pt-4',
        inputFieldGap: 'mt-6',
        inputFieldError: 'text-red-500 text-sm mb-4',
        label: 'text-slate-600 font-semibold',
        subtitle: 'text-slate-400 text-xs font-normal',
        textField: 'border border-slate-200 rounded-md p-2 w-full focus:outline-blurple',
        addSkillButton:'flex justify-center items-center mx-1 px-4 py-0.5 text-slate-400 border border-slate-400 rounded-lg bg-slate-200',
        submitButton: 'bg-blurple text-white font-semibold rounded-lg px-6 py-2 mt-8 border border-blurple hover:bg-transparent hover:border-blurple hover:text-blurple transition duration-200 ease-in-out',
        resetButton: 'bg-white text-slate-400 font-semibold rounded-lg px-6 py-2 mt-8 border border-slate-400 hover:bg-red-100 hover:border-red-700 hover:text-red-700 transition duration-200 ease-in-out',
        dropdownButtonClosed : 'w-full text-left pl-3 py-2 border border-slate-200 rounded-md',
        dropdownButtonOpen : 'w-full text-left pl-3 py-2 border-2 border-blurple rounded-md outline-blurple',
    };

    if (status === 'loading') {
        return (
            <main className='bg-white'>
                <h1> loading... please wait</h1>
            </main>
        );
    }
    else if (status === 'authenticated') {
        if(data.role === 2){
            const handleChange = (e) => {
                if (!isModal1) {
                    const { name, value } = e.target; // destructuring
                    // console.log(name, value);
                    if (name === "dept") {
                        const dept = deptList.find(deptRow => deptRow.label === value)
                        setFormData({
                            ...formData, // spread operator
                            [name]: dept.label
                        });
                    } else {
                        setFormData({
                            ...formData, // spread operator
                            [name]: value
                        });
                    }
                }
            }

            // validate before submit
            const validate = () => {
                var roleNameValid = true; var roleNameMsg = "";
                if (!formData.role_name) {
                    roleNameValid = false;
                    roleNameMsg = "Field is required";
                } else if ( formData.role_name.length < 3 || formData.role_name.length > 255 ) {
                    roleNameValid = false;
                    roleNameMsg = "Role Name should be within 3 to 255 characters";
                }

                var descValid = true; var descMsg = "";
                if (!formData.role_description) {
                    descValid = false;
                    descMsg = "Field is required";
                } else if ( formData.role_description.length > 255 ) {
                    descValid = false;
                    descMsg = "Role description is too long";
                }

                var sdValid = true; var sdMsg = "";
                if (!formData.start_date) {
                    sdValid = false;
                    sdMsg = "Field is required";
                } else if ( !validateGreaterTodayDate(formData.start_date) ) {
                    sdValid = false;
                    sdMsg = "Start date has passed";
                }

                var edValid = true; var edMsg = "";
                if (!formData.end_date) {
                    edValid = false;
                    edMsg = "Field is required";
                } else if ( compareTwoDates(formData.start_date, formData.end_date) ) {
                    edValid = false;
                    edMsg = "End date is before Start date";
                }

                var deptValid = true; var deptMsg = "";
                if (!formData.dept) {
                    deptValid = false;
                    deptMsg = "Field is required"; 
                }

                var salaryValid = true; var salaryMsg = "";
                if (!formData.salary) {
                    salaryValid = false;
                    salaryMsg = "Field is required"; 
                } else if (Number(formData.salary) <= 0) {
                    salaryValid = false;
                    salaryMsg = "Salary cannot be zero or a negative value"; 
                }
                
                var skillValid = true; var skillMsg = "";
                if (!skillsSelectionList.some(item => item.isSelected === true)) {
                    skillValid = false;
                    skillMsg = "Field is required"
                }

                setValidationData(() => ({
                    role_name: { 'isValid': roleNameValid, 'errMsg': roleNameMsg},
                    role_description: { 'isValid': descValid, 'errMsg': descMsg},
                    start_date: { 'isValid': sdValid, 'errMsg': sdMsg},
                    end_date: { 'isValid': edValid, 'errMsg': edMsg},
                    dept: { 'isValid': deptValid, 'errMsg': deptMsg},
                    salary: { 'isValid': salaryValid, 'errMsg': salaryMsg},
                    skillsSelected: { 'isValid': skillValid, 'errMsg': skillMsg},
                }));
                
                if (roleNameValid && descValid && sdValid && edValid && deptValid && salaryValid && skillValid) {
                    setIsModal1(true);
                }
            }

            const handleSubmit = async () => {
                setIsModal1(false);

                console.log("Form Data:", formData);
                const finalFormData = {
                    ...formData,
                    skillsArr: skillsSelectionList
                }
                try {
                    const res = await fetch('/api/create-listing', {
                        method: 'POST',
                        body: JSON.stringify(finalFormData),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    const data = await res.json();
                    console.log("Response Data on Form Submit:", data);
                    console.log("Response Data:", res)
                    // const response = data['response']['response'];
                    // console.log("response", response);
            
                    // TODO: Handle response (If user is authenticated, redirect to role-based home page)
                    if (res.status === 200){
                        handleReset();
                        setModalContent(() => ({
                            success: true,
                            header: "Listing created!",
                            msg: ""
                        }));
                        setIsModal2(true);
                    } else {
                        setModalContent(() => ({
                            success: false,
                            header: "Something went wrong!",
                            msg: "Check the console."
                        }));
                        setIsModal2(true);
                    }
                } catch (error) {
                    console.log("Error", error);
                    setModalContent(() => ({
                        success: false,
                        header: "Something went wrong!",
                        msg: "Check the console."
                    }));
                    setIsModal2(true);
                }
            }

            const handleReset = () => {
                setIsModal3(false);
                console.log("Reset Form");
                setFormData({
                    role_name: '',
                    role_description: '',
                    start_date: '',
                    end_date: '',
                    dept: '',
                    salary: '',
                    // skillsSelected: []
                });

                const tempSkillList = [];
                for (let skill of skillList) {
                    // console.log("Skill:", skill);
                    let tempSkill = {
                        "skill": skill,
                        isSelected: false
                    }

                    tempSkillList.push(tempSkill);
                }
                setSkillsSelectionList(tempSkillList)
            }

            // this shows the date picker when user clicks on any date input field
            function handleClickDateInput(e: React.MouseEvent<HTMLInputElement>) {
                e.target.showPicker();
            }

            return (
                <main className='bg-white'>
                    <Head>
                        <title>Create Role-Listing Page</title>
                    </Head>
                    {/* <div>
                        <h1> hi {data.user.name}</h1>
                        <img src={data.user.image} alt={data.user.name + ' photo'} />
                        <button onClick={signOut}>sign out</button>
                    </div> */}
                    <div className='flex flex-row items-start w-screen'>
                        <div className='w-60 min-h-[500px]'>
                            <SideNavBar/>
                        </div>
                        <div className='flex justify-center w-full'>
                            <div className='h-full py-6 px-20' style={ styles.pageContentContainer }>
                                <div className='m-5 flex flex-col'>
                                    <h1 className={`${tcssStyles['formHeader']}`}>
                                        Create New Role Listing
                                    </h1>
                                    {/* <p>isOpen: {isOpen.toString()}</p> */}
                                    <div className='m-5'>
                                        <div className={`${tcssStyles['inputFieldGap']}`}>
                                            <label className={`${tcssStyles['label']}`}>
                                                Role Name<br/>
                                                <input 
                                                    type="text" 
                                                    name="role_name" 
                                                    value={formData.role_name} 
                                                    onChange={handleChange}
                                                    className={`${tcssStyles['textField']}`}
                                                    placeholder='Enter role name'
                                                >
                                                </input>
                                            </label>
                                            { !validationData.role_name.isValid && <div className={`${tcssStyles['inputFieldError']}`}>{ validationData.role_name.errMsg }</div> }
                                        </div>
                                        
                                        <div className={`${tcssStyles['inputFieldGap']}`}>
                                            <label className={`${tcssStyles['label']}`}>
                                                Department
                                                <select
                                                    name='dept'
                                                    className={`${tcssStyles['textField']}`}
                                                    value={formData.dept} 
                                                    onChange={handleChange}
                                                >
                                                    <option value="" disabled className='text-slate-200'>Select your option</option>
                                                    {deptList.map((dept) => (
                                                        <option key={dept.value} value={dept.label}>{dept.label}</option>
                                                    ))}
                                                </select>
                                            </label>
                                            { !validationData.dept.isValid && <div className={`${tcssStyles['inputFieldError']}`}>{ validationData.dept.errMsg }</div> }
                                        </div>
                                        <div className={`${tcssStyles['inputFieldGap']} -mb-2`}>
                                            <label className={`${tcssStyles['label']}`}>
                                                Role Description<br/>
                                                <textarea 
                                                    onInput={(e) => {e.target.style.height = "";e.target.style.height = e.target.scrollHeight + 3 + "px"}}
                                                    name="role_description" 
                                                    value={formData.role_description} 
                                                    onChange={handleChange}
                                                    className={`${tcssStyles['textField']}`}
                                                    placeholder='Enter role description'
                                                >
                                                </textarea>
                                            </label>
                                            { !validationData.role_description.isValid && <div className={`${tcssStyles['inputFieldError']}`}>{ validationData.role_description.errMsg }</div> }
                                        </div>
                                        <div className={`${tcssStyles['inputFieldGap']}`}>
                                            <label className={`${tcssStyles['label']}`}>
                                                Skills Required
                                                <button 
                                                    className={`${isOpen ? tcssStyles.dropdownButtonOpen : tcssStyles.dropdownButtonClosed} flex justify-between`}
                                                    onClick={handleToggleMenu}    
                                                >
                                                    <div>
                                                        Click to select skills
                                                    </div>
                                                    <div>
                                                        {isOpen ? '▲' : '▼'}
                                                    </div>
                                            </button>
                                                <SkillsSelect skillList = {skillList} skillsSelectionList={skillsSelectionList} setSkillsSelectionList={setSkillsSelectionList} show={isOpen} onClose={() => setIsOpen(false)}/>
                                            </label>
                                        </div>
                                        <div>
                                            <SelectedItems skillsSelectionList={skillsSelectionList} setSkillsSelectionList={setSkillsSelectionList}/>
                                            { !validationData.skillsSelected.isValid && <div className={`${tcssStyles['inputFieldError']}`}>{ validationData.skillsSelected.errMsg }</div> }
                                        </div>

                                        <div className={`${tcssStyles['inputFieldGap']}`}>
                                            <label className={`${tcssStyles['label']}`}>
                                                Salary
                                                <input
                                                    type="number"
                                                    name="salary"
                                                    value={formData.salary}
                                                    min="0"
                                                    onChange={handleChange}
                                                    className={`${tcssStyles['textField']}`}
                                                    placeholder='Enter salary'
                                                >
                                                </input>
                                            </label>
                                            { !validationData.salary.isValid && <div className={`${tcssStyles['inputFieldError']}`}>{ validationData.salary.errMsg }</div> }
                                        </div>
                                        <div className={`${tcssStyles['inputFieldGap']} flex`}>
                                            <div className='w-1/2 mr-3'>
                                                <label className={`${tcssStyles['label']}`}>
                                                    Start Date
                                                    <input
                                                        type="date"
                                                        name="start_date"
                                                        value={formData.start_date}
                                                        onChange={handleChange}
                                                        className={`${tcssStyles['textField']}`}
                                                        onClick={handleClickDateInput}
                                                    />
                                                </label>
                                                { !validationData.start_date.isValid && <div className={`${tcssStyles['inputFieldError']}`}>{ validationData.start_date.errMsg }</div> }
                                            </div>
                                            <div className='w-1/2'>
                                                <label className={`${tcssStyles['label']}`}>
                                                    End Date
                                                    <input
                                                        type="date"
                                                        name="end_date"
                                                        value={formData.end_date}
                                                        onChange={handleChange}
                                                        className={`${tcssStyles['textField']}`}
                                                        onClick={handleClickDateInput}
                                                    />
                                                </label>
                                                { !validationData.end_date.isValid && <div className={`${tcssStyles['inputFieldError']}`}>{ validationData.end_date.errMsg }</div> }
                                            </div>
                                        </div>
                                        <button
                                            className={`${tcssStyles['submitButton']}`}
                                            onClick={validate}
                                        >
                                            Publish Role
                                        </button>
                                        <button
                                            className={`${tcssStyles['resetButton']} ml-1`}
                                            onClick={() => setIsModal3(true)}
                                        >
                                            Reset
                                        </button>
                                        {/* <div className='mt-8'>
                                            Form Data:
                                            <p>Role Name: {formData.role_name}</p>
                                            <p>Role Description: {formData.role_description}</p>
                                            <p>Start Date: {formData.start_date}</p>
                                            <p>End Date: {formData.end_date}</p>
                                            <p>Department: {formData.dept}</p>
                                            <p>Salary: {formData.salary}</p>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Create Confirmation Modal */}
                    <Modal className="w-1/5 h-fit text-center" show={isModal1} onClose={() => setIsModal1(false)}>
                        <div className="px-3">
                            <h1 className="text-2xl font-semibold text-slate-600">Confirmation</h1>
                            <p className='text-slate-600 font-xs font-normal'>Are you sure you want to publish this listing?</p>
                            <div className="grid grid-cols-2 justify-center">
                                <button className="bg-white text-slate-400 font-semibold rounded-lg py-2 mt-4 border border-slate-400 hover:bg-slate-100 hover:border-slate-700 hover:text-slate-700 transition duration-200 ease-in-out" onClick={handleSubmit}>
                                    Yes
                                </button>
                                <button className="ml-1 bg-blurple text-white font-semibold rounded-lg py-2 mt-4 border border-blurple hover:bg-transparent hover:border-blurple hover:text-blurple transition duration-200 ease-in-out" onClick={() => setIsModal1(false)}>
                                    No
                                </button>
                            </div>
                        </div> 
                    </Modal>

                    {/* Success Confirmation Modal */}
                    <Modal className="w-1/5 h-fit text-center" show={isModal2} onClose={() => {setIsModal2(false); router.push("/roles/listings");}}>
                        <div className="px-3">
                            <h1 className="text-2xl font-semibold text-slate-600">{modalContent.header}</h1>
                            <p className='text-slate-600 font-xs font-normal'>{modalContent.msg}</p>
                            <div className="flex justify-center mt-2">
                            <button className={`${tcssStyles['submitButton']}`} onClick={() => {setIsModal2(false); router.push("/roles/listings");}}> {modalContent.success ? 'Awesome!' : 'Ok'} </button>
                            </div>
                        </div> 
                    </Modal>

                    {/* Reset Confirmation Modal */}
                    <Modal className="w-1/5 h-fit text-center" show={isModal3} onClose={() => setIsModal3(false)}>
                        <div className="px-3">
                            <h1 className="text-2xl font-semibold text-slate-600">Confirmation</h1>
                            <p className='text-slate-600 font-xs font-normal'>Are you sure you want to discard your changes?</p>
                            <div className="grid grid-cols-2 justify-center">
                                <button className="bg-white text-slate-400 font-semibold rounded-lg py-2 mt-4 border border-slate-400 hover:bg-slate-100 hover:border-slate-700 hover:text-slate-700 transition duration-200 ease-in-out" onClick={handleReset}>
                                    Yes
                                </button>
                                <button className="ml-1 bg-blurple text-white font-semibold rounded-lg py-2 mt-4 border border-blurple hover:bg-transparent hover:border-blurple hover:text-blurple transition duration-200 ease-in-out" onClick={() => setIsModal3(false)}>
                                    No
                                </button>
                            </div>
                        </div> 
                    </Modal>
                </main>
            );
        }
        else {
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
    }
    else {
        router.push('/api/auth/signin');
        return null;
    }
}