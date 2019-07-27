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
    client.release();
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

export async function query(
  query: string,
  values?: any[],
  transaction?: PoolClient
) {
  return await connect(
    async (client) => {
      const { rows } = await client.query(query, values);
      return rows;
    },
    transaction
  );
}
