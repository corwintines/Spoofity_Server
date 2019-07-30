import { Pool, PoolClient } from 'pg';
import { PG_URL } from '../../const';

const pool = new Pool({
  connectionString: PG_URL
});

type QueryFunction<T> = (client: PoolClient) => Promise<T>;

export async function connect<T>(
  queryFunction: QueryFunction<T>,
  transaction?: PoolClient
) {
  const client = transaction || (await pool.connect());
  try {
    const result = await queryFunction(client);
    return result;
  } finally {
    if (!transaction) client.release();
  }
}

export async function transaction<T>(queryFunction: QueryFunction<T>) {
  const client = await pool.connect();
  try {
    client.query('BEGIN');
    const result = await queryFunction(client);
    client.query('COMMIT');
    return result;
  } finally {
    client.query('ROLLBACK');
    client.release();
  }
}

export async function query<T = any>(
  queryStr: string,
  values?: any[],
  transaction?: PoolClient
) {
  return await connect(
    async (client) => {
      const { rows } = await client.query(queryStr, values);
      return rows as T[];
    },
    transaction
  );
}

export async function querySingle<T = any>(
  queryStr: string,
  values?: any[],
  transaction?: PoolClient
) {
  const result = await query(queryStr, values, transaction);
  if (!result || !result.length) return undefined;
  return result[0] as T;
}
