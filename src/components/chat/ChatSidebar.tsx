import { DynamicIcon } from "lucide-react/dynamic";
import type { IconName } from "lucide-react/dynamic";
import { ModeToggle } from "../moon-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import IrisLogo from "@/assets/Logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";
import { Link } from "react-router";

type Links = { label: string; href: string; icon: IconName };

const links: Links[] = [
  { label: "New Chat", href: "/new", icon: "plus" },
  { label: "Stock Screener", href: "/screener", icon: "chart-gantt" },
  { label: "Recent History", href: "/#history", icon: "clock" },
];

const ChatSidebar = () => {
  const { open } = useSidebar();

  return (
    <div className="">
      <Sidebar className="border-none py-3 " collapsible="icon">
        <SidebarHeader className="p-3">
          <div className="flex items-center gap-3 w-full">
            {/* Logo container */}
            <div className="flex items-center justify-center h-10 w-10 rounded-xl border bg-background">
              <IrisLogo />
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="flex flex-col px-3 py-5 gap-2">
          {links.map(({ icon, label,href }) => (
            <Link to={href} className="flex cursor-pointer  h-10 items-center">
              <div className="p-3 flex items-center justify-center h-10 w-10 border rounded-xl">
                <DynamicIcon
                  size={20}
                  className="text-slate-700 dark:text-slate-200"
                  key={label}
                  name={icon}
                />
              </div>
              <p className=" ml-2 w-full text-sm rounded-lg p-2 text-nowrap px-3 hover:bg-accent/60">
                {label}
              </p>
            </Link >
          ))}
        </SidebarContent>
        <SidebarFooter className="items-center gap-5 px-3">
          <SidebarMenu className="">
            <SidebarMenuItem>
              <ModeToggle />
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarMenu>
            <SidebarMenuItem>
              <Avatar className="h-[2.3rem] w-[2.3rem]">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </div>
  );
};

export default ChatSidebar;
