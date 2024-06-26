import React, { useState, useEffect, useRef } from 'react';
// ! This component takes in a state variable (list of skills), setter method for state variable and returns a dropdown menu of skills
// skillsSelectionList = [
    // {skill: 'Budgeting and Forecasting', isSelected: false},
    // {skill: 'Customer Relationship Management (CRM)', isSelected: false},
    // {skill: 'Database Management', isSelected: false},
// ]

export default function SkillsSelect({ skillsSelectionList, setSkillsSelectionList, tcssStyles}) {
    const SkillsSelectStyles = {
        listOfSkills : 'mt-2 h-36 overflow-y-auto bg-slate-50 shadow-lg shadow-gray-300 border border-slate-200 rounded-md p-2 w-full focus:outline-blurple',
        liItem : 'w-full py-1 px-2 border border-transparent rounded-md hover:border-slate-100 hover:bg-slate-100 cursor-pointer',
        liItemSelected: 'w-full py-1 px-2 border border-slate-200 bg-slate-200 rounded-md'
    }
    // Handle dropdown menu state
    const [isOpen, setIsOpen] = useState(false);
    const handleToggleMenu = (e) => {
        console.log("Toggle button clicked");
        setIsOpen(!isOpen);
    }

    const onClose = () => setIsOpen(false);
    
    // keep track of whether user has clicked outside of dropdown menu
    const dropdownSkills = useRef(null);
    const checkClick = (event) => {
        if (isOpen && dropdownSkills.current && !dropdownSkills.current.contains(event.target) ) {
            onClose();
        }
    };
    
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                document.addEventListener('click', checkClick);
            },50);
        }
        return () => {
            document.removeEventListener('click', checkClick);
        };
    }, [isOpen]);

    const handleSelect = (e) => {
        // console.log("Handle Selection")
        const { name, value, checked } = e.target; // destructuring (value refers to skill name)
        // deptList.find(deptRow => deptRow.value === value)
        // console.log( name, value, checked );
        const updatedSkillsSelectionList = [];
        for( let skillRow of skillsSelectionList ) {
            if (skillRow.skill === value) {
                let tempSkillRow = {
                    "skill": skillRow.skill,
                    isSelected: !skillRow.isSelected
                }
                // console.log("Temp Skill Row:", tempSkillRow);
                updatedSkillsSelectionList.push(tempSkillRow);
            } else {
                updatedSkillsSelectionList.push(skillRow);
            }
        }
        setSkillsSelectionList(updatedSkillsSelectionList);
        // console.log("Updated Skills List:", updatedSkillsSelectionList);
    }

    return (
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
                <div ref={dropdownSkills} id="skills-dropdown-menu" className={`${isOpen ? "" : "hidden"} relative`}>
                    <div id='list-of-skills' className={`${SkillsSelectStyles.listOfSkills} absolute`}>

                        <ul className='grid grid-cols-3 gap-1 px-1 py-1'>
                            {skillsSelectionList.map((skill) => {
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
            </label>
        </div>
        
    );
}