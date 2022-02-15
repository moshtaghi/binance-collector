import { Binance, CandleChartInterval } from 'binance-api-node';

class BinanceDataProvider {
  client: Binance;

  constructor(DataFactory: Binance) {
    this.client = DataFactory;
    this.client.time();
  }

  async _getCandles(
    endTime: number,
    interval: CandleChartInterval,
    symbol: string
  ): Promise<any> {
    return await this.client.candles({
      limit: 1000,
      interval,
      symbol,
      endTime,
    });
  }

  async getCandles(
    startTime: number,
    endTime: number,
    symbol: string,
    interval: CandleChartInterval,
    callback: Function
  ): Promise<void> {
    const candles = await this._getCandles(endTime, interval, symbol);
    if (candles) callback(candles, symbol, interval);
    var oldestTime = candles[0].openTime;
    while (oldestTime > startTime) {
      const candles = await await this._getCandles(
        oldestTime - 1,
        interval,
        symbol
      );
      if (candles.length > 0) {
        callback(candles, symbol, interval);
      } else {
        console.log('ERROR', candles);
      }
      oldestTime = candles[0].openTime;
    }
    console.log('after while');
  }

  // async getHistoricalCandles(
  //   endTime: number,
  //   symbol: string,
  //   interval: CandleChartInterval,
  //   callback: Function
  // ): Promise<void> {
  //   const candles = await this.client.candles({
  //     interval,
  //     symbol,
  //     limit: 1000,
  //     endTime: endTime - 1,
  //   });
  //   if (candles) callback(symbol, interval, candles);
  // }
}

export default BinanceDataProvider;
