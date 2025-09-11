import React from 'react';
import { useTheme } from './providers/ThemeProvider'; // Make sure this path is correct

const SkeletonMetric = ({ theme }) => {
    const skeletonColor = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300';
    return (
        <div>
            <div className={`h-4 w-24 ${skeletonColor} rounded mb-2`}></div>
            <div className={`h-6 w-32 ${skeletonColor} rounded`}></div>
        </div>
    );
};

const StockDetailsSkeleton = () => {
    const { theme } = useTheme();

    // Define theme-based colors
    const bgColor = theme === 'dark' ? 'bg-black' : 'bg-white';
    const textColor = theme === 'dark' ? 'text-white' : 'text-black';
    const elementBgColor = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200';
    const skeletonColor = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300';
    const borderColor = theme === 'dark' ? 'border-gray-800' : 'border-gray-200';
    const chartBgColor = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50';


    return (
        <div className={`${bgColor} ${textColor} p-6 animate-pulse`}>
            {/* Header Section */}
            <header className="flex justify-between items-start mb-8">
                <div className="flex items-center space-x-4">
                    <div className={`h-12 w-12 ${elementBgColor} rounded-full`}></div>
                    <div>
                        <div className={`h-8 w-64 ${elementBgColor} rounded mb-2`}></div>
                        <div className={`h-5 w-80 ${elementBgColor} rounded`}></div>
                    </div>
                </div>
                <div className={`h-10 w-48 ${elementBgColor} rounded`}></div>
            </header>

            {/* Navigation Tabs */}
            <nav className={`flex space-x-8 border-b ${borderColor} mb-6`}>
                <div className={`h-6 w-24 ${elementBgColor} rounded mb-2`}></div>
                <div className={`h-6 w-24 ${elementBgColor} rounded mb-2`}></div>
                <div className={`h-6 w-16 ${elementBgColor} rounded mb-2`}></div>
                <div className={`h-6 w-20 ${elementBgColor} rounded mb-2`}></div>
                <div className={`h-6 w-28 ${elementBgColor} rounded mb-2`}></div>
                <div className={`h-6 w-28 ${elementBgColor} rounded mb-2`}></div>
                <div className={`h-6 w-24 ${elementBgColor} rounded mb-2`}></div>
            </nav>

            {/* Key Metrics Section */}
            <div className="mb-8">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-y-6 gap-x-4 mb-6">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <SkeletonMetric key={i} theme={theme} />
                    ))}
                </div>
            </div>

            {/* Price Chart Section */}
            <div className={`${chartBgColor} p-6 rounded-lg`}>
                <div className="flex justify-between items-center mb-4">
                    <div className={`h-7 w-32 ${skeletonColor} rounded`}></div>
                    <div className="flex items-center space-x-3">
                        {/* Time range filters */}
                        <div className={`h-8 w-10 ${skeletonColor} rounded`}></div>
                        <div className={`h-8 w-10 ${skeletonColor} rounded`}></div>
                        <div className={`h-8 w-10 ${skeletonColor} rounded`}></div>
                        <div className={`h-8 w-10 ${skeletonColor} rounded`}></div>
                        {/* Checkbox filters */}
                        <div className={`h-6 w-24 ${skeletonColor} rounded`}></div>
                        <div className={`h-6 w-24 ${skeletonColor} rounded`}></div>
                        <div className={`h-6 w-24 ${skeletonColor} rounded`}></div>
                    </div>
                </div>
                {/* Chart Area */}
                <div className={`h-96 w-full ${elementBgColor} rounded`}></div>
            </div>
        </div>
    );
};

export default StockDetailsSkeleton;