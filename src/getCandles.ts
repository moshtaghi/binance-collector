import BinanceDataProvider from './binanceDataProvider';
import {
  CandleChartInterval,
  CandleChartResult,
  default as BinanceFactory,
} from 'binance-api-node';
import { Client } from 'pg';
import format from 'pg-format';
import { v4 as uuidv4 } from 'uuid';

(async () => {
  if (process.argv.length < 6) {
    console.error(
      'Usage: npm run getCandles <SYMBOL> <START_TIME> <END_TIME> <INTERVAL>'
    );
    console.error(
      'example: npm run getCandles BTCUSDT 2021-01-01T00:00:00.000Z 2022-01-01T00:00:00.000Z 5m'
    );
    process.exit(1);
  }

  const symbol = process.argv[2];
  const startTime = new Date(process.argv[3]).getTime();
  const endTime = new Date(process.argv[4]).getTime();
  const interval = process.argv[5] as CandleChartInterval;

  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'historicals',
    password: 'postgres',
    port: 5432,
  });
  await client.connect();

  const saveCandles = async (
    candles: CandleChartResult[],
    symbol: string,
    interval: CandleChartInterval
  ) => {
    const nestedArray = candles.map((candle) => {
      return [
        uuidv4(),
        candle.openTime,
        candle.open,
        candle.high,
        candle.low,
        candle.close,
        candle.volume,
        candle.closeTime,
        candle.quoteVolume,
        candle.trades,
        candle.baseAssetVolume,
        candle.quoteAssetVolume,
        symbol,
        interval,
      ];
    });
    try {
      const sql = format(
        'INSERT INTO candles ("id","openTime", "open", "high", "low", "close", "volume", "closeTime", "quoteVolume", "trades", "baseAssetVolume", "quoteAssetVolume", "symbol", "interval") VALUES %L',
        nestedArray
      );
      const res = await client.query(sql);
      console.log(
        `${res.rowCount} row inserted. from: ${new Date(
          candles[0].openTime
        ).toISOString()} to: ${new Date(
          candles[candles.length - 1].openTime
        ).toISOString()}`
      );
    } catch (error) {
      console.log('X X X', error);
    }
  };

  const binance = new BinanceDataProvider(BinanceFactory());

  binance.getCandles(startTime, endTime, symbol, interval, saveCandles);
})();
