import mysql from 'serverless-mysql';

const db = mysql({
  config: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
});

interface QueryParams {
  query: string;
  values: (string | number | boolean | null)[];
}

export async function executeQuery({ query, values = [] }: QueryParams): Promise<Record<string, unknown>[]> {
  try {
    const results = await db.query(query, values);
    await db.end();
    return results as Record<string, unknown>[];
  } catch (error) {
    console.error('Database query error:', error);
    throw new Error('Database query failed');
  }
}