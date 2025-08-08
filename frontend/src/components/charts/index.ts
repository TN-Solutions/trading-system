import dynamic from 'next/dynamic';

const TradingChart = dynamic(() => import('./trading-chart').then(mod => ({ default: mod.TradingChart })), {
  ssr: false,
  loading: () => null
});

export { TradingChart };
export type { CandleData } from './trading-chart';