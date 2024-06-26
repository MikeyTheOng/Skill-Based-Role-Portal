// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // const result = await someAsyncOperation()
    res.status(200).json({ result: 'hello world' })
  } catch (err) {
    res.status(400).json({ error: 'failed to load data' })
  }
}

// type Data = {
//   name: string
// }

// export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
//   res.status(200).json({ name: 'John Doe' })
// }

