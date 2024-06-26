import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';
import { createConnection } from 'mysql2/promise';

// ! This API Routes takes in a payload and checks whether the staff has already applied for the listing
// const payload = {
//     "listing_id": 1,
//     "staff_id": 1,
// }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const data = req.query;
    const listing_id = data['slugs'][0];
    const staff_id = data['slugs'][1];
    // res.status(200).json({ "response from server" : data['slugs'] });
    const applicationURL = `http://127.0.0.1:5006/application/${listing_id}/${staff_id}`;

    if(req.method==='GET'){        
        //* Get application
        await axios.get(applicationURL)
        .then(response => {
            // Check if the response status code indicates success (e.g., 200 OK)
            if (response.status === 200) {
                // The request was successful, return the response
                res.status(200).json({ status:200,response: response.data });
            } 
        })  
        .catch(error => {
            // Handle any errors that occurred during the fetch
            if (error.response.status === 404){
                console.error("error.response.data", error.response.data)
                res.status(201).json({status:404, error: error.response.data});
            } else {
                res.status(400).json({error: error});
            }
        });
    } 
}