// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios, { AxiosHeaders } from 'axios';

// ! This api route returns the following data object:
// {
//   listingData: {
//     dept: 'Technology',
//     end_date: 'Sun, 31 Dec 2023 00:00:00 GMT',
//     listing_id: 1,
//     role_description: 'Front-end development for web applications',
//     role_name: 'Software Engineer',
//     salary: 80000,
//     start_date: 'Wed, 20 Sep 2023 00:00:00 GMT'
//   },
//   skillsData: { skills: [ [Object], [Object], [Object] ] }
// }

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const listing_id = req.query.listing_id;
        // res.status(200).json({ response: listing_id });
        const roleListingUrl = `http://127.0.0.1:5002/listing/${listing_id}`;
        const roleSkillsUrl = `http://127.0.0.1:5003/role_skill/${listing_id}`;

        const data = req.body; // this is JSON string already
        const skills = [];
        for (let skill of data['skillsSelectionList']) {
            if (skill.isSelected) {
                skills.push(skill.skill);
            };
        }
        // const newObj = {data: skills}
        // console.log("Skills:", newObj);
        // *Update role listing for the listing_id
        axios.put(roleListingUrl, data['formData'])
        .then(response => {
            const updatedRoleListing = response.data;
            // console.log("Role Listing Response:", response);
            // *Update role skills for the listing_id
            axios.put(roleSkillsUrl, {skills: skills})
            .then(response => {
                const updatedSkillsList = response.data;
                const responseData = {
                    "Updated Role Listing": updatedRoleListing,
                    "Updated Skills List": updatedSkillsList
                };
                // console.log(responseData);
                res.status(200).json({ response: responseData });
            })
        })
        .catch(error => {
            console.error("Fetch error:", error);
            res.status(400).json({ error: error});
        })
    } catch (err) {
        res.status(400).json({ error: err })
    }
}

