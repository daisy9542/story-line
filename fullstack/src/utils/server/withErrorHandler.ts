
import type { NextApiRequest, NextApiResponse } from 'next'

function withErrorHandler(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await handler(req, res);
    } catch (error: any) {
      console.error('API Error:', error);
      if (Object.hasOwn(error, 'code') && Object.hasOwn(error, 'msg')) {
        res.status(200).json(error)
      } else {
        res.status(500).json({ 
          code: '500', 
          msg: error.message || 'Internal Server Error'
        });
      }
    }
  };
}
export default withErrorHandler;