import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Command, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";

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
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full py-4 ">
        <div className="container mx-auto px-4">
          <h1 className="text-xl font-semibold">Company Finder</h1>
        </div>
      </header>

      {/* Search Box Centered */}
      <main className="flex flex-1 items-center justify-center">
        <Card className="w-full max-w-md p-4 shadow-lg">
          <CardContent className="p-0">
            <Input
              placeholder="Search company or symbol..."
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              className="mb-2"
            />

            {query && (
              <Command className="border rounded-md">
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
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CompanyPage;
