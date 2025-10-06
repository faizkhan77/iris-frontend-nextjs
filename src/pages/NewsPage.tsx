"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { NewsArticle } from "@/redux/slices/news/types";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { DynamicIcon } from "lucide-react/dynamic";
import { useGetNewsQuery } from "@/redux/slices/news/news.api";

const newsCategories = [
  "company_news",
  "company_earnings",
  "economy_mktpulse",
  "economy_indmkt",
  "economy_inflation",
  "equity_openingbell",
  "equity_midday",
  "equity_closingbell",
  "equity_corpnews",
  "equity_global",
  "equity_movers",
  "equity_stockalerts",
  "equity_corpresult",
  "ipo_analysis",
  "ipo_news",
  "mfi_mf",
  "mfi_news",
  "fao_news",
  "commodity_news",
  "commodity_price",
  "commodity_intmkt",
  "others_politicalnews",
  "others_fiiposition",
  "money_bonds",
  "money_callmoney",
  "money_forexrates",
  "finance_currency"
];

const formatCategoryName = (name: string) => {
  return name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};
const PAGE_SIZE = 20;
const NewsPage = () => {
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc"); // State for sorting
  const [offset, setOffset] = useState(0);
  const [allNews, setAllNews] = useState<NewsArticle[]>([]);
  const [filter, setFilter] = useState("Newest First");
  const [activeCategory, setActiveCategory] = useState(newsCategories[0]);

  const { data: newsData, isLoading, error, isFetching } = useGetNewsQuery({
    news_type: activeCategory,
    order: sortOrder,
    offset: offset,
    limit: PAGE_SIZE,
  });

  useEffect(() => {
    if (newsData && newsData.length > 0) {
      // Prevent adding duplicate articles if the hook re-runs
      setAllNews(prevNews => {
          const existingIds = new Set(prevNews.map(n => n.NEWSID));
          const newArticles = newsData.filter(n => !existingIds.has(n.NEWSID));
          return [...prevNews, ...newArticles];
      });
    }
  }, [newsData]);

  // This effect RESETS the news list when the category or sort order changes.
  useEffect(() => {
    setAllNews([]); // Clear the existing news
    setOffset(0);   // Go back to the first page
  }, [activeCategory, sortOrder]);


  // --- EVENT HANDLERS ---
  
  const handleShowMore = () => {
    // Increase the offset to fetch the next page of news
    setOffset(prevOffset => prevOffset + PAGE_SIZE);
  };
  
  const handleSortChange = (value: "desc" | "asc") => {
    setSortOrder(value);
  };

  const [selectedNews, setSelectedNews] = useState<NewsArticle | null>(null);

  const handleCardClick = (newsItem: NewsArticle) => {
    setSelectedNews(newsItem);
  };

  const handleShare = async (newsItem: NewsArticle) => {
    const shareData = {
      title: newsItem.HEADING || "MarketPulse India News",
      text: newsItem.CAPTION || "Check out this latest news update.",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log("Article shared successfully");
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(shareData.url);
      alert("Link copied to clipboard!");
    }
  };

  const renderContent = () => {
    if (isLoading && allNews.length === 0) {
      return <p>Loading news...</p>;
    }

    if (error) {
      return <p className="text-red-500">Failed to load news. Please try again later.</p>;
    }

    if (allNews.length === 0 && !isFetching) {
      return <p>No news available for this category.</p>;
    }

    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allNews.map((news) => (
          <Card key={news.NEWSID} className="shadow-md cursor-pointer" onClick={() => handleCardClick(news)}>
            <CardHeader>
              <CardTitle className="line-clamp-2">{news.HEADING}</CardTitle>
              <CardDescription>{formatCategoryName(activeCategory)}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {news.CAPTION}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between text-xs text-muted-foreground">
              <span>{new Date(news.DATE).toLocaleDateString()}</span>

              <Button onClick={(event) => {
                event.stopPropagation();
                handleShare(news);
              }}
                variant="ghost" size="sm">
                <DynamicIcon name="share-2" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <section className="p-5 h-full flex flex-col gap-6">

      <div className="flex flex-col">
        <h1 className="text-xl font-semibold">MarketPulse India</h1>
        <span className="text-sm text-muted-foreground">
          Your daily source for Indian stock market news.
        </span>
      </div>

      <div>
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <TabsList
            className="
      w-full             
      justify-start      
      relative          
      overflow-x-auto    
      custom-scrollbar 
      whitespace-nowrap  
      pb-4               
      border-b           
    "
          >
            {newsCategories.map((category) => (
              <TabsTrigger
                key={category}
                className="p-2 data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground"
                value={category}
              >
                {formatCategoryName(category)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="flex gap-2">
        <Input placeholder="Search by stock, index, or keyword..." className="flex-1" />
        <Select value={sortOrder} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Newest First</SelectItem>
            <SelectItem value="asc">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {renderContent()}
      {!isFetching && newsData && newsData.length === PAGE_SIZE && (
        <div className="flex justify-center mt-4">
          <Button onClick={handleShowMore}>
            Show More
          </Button>
        </div>
      )}
    
      {isFetching && allNews.length > 0 && <p>Loading more...</p>}
      <Dialog open={!!selectedNews} onOpenChange={(isOpen) => !isOpen && setSelectedNews(null)}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>{selectedNews?.HEADING}</DialogTitle>
            <DialogDescription>
              {selectedNews ? new Date(selectedNews.DATE).toLocaleString() : ''}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 whitespace-pre-wrap max-h-[60vh] overflow-y-auto"
            dangerouslySetInnerHTML={{
              __html: selectedNews?.DETAILS || "Full article content not available."
            }} />

          <DialogFooter>
            <Button onClick={() => selectedNews && handleShare(selectedNews)} variant="outline">
              Share
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default NewsPage;