// lib/types.ts

export interface Screen {
    title: string;
    description: string;
  }
  
  export interface ScreenCategory {
    title: string;
    screens: Screen[];
  }
  
  export interface Stock {
    symbol: string;
    companyName: string;
    sector: string;
    price: number;
    changePercent: number;
    marketCap: number;
    peRatio: number | null;
  }