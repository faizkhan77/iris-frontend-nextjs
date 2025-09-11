import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Frown } from 'lucide-react';
import { useTheme } from './providers/ThemeProvider'; // Adjust import path if needed

/**
 * A theme-aware "Not Found" page component inspired by the Screener.in design.
 *
 * @param {{
 *   title?: string;
 *   message?: string;
 *   showReportLink?: boolean;
 * }} props
 */
const NotFoundDisplay = ({
  title = "Error 404: Page Not Found",
  message = "No CompanyCode matches the given query. - We couldn't find the page you are looking for.",

}) => {
  // useNavigate is used to programmatically go back to the previous page.
  // This requires `react-router-dom` to be set up in your project.
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Define theme-based colors for a polished look in both light and dark modes
  const bgColor = theme === 'dark' ? 'bg-black' : 'bg-slate-50';
  const cardBgColor = theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-white';
  const titleColor = theme === 'dark' ? 'text-slate-100' : 'text-slate-800';
  const textColor = theme === 'dark' ? 'text-slate-400' : 'text-slate-600';
  const goBackColor = theme === 'dark' ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700';

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-4 ${bgColor} transition-colors duration-300`}>
       
      <div className={`w-full max-w-2xl p-8 space-y-5 rounded-lg shadow-sm border ${theme === 'dark' ? 'border-black' : 'border-slate-200'} ${cardBgColor}`}>
        <div className="flex items-center space-x-3">
            <Frown className={`h-8 w-8 ${textColor}`} aria-hidden="true" />
            <h1 className={`text-2xl md:text-3xl font-bold ${titleColor}`}>
              {title}
            </h1>
        </div>
        <p className={`text-base ${textColor}`}>
          {message}
        </p>
        {/* {showReportLink && (
          <a href="#" className={`text-sm font-medium ${linkColor} transition-colors`}>
            Report any website issue.
          </a>
        )} */}
      </div>

      <button
        onClick={() => navigate(-1)} // This safely navigates to the previous page
        className={`mt-8 inline-flex items-center gap-2 text-sm font-medium ${goBackColor} transition-colors`}
      >
        <ArrowLeft className="h-4 w-4" />
        Go Back
      </button>
    </div>
  );
};

export default NotFoundDisplay;