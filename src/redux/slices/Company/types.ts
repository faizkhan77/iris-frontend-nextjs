
export interface StockIndicator {
  name: string;     
  value: number;    
  sentiment: "positive" | "negative" | "neutral"; 
}


export interface StockSummaryResponse {
  company: string;   
  ticker: string;    
  indicators: StockIndicator[];
}

// The request shape
export interface StockSummaryRequest {
  selectedIndicators: string[];
    page?: number;       // optional, defaults to 1
  page_size?: number;
}
