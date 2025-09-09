import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"; // Importing necessary parts
import { Funnel } from "lucide-react";

const Timeframe = () => {
  return (
    <section className="rounded-xl flex items-center gap-5 border py-3 px-5">
        <Funnel size={18} />
      <h3 className="text-sm font-medium">Timeframe</h3>
      <Select   onValueChange={(value) => console.log(value)}>
        <SelectTrigger size="sm" className="shadow-none">
          <SelectValue placeholder="1M" />
        </SelectTrigger>
        <SelectContent defaultValue={"1M"}>
          <SelectItem value="1M">1 M</SelectItem>
          <SelectItem value="3M">3 M</SelectItem>
          <SelectItem value="6M">6 M</SelectItem>
          <SelectItem value="1Y">1 Yr</SelectItem>
        </SelectContent>
      </Select>
    </section>
  );
};

export default Timeframe;
