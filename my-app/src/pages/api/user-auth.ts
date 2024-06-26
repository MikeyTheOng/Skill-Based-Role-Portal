import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';
import { createConnection } from 'mysql2/promise';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const url = 'http://127.0.0.1:5100/get-user';
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
        await axios.post(url, data, 
            { headers: headers }
        )
        .then(response => {
            // Check if the response status code indicates success (e.g., 200 OK)
            const result = {
                response: response.data,
                status: response.status
            }
                
            res.status(200).json({ response: result });
        })  
        .catch(error => {
            // Handle any errors that occurred during the fetch
            res.status(400).json({error: error});
            console.error('Fetch error:', error);
        });
    } else {
        res.status(200).json({ response: "user-auth is online!"})
    }
}