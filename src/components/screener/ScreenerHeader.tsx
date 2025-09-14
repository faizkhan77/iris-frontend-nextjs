import { Plus, Search } from "lucide-react";
import { Button } from "../ui/button";

const ScreenerHeader = () => {
  return (
    <header className="px-5 py-4 flex items-center justify-between border-b">
      <div>
        <h3 className="font-medium">Iris Screener</h3>
        <p className="capitalize text-muted-foreground text-sm">
          Screener for smart investments
        </p>
      </div>
      <div>
        <div className="flex border min-w-lg px-2 rounded-xl items-center justify-center">
          <Search size={18} />
          <input className="w-full text-sm p-2 focus:outline-none h-full" type="text" />
        </div>
      </div>
      {/* <div className="flex gap-5">
        <Button variant={"outline"}>Combine Screener</Button>
        <Button variant={"outline"}> <Plus /> Create New Screener</Button>
      </div> */}
    </header>
  );
};

export default ScreenerHeader;
