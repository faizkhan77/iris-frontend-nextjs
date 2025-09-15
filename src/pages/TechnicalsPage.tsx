import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import StockTable from "../analysis_components/StockTable";
import { ALL_INDICATOR_NAMES } from "../lib/analysis_constants";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { useGetAllStockSummaryQuery } from "@/redux/slices/Company/company.api";




const API_BASE_URL = `${import.meta.env.VITE_BASE_URL}`;

interface Stock {
  id: number;
  symbol: string;
  name: string;
  currentPrice: number;
  overallSignal: string;
  signals: { name: string; decision: string }[];
}


export default function TechnicalsPage() {
  const navigate = useNavigate(); // <-- INITIALIZE THE ROUTER
  const [stocksSummary, setStocksSummary] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const initialSelectedIndicators = ALL_INDICATOR_NAMES.reduce(
    (acc, indicator) => {
      acc[indicator] = true;
      return acc;
    },
    {} as { [key: string]: boolean }
  );
  const [selectedIndicators, setSelectedIndicators] = useState(
    initialSelectedIndicators
  );


 const { data, error:errors, isLoading:isloadings, isFetching } = useGetAllStockSummaryQuery({
    selectedIndicators: ["MACD"],
  });
console.log("Data:", data);

  

  useEffect(() => {
    const fetchStocksSummary = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const activeIndicators = Object.keys(selectedIndicators).filter(
          (indicator) => selectedIndicators[indicator]
        );
        const params = new URLSearchParams({
          selectedIndicators: activeIndicators.join(","),
        });
        const response = await fetch(
          `${API_BASE_URL}/company/stock?${params.toString()}`
        );
       
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setStocksSummary(data || []);
      } catch (e: any) {
        setError(e.message);
        setStocksSummary([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStocksSummary();
  }, [selectedIndicators]);

  const filteredStocks = useMemo(() => {
    if (!stocksSummary) return [];
    return stocksSummary.filter(
      (stock) =>
        (stock.symbol || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (stock.name || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
    
  }, [stocksSummary, searchQuery]);
  // console.log("Filtered Stocks:", filteredStocks);

  const handleStockSelect = (stock: Stock) => {

    navigate(`/company/${stock.id}`);
  };

  const handleIndicatorToggle = (indicatorName: string) => {
    setSelectedIndicators((prev) => ({
      ...prev,
      [indicatorName]: !prev[indicatorName],
    }));
  };

  // The rest of the component remains the same...
  // if (error) {
  //   return (
  //  <NotFoundPage message={error} />
  //   );
  // }

 

  return (
    <div className="h-full overflow-y-auto custom-scrollbar bg-content-bg text-text-primary">
      <header className="sticky top-0 z-20 bg-content-bg/80 backdrop-blur-md p-4 md:px-6 border-b border-element-border">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-text-primary">
            Stock Screener
          </h1>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
            <input
              type="text"
              placeholder="Search Screener..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-element-border bg-background py-2 pl-9 pr-4 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="p-4 md:p-6"
      >
        <StockTable
          stocks={filteredStocks}
          onStockSelect={handleStockSelect}
          selectedIndicators={selectedIndicators}
          onIndicatorToggle={handleIndicatorToggle}
          loading={isLoading}
        />
      </motion.div>
    </div>
  );
}
