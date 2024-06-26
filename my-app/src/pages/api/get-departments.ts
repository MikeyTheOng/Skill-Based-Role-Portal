// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // res.status(200).json({ response: "Hola World!"})
        const deptList = [
            { value: 'Human Resources', label:'Human Resources' },
            { value: 'faa', label:'Financial and Accounting'},
            { value: 'Operations', label: 'Operations'},
            { value: 'mkt', label: 'Marketing'},
            { value: 'Technology', label: 'Information Technology'},
            { value: 'eng', label: 'Engineering'},
            { value: 'sales', label: 'Sales'},
            { value: 'Customer Service', label: 'Customer Service'},
            { value: 'other', label: 'Other'}
        ];
        deptList.sort((a, b) => a.label.localeCompare(b.label));

        res.status(200).json({ response: deptList })
    } catch (err) {
        res.status(400).json({ error: 'failed to load data' })
    }
}

