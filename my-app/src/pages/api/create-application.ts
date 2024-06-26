import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';
import { createConnection } from 'mysql2/promise';

// ! This API Routes takes in a payload and creates an application
// const payload = {
//     "listing_id": 1,
//     "staff_id": 1,
//     "applicaitonDate": "YYYY-MM-DD",
//     "status": "pending",
// }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const applicationURL = 'http://127.0.0.1:5006/application';

    const data = req.body; // this is JSON string already
    // const requestData = JSON.parse(data);
    // return res.status(200).json({ "response from server" : data });

    // Convert the data object to a JSON string
    // const jsonData = JSON.stringify(requestData);

    // Define the headers for the request, including the content type
    const headers = {
        'Content-Type': 'application/json'
    };

    if(req.method==='POST'){        
        //* Create application
        await axios.post(applicationURL, 
            data, 
            { headers: headers }
            )
        .then(response => {
            // Check if the response status code indicates success (e.g., 200 OK)
            if (response.status === 201) {
                // The request was successful, return the response
                res.status(201).json({ response: response.data });
            } 
        })  
        .catch(error => {
            // Handle any errors that occurred during the fetch
            if (error.response.status === 409){
                res.status(409).json({error: error.response.data});
            } else {
                res.status(400).json({error: error});
            }
        });
    } else {
        res.status(200).json({ response: "create-application is online!"})
    }
}