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

        // *Get role listing for the listing_id
        axios.get(roleListingUrl)
        .then(response => {
            // console.log("roleListing Response:", response);
            if(response.status === 204){
                // ! If no listing is found, return 204
                res.status(204).json({ response: "No listing found" });
            } else {
                const roleListingData = response.data.data;
                // console.log("Role Listing Response:", response);
                // *Get role skills for the listing_id
                axios.get(roleSkillsUrl)
                .then(response => {
                    const roleSkillsData = response.data.data;
                    const responseData = {
                        listingData: roleListingData,
                        skillsData: roleSkillsData
                    };
                    // console.log(responseData);
                    res.status(200).json({ response: responseData });
                })
            }
        })
        .catch(error => {
            // if(error.data.code === 404){
            //     res.status(404).json({ service: error.data.service, error: error.data.message });
            // }
            console.error("Fetch error:", error);
            res.status(400).json({ error: error});
        })
    } catch (err) {
        res.status(400).json({ error: err })
    }
}

