

import { okxHttp } from "@/http/server";
import { queryClickHouse } from "@/utils/server/test";
import withErrorHandler from "@/utils/server/withErrorHandler";
import type { NextApiRequest, NextApiResponse } from 'next'


async function handler(req: NextApiRequest, res: NextApiResponse) {
  // const { __slug, ...params  } = req.query || {}
  const result = await queryClickHouse(
    'show databases',
    'JSON'
  )
  console.log(result)
  return res.json(result);
}

export default withErrorHandler(handler)