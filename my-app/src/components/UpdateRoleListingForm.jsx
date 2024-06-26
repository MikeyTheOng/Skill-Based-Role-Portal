import React, { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

import SkillsSelectDropdownMenu from '@/components/SkillsSelectDropdownMenu.jsx';
import SelectedItemsChips from '@/components/SelectedItemsChips.jsx';
import Modal from '@/components/Modal.jsx';

import { compareTwoDates } from '@/utils/compareTwoDates.js'
import { validateGreaterTodayDate } from '@/utils/validateGreaterTodayDate.js'
import { AiOutlineConsoleSql } from 'react-icons/ai';

export default function Component({ setIsValidListingID, tcssStyles }) {
    const router = useRouter();
    const listing_id = router.query.id;

    // deptList is an array of objects (value, label)
    const [deptList, setDeptList] = useState([{ value: '', label:'' }]);
    // skillList is an array of skill names
    const [skillList, setSkillList] = useState([]);
    // Listing's & raw Skills Data retrieved from database
    const [listingData, setListingData] = useState({
        listingData: {
            role_name: '',
            role_description: '',
            start_date: '',
            end_date: '',
            dept: deptList[0].label,
            salary: ''
        },
        skillsData:{
            skills: []
        }
    });
    useEffect(() => {
        console.log("Listing Data:", listingData);
    }, [listingData]);
    const [originalSkillsData, setOriginalSkillsData] = useState([]);

    // modal
    const [modalContent, setModalContent] = useState({
        success: false,
        header: "",
        msg: "",
    });
    const [isModal1, setIsModal1] = useState(false); // Update confirmation
    const [isModal2, setIsModal2] = useState(false); // Success modal
    const [isModal3, setIsModal3] = useState(false); // Cancel confirmation
    const [isModal4, setIsModal4] = useState(false); // Cancel modal

    // Update formData & skillsSelection with listing data retrieved from database
    useEffect(() => {
        function updateFormDataAndSkills() {
            // console.log("Listing Data State:", listingData);
            setFormData(listingData['listingData']);

            // *set skillsSelectionList
            for (let skill of listingData['skillsData']["skills"]) {
                // console.log("Skill:", skill);
                const skillIndex = skillsSelectionList.findIndex(item => item.skill === skill.skill);
                // console.log("skillIndex:", skillIndex);
                let tempSkillList = [...skillsSelectionList];
                // console.log(tempSkillList, skillIndex)
                tempSkillList[skillIndex].isSelected = true;
                // console.log("Temp Skill List:", tempSkillList)
                setSkillsSelectionList(tempSkillList);
                setOriginalSkillsData(tempSkillList);
            }
        }
        console.log("Length:", listingData['skillsData']['skills'].length);
        if (listingData['skillsData']['skills'].length > 0){
            updateFormDataAndSkills();
        }
    }, [listingData])

    // Retrieve departments, skills and listing data from api routes
    useEffect(() => {
        async function fetchDeptsAndSkillsAndListingData() {
            // console.log("Fetching Departments and Skills");
            axios.get('/api/get-departments')
            .then(response => {
                // console.log('Data:', response.data);
                setDeptList(response.data['response'])
                // console.log("Departments:", response.data['response']);
            })
            .catch(error => {
                console.error('Fetching Departments Error:', error);
            });

            axios.get('/api/get-skills')
            .then(response => {
                // console.log('Skills:', response.data);
                setSkillList(response.data['response'])
                // console.log("Skills:", response.data['response']);
            })
            .catch(error => {
                console.error('Fetching Skills Error:', error);
            });

            axios.get(`/api/get-listing-data/${listing_id}`)
            .then(response => {
                if (response.status === 204){
                    console.log('(No Listing Found) Listing Data:', response)
                    setIsValidListingID(false);
                } else {
                    setIsValidListingID(true);
                    // console.log("Listing Data:", response.data);
                    const roleListingData = response.data['response']['listingData'];
                    const roleSkillsData = response.data['response']['skillsData'];
                    
                    // need to convert date to proper format for input type="date"
                    const start_date = new Date(roleListingData.start_date);
                    const start_date_formatted = start_date.toISOString().split('T')[0];
                    const end_date = new Date(roleListingData.end_date);
                    const end_date_formatted = end_date.toISOString().split('T')[0];

                    let updatedFormData = {
                        role_name: roleListingData.role_name,
                        role_description: roleListingData.role_description,
                        start_date: start_date_formatted,
                        end_date: end_date_formatted,
                        dept: roleListingData.dept,
                        salary: roleListingData.salary
                    }
                    setListingData({"listingData":updatedFormData, "skillsData":roleSkillsData});
                }
            })
            .catch(error => {
                console.error('Fetching Listing Data Error:', error);
            });
        }
        if (listing_id){
            fetchDeptsAndSkillsAndListingData();
        }
    }, [listing_id]);
    
    // Initialize skillsSelectionList to track skills selected by user
    const [skillsSelectionList, setSkillsSelectionList] = useState([{ skill: '', isSelected: false}]);
    // useEffect(() => {
    //     console.log("skillsSelectionList:", skillsSelectionList);
    // }, [skillsSelectionList]);
    // Mount skillsSelectionList with skills retrieved from database
    useEffect(() => {
        function mountSkillsSelectionList () {
            // console.log("Mounting skills...");
            const tempSkillList = [];
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
        }
        if (skillList.length > 0) {
            mountSkillsSelectionList();
        }
    }, [skillList]);

    // track user's input in form
    const [formData, setFormData] = useState({
        role_name: '',
        role_description: '',
        start_date: '',
        end_date: '',
        dept: deptList[0].label,
        salary: ''
    });
    // useEffect(() => {
    //     console.log("formData:", formData);
    // }, [formData]);
    // check if form is dirty
    // Track user's input in form fields
    const [isDirty, setIsDirty] = useState(false); // to track if user has interacted with form fields
    useEffect(() => {
        function checkSkills() {
            // console.log("Original Skills:", originalSkillsData);
            // console.log("Current Skills:", skillsSelectionList);
            for(let skill of originalSkillsData) {
                const skillIndex = skillsSelectionList.findIndex(item => item.skill === skill.skill);
                if(skill.isSelected != skillsSelectionList[skillIndex].isSelected) {
                    // console.log(skillIndex)
                    // console.log("Dirty");
                    return true;
                }
            }
            // console.log("Clean")
            return false;
        }
        function checkForm(){
            const [role_name, role_description, start_date, end_date, dept, salary] = Object.values(formData);
            if(role_name != listingData['listingData']['role_name'] || role_description != listingData['listingData']['role_description'] || start_date != listingData['listingData']['start_date'] || end_date != listingData['listingData']['end_date'] || dept != listingData['listingData']['dept'] || salary != listingData['listingData']['salary'] || checkSkills()) {
                setIsDirty(true);
            } else {
                setIsDirty(false);
            }
        }
        checkForm();
        checkSkills();
    }, [formData, skillsSelectionList]);
    // prompt the user if they try and leave with unsaved changes  
    useEffect(() => {
        // console.log("Mounted");
        const warningText =
            'You have unsaved changes - are you sure you wish to leave this page?';
        const handleWindowClose = (e) => {
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

    // form validation w messages
    const [validationData, setValidationData] = useState({
        role_name: { isValid: true, errMsg: ''},
        role_description: { isValid: true, errMsg: ''},
        end_date: { isValid: true, errMsg: ''},
        dept: { isValid: true, errMsg: ''},
        salary: { isValid: true, errMsg: ''},
        skillsSelected: { isValid: true, errMsg: ''},
    });

    const handleCancel = () => {
        console.log("Reset Form");
        setFormData(listingData["listingData"]);
        setSkillsSelectionList(originalSkillsData);
        setIsModal3(false);
    }

    // Handle validation before allowing user to submit form
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

        var edValid = true; var edMsg = "";
        if (!formData.end_date) {
            edValid = false;
            edMsg = "Field is required";
        } else {
            var dateProb = [];
            if ( compareTwoDates(formData.start_date, formData.end_date) ) {
                edValid = false;
                // edMsg = "End date is before Start date";
                dateProb.push("is before Start date");
            }
            
            if ( !validateGreaterTodayDate(formData.end_date) ) {
                edValid = false;
                dateProb.push("has passed");
            }

            edMsg = `End date ${dateProb.join(" and ")}`;
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
            end_date: { 'isValid': edValid, 'errMsg': edMsg},
            dept: { 'isValid': deptValid, 'errMsg': deptMsg},
            salary: { 'isValid': salaryValid, 'errMsg': salaryMsg},
            skillsSelected: { 'isValid': skillValid, 'errMsg': skillMsg},
        }));
        
        if (roleNameValid && descValid && edValid && deptValid && salaryValid && skillValid) {
            setIsModal1(true);
        }
    }

    const handleSubmit = async () => {
        setIsModal1(false);

        console.log("Validating Form");
        const updateAPIRoute = `/api/update-listing/${listing_id}`;
        const data = {
            formData: formData,
            skillsSelectionList: skillsSelectionList
        };

        axios.put(updateAPIRoute, data)
        .then(response => {
            console.log('UpdateAPIRoute Response:', response.data);
            setModalContent(() => ({
                success: true,
                header: "Listing Updated!",
                msg: "You will be redirected to the listings page."
            }));
            setIsDirty(false);
            setIsModal2(true);
        })
        .catch(error => {
            console.error('UpdateAPIRoute Error:', error);
            setModalContent(() => ({
                success: false,
                header: "Something went wrong!",
                msg: "Check the console."
            }));
            setIsModal2(true);
        });
    }

    const handleChange = (e) => {
        if (!isModal1) {
            const { name, value } = e.target; // destructuring
            // console.log(name, value);
            if (name === "dept") {
                const dept = deptList.find(deptRow => deptRow.label === value)
                console.log(dept)
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

    // this shows the date picker when user clicks on any date input field
    function handleClickDateInput(e) {
        e.target.showPicker();
    }

    return (
        <div className='px-4'>
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
            <SkillsSelectDropdownMenu skillsSelectionList={skillsSelectionList} setSkillsSelectionList={setSkillsSelectionList} tcssStyles={tcssStyles} />
            
            <div>
                <SelectedItemsChips skillsSelectionList={skillsSelectionList} setSkillsSelectionList={setSkillsSelectionList}/>
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
                            disabled
                            className={`${tcssStyles['textField']}`}
                        />
                    </label>
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
                            onClick={ handleClickDateInput }
                        />
                    </label>
                    { !validationData.end_date.isValid && <div className={`${tcssStyles['inputFieldError']}`}>{ validationData.end_date.errMsg }</div> }
                </div>
            </div>
            <div className='flex justify-between'>
                <div>
                    <button
                        className={`${tcssStyles['submitButton']} mr-1`}
                        onClick={validate}
                    >
                        Update Role
                    </button>
                    <button
                        className={`${tcssStyles['resetButton']}`}
                        onClick={() => setIsModal3(true)}
                    >
                        Reset
                    </button>
                </div>
                <div>
                    {/* <button
                        className={`${tcssStyles['resetButton']}`}
                        // onClick={}
                    >
                        Cancel
                    </button> */}
                </div>
            </div>
            
            {/* Update Confirmation Modal */}
            <Modal className="w-1/5 h-fit text-center" show={isModal1} onClose={() => setIsModal1(false)}>
                <div className="px-3">
                    <h1 className="text-2xl font-semibold text-slate-600">Confirmation</h1>
                    <p className='text-slate-600 font-xs font-normal'>Are you sure you save the changes made to the listing?</p>
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
            
            {/* Success Modal */}
            <Modal className="w-1/5 h-fit text-center" show={isModal2} onClose={() => {setIsModal2(false); router.push('/roles/listings');}}>
                <div className="px-3">
                    <h1 className="text-2xl font-semibold text-slate-600">{modalContent.header}</h1>
                    <p className='text-slate-600 font-xs font-normal'>{modalContent.msg}</p>
                    <div className="flex justify-center mt-2">
                        <button className={`${tcssStyles['submitButton']}`} onClick={() => {setIsModal2(false); router.push('/roles/listings');}}> {modalContent.success ? 'Awesome!' : 'Ok'} </button>
                    </div>
                </div> 
            </Modal>

            {/* Reset Confirmation Modal */}
            <Modal className="w-1/5 h-fit text-center" show={isModal3} onClose={() => setIsModal3(false)}>
                <div className="px-3">
                    <h1 className="text-2xl font-semibold text-slate-600">Confirmation</h1>
                    <p className='text-slate-600 font-xs font-normal'>Are you sure you want to discard your changes?</p>
                    <div className="grid grid-cols-2 justify-center">
                        <button className="bg-white text-slate-400 font-semibold rounded-lg py-2 mt-4 border border-slate-400 hover:bg-slate-100 hover:border-slate-700 hover:text-slate-700 transition duration-200 ease-in-out" onClick={handleCancel}>
                            Yes
                        </button>
                        <button className="ml-1 bg-blurple text-white font-semibold rounded-lg py-2 mt-4 border border-blurple hover:bg-transparent hover:border-blurple hover:text-blurple transition duration-200 ease-in-out" onClick={() => setIsModal3(false)}>
                            No
                        </button>
                    </div>
                </div> 
            </Modal>

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
    );
}