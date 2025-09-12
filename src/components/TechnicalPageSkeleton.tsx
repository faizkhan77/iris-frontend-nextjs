import React from 'react';
import { useTheme } from './providers/ThemeProvider';

const SkeletonTableRow = ({ theme }) => {
  const bgColor = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300';
  const borderColor = theme === 'dark' ? 'border-gray-800' : 'border-gray-200';

  return (
    <div className={`grid grid-cols-12 gap-4 items-center px-4 py-3 border-b ${borderColor}`}>
      {/* Company */}
      <div className="col-span-2">
        <div className={`h-5 w-3/4 ${bgColor} rounded mb-2`}></div>
        <div className={`h-4 w-1/2 ${bgColor} rounded`}></div>
      </div>
      {/* Price */}
      <div className="col-span-1">
        <div className={`h-5 w-20 ${bgColor} rounded`}></div>
      </div>
      {/* Overall Signal */}
      <div className="col-span-2">
        <div className={`h-8 w-28 ${bgColor} rounded-full`}></div>
      </div>
      {/* Indicator Icons */}
      {[...Array(7)].map((_, i) => (
        <div key={i} className="col-span-1 flex justify-center">
          <div className={`h-6 w-6 ${bgColor} rounded-full`}></div>
        </div>
      ))}
    </div>
  );
};

const TechnicalPageSkeleton = () => {
  const { theme } = useTheme();
  const bgColor = theme === 'dark' ? 'bg-black' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-white' : 'text-black';
  const headerBgColor = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300';
  const borderColor = theme === 'dark' ? 'border-gray-800' : 'border-gray-200';

  return (
    <div className={`${bgColor} ${textColor} p-6 animate-pulse`}>
      {/* Stock Table */}
      <div className="overflow-x-auto">
        {/* Table Header */}
        <div className={`grid grid-cols-12 gap-4 px-4 py-3 text-sm font-semibold text-gray-400 border-b ${borderColor}`}>
          <div className="col-span-2"><div className={`h-5 w-20 ${headerBgColor} rounded`}></div></div>
          <div className="col-span-1"><div className={`h-5 w-12 ${headerBgColor} rounded`}></div></div>
          <div className="col-span-2"><div className={`h-5 w-32 ${headerBgColor} rounded`}></div></div>
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="col-span-1 flex justify-center"><div className={`h-5 w-10 ${headerBgColor} rounded`}></div></div>
          ))}
        </div>

        {/* Table Body */}
        <div>
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonTableRow key={i} theme={theme} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechnicalPageSkeleton;