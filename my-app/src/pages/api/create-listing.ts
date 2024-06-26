import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';
import { createConnection } from 'mysql2/promise';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const roleListingUrl = 'http://127.0.0.1:5002/listing';
    const roleSkillsUrl = 'http://127.0.0.1:5003/role_skill';

    const data = req.body; // this is JSON string already
    // const requestData = JSON.parse(data);
    // return res.status(200).json({ "response from server" : requestData });

    // Convert the data object to a JSON string
    // const jsonData = JSON.stringify(requestData);

    // Define the headers for the request, including the content type
    const headers = {
        'Content-Type': 'application/json'
    };

        // return res.status(200).json({ "response from server" : data });

    if(req.method==='POST'){
        const skillsArr = data.skillsArr;
        const selectedSkillsArr: any[] = [];
        for (let skill of skillsArr) {
            if (skill.isSelected) {
                selectedSkillsArr.push(skill);
            }
        }
        
        //* Create role listing
        await axios.post(roleListingUrl, 
            data, 
            { headers: headers }
            )
        .then(response => {
            // Check if the response status code indicates success (e.g., 200 OK)
            const roleListingResult = {
                response: response.data,
                status: response.status
            }
            const listing_id = roleListingResult.response.data.listing_id;
            const data = {
                "listing_id": listing_id,
                skillsArr: selectedSkillsArr
            }

            //* Create role skills
            axios.post(
                roleSkillsUrl, data, { headers: headers }
            )
            .then(response => {
                res.status(200).json({ response: "listing and skills successfully created" });
            })
            .catch(error => {
                res.status(400).json({ error: error });
            })
        })  
        .catch(error => {
            // Handle any errors that occurred during the fetch
            res.status(400).json({error: error});
            console.error('Fetch error:', error);
        });
    } else {
        res.status(200).json({ response: "create-listing is online!"})
    }
}