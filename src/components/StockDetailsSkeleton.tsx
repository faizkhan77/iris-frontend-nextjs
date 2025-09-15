import React from "react";

const SkeletonMetric: React.FC = () => {
  return (
    <div className="space-y-2">
      <div className="h-4 w-24 rounded-md bg-muted" />
      <div className="h-6 w-32 rounded-md bg-muted" />
    </div>
  );
};

const StockDetailsSkeleton: React.FC = () => {
  return (
    <div className="bg-background text-foreground p-6 animate-pulse">
      {/* Header */}
      <header className="flex justify-between items-start mb-8">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 bg-muted rounded-full" />
          <div className="space-y-2">
            <div className="h-8 w-64 bg-muted rounded-md" />
            <div className="h-5 w-80 bg-muted rounded-md" />
          </div>
        </div>
        <div className="h-10 w-48 bg-muted rounded-md" />
      </header>

      {/* Navigation Tabs */}
      <nav className="flex space-x-8 border-b border-border mb-6">
        {["w-24", "w-24", "w-16", "w-20", "w-28", "w-28", "w-24"].map((w, i) => (
          <div key={i} className={`h-6 ${w} bg-muted rounded-md mb-2`} />
        ))}
      </nav>

      {/* Key Metrics */}
      <div className="mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <SkeletonMetric key={i} />
          ))}
        </div>
      </div>

      {/* Price Chart */}
      <div className="bg-card p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <div className="h-7 w-32 bg-muted-foreground rounded-md" />
          <div className="flex items-center space-x-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-8 w-10 bg-muted-foreground rounded-md" />
            ))}
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-6 w-24 bg-muted-foreground rounded-md" />
            ))}
          </div>
        </div>
        <div className="h-96 w-full bg-muted rounded-md" />
      </div>
    </div>
  );
};

export default StockDetailsSkeleton;
