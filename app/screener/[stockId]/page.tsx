// app/screener/[stockId]/page.tsx

import StockDetail from "@/app/analysis_components/StockDetail";
import { notFound } from "next/navigation";

const API_BASE_URL = "http://127.0.0.1:8000/api";

interface StockDetailPageProps {
  params: {
    stockId: string;
  };
}

async function getStockDetails(stockId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/stock/${stockId}`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch details for ${stockId}:`, error);
    return null;
  }
}

export default async function StockDetailPage(props: StockDetailPageProps) {
  const { stockId } = await props.params; // ✅ params is awaited
  const stockData = await getStockDetails(stockId);

  if (!stockData) {
    notFound();
  }

  return (
    <div className="h-full bg-content-bg">
      <StockDetail initialStockData={stockData} />
    </div>
  );
}
