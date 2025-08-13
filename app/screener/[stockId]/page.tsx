"use client";

import { useEffect, useState } from "react";
import StockDetail from "@/app/analysis_components/StockDetail";
import { useParams, notFound } from "next/navigation";

const API_BASE_URL = "https://irisapi.brainfogagency.com/api";

async function getStockDetails(stockId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/stock/${stockId}`, {
      cache: "no-store",
    });
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch details for ${stockId}:`, error);
    return null;
  }
}

export default function StockDetailPage() {
  const params = useParams<{ stockId: string }>();
  const [stockData, setStockData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.stockId) {
      getStockDetails(params.stockId).then((data) => {
        setStockData(data);
        setLoading(false);
      });
    }
  }, [params.stockId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!stockData) {
    notFound();
  }

  return (
    <div className="h-full bg-content-bg">
      <StockDetail initialStockData={stockData} />
    </div>
  );
}
