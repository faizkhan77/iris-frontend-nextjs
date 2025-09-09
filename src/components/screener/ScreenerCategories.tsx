import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const stockScreens = [
  {
    title: "Value Stocks (Low P/E)",
    description:
      "Companies with a low Price-to-Earnings ratio, potentially undervalued.",
  },
  {
    title: "Value Stocks (Low P/E)",
    description:
      "Companies with a low Price-to-Earnings ratio, potentially undervalued.",
  },
  {
    title: "Value Stocks (Low P/E)",
    description:
      "Companies with a low Price-to-Earnings ratio, potentially undervalued.",
  },
  {
    title: "High Dividend Yield",
    description:
      "Stocks that pay out a high dividend relative to their share price.",
  },
];

const ScreneerCategories = () => {
  return (
    <section className="space-y-4">
      <h3 className="text-xl font-semibold">Popular Themes</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stockScreens.map((screen, index) => (
          <Card key={index}>
            <CardContent>
              <h4 className="font-medium">{screen.title}</h4>
              <p className="text-muted-foreground text-sm">
                {screen.description}
              </p>
              <Button variant="default" className="mt-3">
                Run Screen
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default ScreneerCategories;
