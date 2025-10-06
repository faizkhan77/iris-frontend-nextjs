"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { DynamicIcon } from "lucide-react/dynamic";

const newsData = [
  {
    title: "Pharma Surges in Monthly Trading Session",
    description:
      "Positive investor sentiment surrounds the pharma sector as the Sensex shows strong gains...",
    category: "Pharma",
    time: "1 day ago",
  },
  {
    title: "Reliance Surges in Monthly Trading Session",
    description:
      "Positive investor sentiment surrounds the reliance sector as the Sensex shows strong gains...",
    category: "Reliance",
    time: "2 days ago",
  },
  {
    title: "NIFTY 50 Surges in Monthly Trading Session",
    description:
      "Positive investor sentiment surrounds the nifty 50 sector as the Sensex shows strong gains...",
    category: "NIFTY 50",
    time: "3 days ago",
  },
  {
    title: "HDFC Bank Surges in Monthly Trading Session",
    description:
      "Positive investor sentiment surrounds the hdfc bank sector as the Sensex shows strong gains...",
    category: "HDFC Bank",
    time: "4 days ago",
  },
];

const NewsPage = () => {
  const [filter, setFilter] = useState("Newest First");

const handleShare = async () => {
    const data = {
      title: "Market Pulse",
      link: "https://iris.brainfogagency.com/login",
      text: "Latest news from MarketPulse India",
    };

    
    // ✅ Default: use native share if available
    if (navigator.share) {
      await navigator.share(data).catch((err) => console.log("Error sharing:", err));
    } else {
      // fallback copy link
      navigator.clipboard.writeText(data.link);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <section className="p-5 h-full  flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col">
        <h1 className="text-xl font-semibold">MarketPulse India</h1>
        <span className="text-sm text-muted-foreground">
          Your daily source for Indian stock market news.
        </span>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="monthly" className="w-full">
        <TabsList className="gap-2 h-fit border">
          <TabsTrigger
            className="p-2 data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground"
            value="pre"
          >
            Pre-Market
          </TabsTrigger>
          <TabsTrigger
            className="p-2 data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground"
            value="during"
          >
            During-Market
          </TabsTrigger>
          <TabsTrigger
            className="p-2 data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground"
            value="post"
          >
            Post-Market
          </TabsTrigger>
          <TabsTrigger
            className="p-2 data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground"
            value="weekly"
          >
            Weekly
          </TabsTrigger>
          <TabsTrigger
            className="p-2 data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground"
            value="monthly"
          >
            Monthly
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Search + Filter */}
      <div className="flex gap-2">
        <Input
          placeholder="Search by stock, index, or keyword..."
          className="flex-1"
        />
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Filter by Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Newest First">Newest First</SelectItem>
            <SelectItem value="Oldest First">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* News Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {newsData.map((news, idx) => (
          <Card key={idx} className="shadow-md">
            <CardHeader>
              <CardTitle className="">{news.title}</CardTitle>
              <CardDescription>{news.category}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {news.description}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between text-xs text-muted-foreground">
              <span>{news.time}</span>
              <Button onClick={handleShare} variant="ghost" size="sm">
                <DynamicIcon name="share-2" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default NewsPage;
