'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  createChart, 
  IChartApi, 
  ISeriesApi, 
  CandlestickData, 
  ColorType,
  CrosshairMode
} from 'lightweight-charts';

export interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

interface TradingChartProps {
  data?: CandleData[];
  height?: number;
  symbol?: string;
  className?: string;
}

function TradingChart({ 
  data = [], 
  height = 400, 
  symbol = 'SYMBOL',
  className = '' 
}: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const cleanupChart = useCallback(() => {
    if (chartRef.current) {
      try {
        chartRef.current.remove();
      } catch (e) {
        console.warn('Error removing chart:', e);
      }
      chartRef.current = null;
      seriesRef.current = null;
    }
  }, []);

  // Mount effect for client-side only
  useEffect(() => {
    setMounted(true);
  }, []);

  const createTradingViewChart = useCallback(() => {
    if (!mounted || !chartContainerRef.current) {
      return;
    }

    const container = chartContainerRef.current;
    cleanupChart();

    try {
      console.log('Creating TradingView chart v4.2.0...');

      // Create chart with minimal config
      const chart = createChart(container, {
        width: container.clientWidth || 400,
        height: height,
      });

      console.log('Chart created successfully');
      chartRef.current = chart;

      // Add candlestick series
      const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
      });
      console.log('Candlestick series added successfully');
      seriesRef.current = candlestickSeries;

      // Sample data
      const sampleData = [
        { time: '2024-01-01', open: 1.0850, high: 1.0920, low: 1.0820, close: 1.0890 },
        { time: '2024-01-02', open: 1.0890, high: 1.0950, low: 1.0860, close: 1.0920 },
        { time: '2024-01-03', open: 1.0920, high: 1.0980, low: 1.0880, close: 1.0960 },
        { time: '2024-01-04', open: 1.0960, high: 1.1020, low: 1.0940, close: 1.0980 },
        { time: '2024-01-05', open: 1.0980, high: 1.1050, low: 1.0950, close: 1.1020 },
      ];

      // Set data
      candlestickSeries.setData(sampleData);
      console.log('Data set successfully');

      // Fit content
      chart.timeScale().fitContent();

      // Handle resize
      const handleResize = () => {
        if (chartRef.current && chartContainerRef.current) {
          const newWidth = chartContainerRef.current.clientWidth;
          chartRef.current.applyOptions({
            width: newWidth,
          });
        }
      };

      const resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(container);

      // Also listen to window resize
      window.addEventListener('resize', handleResize);

      setIsLoading(false);
      setError(null);
      console.log('Chart initialization completed successfully');

      // Return cleanup function
      return () => {
        resizeObserver.disconnect();
        window.removeEventListener('resize', handleResize);
      };

    } catch (err) {
      console.error('Chart creation error:', err);
      setError(err instanceof Error ? err.message : 'Chart creation failed');
      setIsLoading(false);
    }
  }, [mounted, height, cleanupChart]);

  useEffect(() => {
    if (!mounted) return;

    let cleanupFn: (() => void) | undefined;

    const timeoutId = setTimeout(() => {
      cleanupFn = createTradingViewChart();
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (cleanupFn) cleanupFn();
      cleanupChart();
    };
  }, [mounted, createTradingViewChart]);

  // Don't render on server side
  if (!mounted) {
    return (
      <div className={`relative ${className}`}>
        <div className="mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">{symbol} TradingView Chart</h3>
        </div>
        <div 
          className="w-full rounded-lg border bg-card flex items-center justify-center"
          style={{ height: `${height}px` }}
        >
          <div className="text-muted-foreground">Loading chart...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`relative ${className}`}>
        <div className="mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">{symbol} TradingView Chart</h3>
        </div>
        <div 
          className="w-full rounded-lg border bg-card flex items-center justify-center"
          style={{ height: `${height}px` }}
        >
          <div className="text-center space-y-2">
            <div className="text-muted-foreground">Chart initialization failed</div>
            <div className="text-xs text-muted-foreground">{error}</div>
            <button 
              onClick={() => {
                setError(null);
                createTradingViewChart();
              }}
              className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-lg z-10">
          <div className="text-center space-y-2">
            <div className="text-muted-foreground">Loading TradingView chart...</div>
            <div className="text-xs text-muted-foreground">Initializing...</div>
          </div>
        </div>
      )}
      
      <div className="mb-2">
        <h3 className="text-sm font-medium text-muted-foreground">{symbol} TradingView Chart</h3>
      </div>
      
      <div 
        ref={chartContainerRef} 
        className="w-full rounded-lg border bg-card"
        style={{ 
          height: `${height}px`,
          minHeight: `${height}px`,
          overflow: 'hidden',
          position: 'relative'
        }}
      />
      
      <div className="mt-2 flex justify-between items-center text-xs text-muted-foreground">
        <div className="flex items-center space-x-4">
          <span>TradingView Lightweight Charts</span>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-600 rounded-sm"></div>
              <span>Bullish</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-600 rounded-sm"></div>
              <span>Bearish</span>
            </div>
          </div>
        </div>
        <span>Professional Trading Chart</span>
      </div>
    </div>
  );
}

export { TradingChart };
export default TradingChart;