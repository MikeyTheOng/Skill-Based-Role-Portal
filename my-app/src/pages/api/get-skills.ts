// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // res.status(200).json({ response: "Hola World!"})
        const skillList = [
            'CSS',
            'HTML',
            'Leadership',
            'Financial Analysis',
            'Budgeting and Forecasting',
            'Network Administration',
            'Database Management',
            'Customer Relationship Management (CRM)',
            'React JS',
            'Vuejs',
            'Express JS',
            'English',
            'Mandarin',
            'Spanish',
            'French',
            'German',
        ];
        skillList.sort();

        res.status(200).json({ response: skillList })
    } catch (err) {
        res.status(400).json({ error: 'failed to load data' })
    }
}
