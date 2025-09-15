import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

// Sample company stock data
const companies = [
  { symbol: "RELIANCE.NS", name: "Reliance Industries Limited" },
  { symbol: "TCS.NS", name: "Tata Consultancy Services Limited" },
  { symbol: "HDFCBANK.NS", name: "HDFC Bank Limited" },
  { symbol: "INFY.NS", name: "Infosys Limited" },
  { symbol: "SBIN.NS", name: "State Bank of India" },
  { symbol: "ITC.NS", name: "ITC Limited" },
];

const CompanyPage = () => {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState(companies);

  const handleSearch = (value: string) => {
    console.log(value);

    setQuery(value);
    setFiltered(
      companies.filter(
        (c) =>
          c.symbol.toLowerCase().includes(value.toLowerCase()) ||
          c.name.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  return (
    <div className="relative h-full border w-full rounded-lg flex flex-col overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(125%_125%_at_50%_20%,transparent_40%,oklch(0.6772_0.22_216.4337_/_0.3)_70%,oklch(0.6772_0.1206_216.4337)_100%)]" />

      {/* Search Box Centered */}
      <main className="relativec flex flex-col flex-1 items-center justify-center">
        <h3>Find Best Opportunies</h3>
        <div className="relative w-full max-w-2xl">
          <Input
            placeholder="Search company or symbol..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full !text-lg placeholder:text-lg p-8 rounded-full"
          />

          {query && (
            <Command className="absolute left-0 top-full mt-2 w-full border shadow-md rounded-md bg-background z-50">
              <CommandEmpty>No company found.</CommandEmpty>
              <CommandGroup heading="Suggestions">
                {filtered.map((c) => (
                  <CommandItem
                    key={c.symbol}
                    onSelect={() => setQuery(c.symbol)}
                  >
                    <span className="font-medium">{c.symbol}</span>
                    <span className="ml-2 text-sm text-muted-foreground">
                      {c.name}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          )}
        </div>
      </main>
    </div>
  );
};

export default CompanyPage;
