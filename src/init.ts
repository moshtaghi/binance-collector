import { Client } from 'pg';

(async () => {
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'historicals',
    password: 'postgres',
    port: 5432,
  });
  await client.connect();
  const sql = `CREATE TABLE IF NOT EXISTS "public"."candles" ("id" uuid NOT NULL,"openTime" numeric,"open" text,"high" text,"low" text,"close" text,"volume" text,"closeTime" numeric,"quoteVolume" text,"trades" numeric,"baseAssetVolume" text,"quoteAssetVolume" text,"symbol" text,"interval" text, PRIMARY KEY ("id"));`;
  try {
    const result = await client.query(sql);
    console.log(result.command, 'table successfully');
  } catch (error) {
    console.log(error);
  }
})();
