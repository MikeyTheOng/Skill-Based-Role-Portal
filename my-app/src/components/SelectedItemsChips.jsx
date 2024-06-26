import React from 'react';
import { MdOutlineCancel } from "react-icons/md";

function SkillsChip ({ skill, handleRemoveSkill }) {
    const handleClick = (skill) => {
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


export default function SelectedItems ({ skillsSelectionList, setSkillsSelectionList }) {
    // console.log("SelectedItems", skillsSelectionList)
    const handleRemoveSkill = (skill) => {
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