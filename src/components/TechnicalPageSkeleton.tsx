import React from "react";

const SkeletonTableRow: React.FC = () => {
  return (
    <div className="grid grid-cols-12 gap-4 items-center px-4 py-3 border-b border-border">
      {/* Company */}
      <div className="col-span-2">
        <div className="h-5 w-3/4 bg-muted rounded mb-2" />
        <div className="h-4 w-1/2 bg-muted rounded" />
      </div>
      {/* Price */}
      <div className="col-span-1">
        <div className="h-5 w-20 bg-muted rounded" />
      </div>
      {/* Overall Signal */}
      <div className="col-span-2">
        <div className="h-8 w-28 bg-muted rounded-full" />
      </div>
      {/* Indicator Icons */}
      {[...Array(7)].map((_, i) => (
        <div key={i} className="col-span-1 flex justify-center">
          <div className="h-6 w-6 bg-muted rounded-full" />
        </div>
      ))}
    </div>
  );
};

const TechnicalPageSkeleton: React.FC = () => {
  return (
    <div className="bg-background text-foreground p-6 animate-pulse">
      {/* Stock Table */}
      <div className="overflow-x-auto">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-4 py-3 text-sm font-semibold text-foreground/50 border-b border-border">
          <div className="col-span-2">
            <div className="h-5 w-20 bg-muted rounded" />
          </div>
          <div className="col-span-1">
            <div className="h-5 w-12 bg-muted rounded" />
          </div>
          <div className="col-span-2">
            <div className="h-5 w-32 bg-muted rounded" />
          </div>
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="col-span-1 flex justify-center">
              <div className="h-5 w-10 bg-muted rounded" />
            </div>
          ))}
        </div>

        {/* Table Body */}
        <div>
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonTableRow key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechnicalPageSkeleton;
