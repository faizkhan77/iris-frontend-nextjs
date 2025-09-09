
import { Input } from "@/components/ui/input";
import { Link } from "react-router";

const Sidebar = () => {
  return (
    <aside className="w-80 border-r p-4">
      <h3 className="text-lg font-semibold">Filter by Sector</h3>
      <div className="space-y-2 mt-2">
        <Input placeholder="Search sectors..." className="w-full" />
        <div className="mt-4">
        
          <ul className="mt-2 flex flex-col">
            <Link to={"/"} className="w-full px-5 rounded-lg hover:bg-accent text-sm p-2 text-left">
              All Sectors
            </Link>

            <Link to={"/"} className="w-full px-5 rounded-lg hover:bg-accent text-sm p-2 text-left">
              Finance & Banking
            </Link>

            <Link to={"/"} className="w-full px-5 rounded-lg hover:bg-accent text-sm p-2 text-left">
              Healthcare
            </Link>
            {/* Add more sectors as needed */}
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
