import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp, Search } from "lucide-react";

interface Company {
  symbol: string;
  name: string;
  fincode: number;
  scripcode: number | null;
}

interface ApiCompanyResult {
  symbol: string | null;
  compname: string;
  scripcode: number | null;
  fincode: number;
}

const CompanyPage = () => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.trim().length < 2) {
      setSearchResults([]);
      setShowSuggestions(false);
      return;
    }

    setShowSuggestions(true);
    setIsLoading(true);

    const delayDebounce = setTimeout(() => {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      fetch(`${baseUrl}/company/search?q=${encodeURIComponent(query)}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          return res.json();
        })
        .then((data: ApiCompanyResult[]) => {
          const formattedData: Company[] = data.map((c) => ({
            symbol: c.symbol || "N/A",
            name: c.compname,
            fincode: c.fincode,
            scripcode: c.scripcode,
          }));
          setSearchResults(formattedData);
        })
        .catch((error) => {
          console.error("Failed to fetch companies:", error);
          setSearchResults([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSelectCompany = (company: Company) => {
    navigate(`/company/${company.fincode}`);
  };

  return (
    <div className="relative h-full border w-full rounded-lg flex flex-col overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(125%_125%_at_50%_20%,transparent_40%,oklch(0.6772_0.22_216.4337_/_0.3)_70%,oklch(0.6772_0.1206_216.4337)_100%)]" />

      <main className="relative flex flex-col flex-1 items-center mt-32 px-4">
        {/* Animated Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-semibold mb-2 flex items-center gap-2"
        >
          {/* <TrendingUp className="text-green-500" /> */}
          Discover Stock Opportunities
        </motion.h1>

        {/* Supporting Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center max-w-xl text-muted-foreground mb-10"
        >
          Search for companies by name or symbol to explore detailed insights,
          financials, and performance trends.
        </motion.p>

        {/* <div className="absolute inset-0 pointer-events-none opacity-10 flex items-center justify-center">
          <svg
            width="500"
            height="250"
            viewBox="0 0 500 250"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-green-400"
          >
            <polyline
              points="0,200 50,150 100,180 150,120 200,160 250,100 300,130 350,80 400,140 450,90 500,110"
              fill="none"
            />
          </svg>
        </div> */}

        {/* Search Box */}
        <div className="relative w-full max-w-2xl">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Search />
          </div>
          <Input
            placeholder="Search company or symbol..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            onFocus={() => query.trim().length > 1 && setShowSuggestions(true)}
            className="w-full !text-lg placeholder:text-lg pl-12 pr-6 py-8 rounded-full shadow-md"
            autoComplete="off"
          />

          {/* Suggestions Dropdown */}
          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 top-full mt-2 w-full border shadow-md rounded-md bg-background z-50 overflow-hidden"
            >
              <ul className="max-h-80 overflow-y-auto">
                {isLoading ? (
                  <li className="p-4 text-center text-sm text-muted-foreground">
                    Loading...
                  </li>
                ) : searchResults.length > 0 ? (
                  searchResults.map((c) => (
                    <li
                      key={c.fincode}
                      className="px-4 py-3 cursor-pointer hover:bg-accent border-b border-border/50 last:border-b-0 transition-colors"
                      onMouseDown={() => handleSelectCompany(c)}
                    >
                      <span className="font-medium">
                        {c.symbol !== "N/A" ? c.symbol : c.scripcode}
                      </span>
                      <span className="ml-2 text-sm text-muted-foreground">
                        {c.name}
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="p-4 text-center text-sm text-muted-foreground">
                    No company found.
                  </li>
                )}
              </ul>
            </motion.div>
          )}
        </div>
      </main>

      {/* Bottom subtle ticker effect */}
      <div className="absolute bottom-0 w-full py-2 bg-black/20 text-xs text-center text-muted-foreground animate-pulse">
        📈 Market moves fast — stay ahead with the right insights!
      </div>
    </div>
  );
};

export default CompanyPage;
