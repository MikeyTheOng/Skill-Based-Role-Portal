import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession, signIn, signOut } from 'next-auth/react';
import { comma } from 'postcss/lib/list';


const DropdownCheckboxMenu = ({ updateListings }) => {

  const [isOpen, setIsOpen] = useState(false);

  // session data
  const { data, status } = useSession();
  // console.log("Session:", data);
  // console.log("Status:", status);

  

  // department
  const [departmentData, setDepartmentData] = useState([]);

  useEffect( () => {
      axios.get('http://localhost:3000/api/get-departments')
      .then((response) => {
        setDepartmentData(response.data.response);
      })
      .catch((error) => {
        console.error('Error fetching department data:', error);
      });
  }, []);

  // skill
  const [skillData, setSkillData] = useState([]);

  useEffect( () => {
     axios.get('http://localhost:3000/api/get-skills')
      .then((response) => {
        setSkillData(response.data.response);
      })
      .catch((error) => {
        console.error('Error fetching skill data:', error);
      });
  }, []); 

  const [selectedSkills, setSelectedSkills] = useState([]); 
  const [selectedDepartments, setSelectedDepartments] = useState([]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const toggleCheckbox = (option, category) => {
    if (category === "department") {
      if (selectedDepartments.includes(option)) {
        setSelectedDepartments(selectedDepartments.filter(item => item !== option));
      } else {
        setSelectedDepartments([...selectedDepartments, option]);
      }
    } else if (category === "skill") {
      if (selectedSkills.includes(option)) {
        setSelectedSkills(selectedSkills.filter(item => item !== option));
      } else {
        setSelectedSkills([...selectedSkills, option]);
      }
    }
  };

  // const [departmentResponse, setDepartmentResponse] = useState([]);
  // const [skillResponse, setSkillResponse] = useState([]);
      
  const applyFilter = () => {
    // if filter only by department
    // console.log("selectedDepartments:", selectedDepartments);
    // console.log("selectedSkills:", selectedSkills);

    if (selectedDepartments.length > 0 && selectedSkills.length == 0) {
      const departmentQueries = 'departments=' + selectedDepartments.join(',');
      // console.log("Link:", `http://localhost:5002/filter-by-department?${departmentQueries}`);
      axios.get(`http://localhost:5002/filter-by-department?${departmentQueries}`)
      .then((response) => {
        // console.log("Filtered by Department:",response.data);
        updateListings(response.data.roles);
      })
      .catch((error) => {
        console.error('Error filtering by department:', error);
        updateListings([])
      });
    }

    // if filter only by skills
    else if (selectedDepartments.length == 0 && selectedSkills.length > 0 ){
      const skillQueries = 'skill_names=' + selectedSkills.join(',');
      axios.get(`http://localhost:5002/api/filter-roles?${skillQueries}`)
      .then((response)=>{
        // console.log("Filtered by Skill:",response.data);
        updateListings(response.data.roles);
        // console.log(response.config.url)
        })
      .catch((error) => {
        console.error('Error filtering by skill:', error);
        updateListings([])
      });
    }

    // if filter by both skills and departments
    else if (selectedDepartments.length > 0 && selectedSkills.length > 0 ){

      const departmentQueries = 'departments=' + selectedDepartments.join(',');
      axios.get(`http://localhost:5002/filter-by-department?${departmentQueries}`)
      .then((response) => {
        // console.log("Filtered by Department:",response.data);
        const departmentResponse = response.data.roles;

        const skillQueries = 'skill_names=' + selectedSkills.join(',');
        axios.get(`http://localhost:5002/api/filter-roles?${skillQueries}`)
        .then((response)=>{
          // console.log("Filtered by Skill:",response.data);
          const skillResponse = response.data.roles;
          const commonListings = departmentResponse.filter(listing1 => skillResponse.some(listing2 => listing1.listing_id === listing2.listing_id));
          updateListings(commonListings)
          })
        .catch((error) => {
          console.error('Error filtering by skill:', error);
          updateListings([])
        });        
      })
      .catch((error) => {
        console.error('Error filtering by department:', error);
        updateListings([])
      });
    }

    // if no filter
    else{
      axios.get(`http://localhost:5002/filter-by-department`)
      .then((response) => {
        // console.log("Filtered by Department:",response.data);
        updateListings(response.data.roles);
      })
      .catch((error) => {
        console.error('Error filtering by department:', error);
        updateListings([])
      });
    }
    toggleDropdown();
  };

  const resetSelection = () => {
    setSelectedSkills([]); 
    setSelectedDepartments([]);
  };

  return (
    <div data-testid="filterMenu" className="relative inline-block h-full">
      <button
        data-testid="filterButton"
        onClick={toggleDropdown}
        className="justify-center w-full rounded-lg bg-blurple text-white px-4 py-2 h-full border border-transparent hover:bg-transparent hover:border-blurple hover:text-blurple transition duration-300 ease-in-out"
      >
        Filter ▾
      </button>
      {isOpen && (
        <div className="origin-top-right flex flex-col absolute right-0 mt-2 px-10 py-6 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1 flex flex-row" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <div className='border-e-2 pr-5 w-56'>
              <p className='font-bold'>Departments</p>
              <p data-testid="deptSelected" className='text-xs opacity-70'>{selectedDepartments.length} selected</p>
              <div className="overflow-y-auto max-h-40">
                {departmentData.map((departmentItem) => (
                <label
                  data-testid={departmentItem.label}
                  key={departmentItem.value} 
                  className="flex items-center pe-4 py-2"
                  role="menuitem"
                >
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 me-3 text-blurple transition duration-150 ease-in-out"
                    onChange={() => toggleCheckbox(departmentItem.label, 'department')}
                    checked={selectedDepartments.includes(departmentItem.label)}
                  />
                  {departmentItem.label}
                </label>
              ))}
              </div>
            </div>
            <div className='pl-5 w-56'>
              <p className='font-bold'>Skills</p>
              <p data-testid="skillsSelected" className='text-xs opacity-70'>{selectedSkills.length} selected</p>
              <div className="overflow-y-auto max-h-40">
              {skillData.length === 0 ? (
                <p data-testid='noListing' className='h-screen flex items-center justify-center font-bold'>No skill found.</p>
                  ) : (
                    <div>
                  {skillData.map((skill) => (
                    <label
                      data-testid={skill}
                      key={skill}
                      className="flex items-center pe-4 py-2"
                      role="menuitem"
                    >
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 me-3 text-blurple transition duration-150 ease-in-out"
                      onChange={() => toggleCheckbox(skill, 'skill')}
                      checked={selectedSkills.includes(skill)}
                    />
                    {skill}
                  </label>
                ))}
                </div>
                )}
              </div>
            </div>
          </div>
          <div className='flex justify-between'>
            <button 
              data-testid='resetButton'
              className='rounded-lg mt-6 mb-2 p-2 w-20 border-2 border-black border-opacity-80'
              onClick={resetSelection} 
            >
              Reset
            </button>
            <button className='rounded-lg mt-6 mb-2 p-2 w-20 bg-blurple text-white' 
              type="submit"
              onClick={applyFilter}
              data-testid='applyButton'
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownCheckboxMenu;
