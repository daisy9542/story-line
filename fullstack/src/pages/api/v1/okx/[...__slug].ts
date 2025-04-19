import { okxHttp } from "@/http/server";
import withErrorHandler from "@/utils/server/withErrorHandler";
import type { NextApiRequest, NextApiResponse } from 'next'


async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { __slug, ...params  } = req.query || {}
  if(!__slug || typeof __slug === 'string') {
    throw new Error('请求路径错误')
  }
  let result:any;
  if (req.method === 'GET') {
    result = await okxHttp.get(__slug.join('/'), params);
  } else if (req.method === 'POST') {
    result = await okxHttp.post(__slug.join('/'), req.body);
  } else {
    return res.status(405).json({ code:'405', msg: 'Method not allowed' });
  }
  return res.json(result);
}

export default withErrorHandler(handler)