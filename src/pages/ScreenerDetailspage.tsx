import { ArrowLeftIcon, SpinnerIcon } from "@/components/screener/Icons";
import ExportBtn from "@/components/screener/exportbtn";
import ScreenCombiner from "@/components/screener/ScreenCombiner";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useNavigate } from "react-router";

export default function ScreenerDetailspage() {
  const mainTitle = "Value Stocks (Low P/E)";
  const mainDescription =
    "Companies with a low Price-to-Earnings ratio, potentially undervalued.";

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // goes back to previous page
  };

  return (
    <div className="col-span-9 bg-brand-container rounded-xl">
      
      <div className="space-y-4">
        <div>
          <button onClick={handleBack} className="flex mb-5 cursor-pointer items-center gap-2 text-sm text-brand-text-secondary hover:text-brand-text-primary">
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Dashboard
          </button>
          <h2 className="text-xl font-bold text-brand-text-primary">
            {mainTitle}
          </h2>
          <p className="text-sm text-brand-text-secondary">{mainDescription}</p>
        </div>

        <div className="">
          <p className="text-sm">
            Active Screens:
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <div className="px-2 py-1 border rounded-md bg-brand-muted text-sm text-brand-text-secondary">
              {mainTitle}
              <button className="ml-2 text-xs">&times;</button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-2">
          {/* <ScreenCombiner currentScreens={[]} onAddScreen={() => {}} /> */}
          <Button>Export <Download /> </Button>
        </div>
      </div>

      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="sticky top-0 bg-brand-container border-b border-brand-border">
            <tr>
              <th className="px-4 py-2 font-semibold text-brand-text-secondary">
                Symbol
              </th>
              <th className="px-4 py-2 font-semibold text-brand-text-secondary">
                Company
              </th>
              <th className="px-4 py-2 font-semibold text-brand-text-secondary">
                Sector
              </th>
              <th className="px-4 py-2 font-semibold text-brand-text-secondary text-right">
                Price
              </th>
              <th className="px-4 py-2 font-semibold text-brand-text-secondary text-right">
                Change %
              </th>
              <th className="px-4 py-2 font-semibold text-brand-text-secondary text-right">
                Market Cap
              </th>
              <th className="px-4 py-2 font-semibold text-brand-text-secondary text-right">
                P/E Ratio
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-brand-border hover:bg-white/5 transition-colors">
              <td className="px-4 py-3 font-mono font-medium text-brand-text-primary">
                RELIANCE
              </td>
              <td className="px-4 py-3 text-brand-text-secondary truncate max-w-xs">
                Reliance Industries
              </td>
              <td className="px-4 py-3 text-brand-text-secondary">Energy</td>
              <td className="px-4 py-3 font-mono text-right text-brand-text-primary">
                ₹2,500.00
              </td>
              <td className="px-4 py-3 font-mono text-right text-green-400">
                +1.25%
              </td>
              <td className="px-4 py-3 font-mono text-right text-brand-text-secondary">
                16,50,000 Cr
              </td>
              <td className="px-4 py-3 font-mono text-right text-brand-text-secondary">
                22.50
              </td>
            </tr>
            <tr>
              <td
                colSpan={7}
                className="text-center py-8 text-brand-text-secondary"
              >
                No more stocks to display.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      
      <div className="p-4 border-t border-brand-border text-center">
        <button className="px-4 py-1.5 text-sm font-medium rounded-lg bg-neutral-800 text-brand-text-primary hover:bg-neutral-700 transition-colors">
          Show More
        </button>
      </div>
    </div>
  );
}
