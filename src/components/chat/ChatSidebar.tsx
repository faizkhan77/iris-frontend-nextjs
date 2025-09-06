import { DynamicIcon } from "lucide-react/dynamic";
import type { IconName } from "lucide-react/dynamic";
import { ModeToggle } from "../moon-toggle";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import IrisLogo from "@/assets/Logo";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";

type Links = { label: string; href: string; icon: IconName };

const links: Links[] = [
  { label: "New Chat", href: "/", icon: "plus" },
  { label: "Search Chats", href: "/", icon: "search" },
  { label: "Recent History", href: "/", icon: "message-circle-more" },
];

const ChatSidebar = () => {
  const {open} = useSidebar()

  return (
  <div className="">
    <Sidebar className="border-none" collapsible="icon">
      <SidebarHeader className="p-2">
        <div className="flex mt-3 gap-3 w-full">
          <IrisLogo />
          <div className={open ? "" : "hidden"}>
            <h1 className="font-medium">Iris AI</h1>
            <p className="text-muted-foreground text-nowrap text-[12px]">by Brainfog Agency</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex flex-col px-3 py-5 gap-3">
        {links.map(({ icon, label }) => (
          <div className="flex cursor-pointer  h-10 items-center">
            <div className="p-3 flex items-center justify-center h-10 w-10 border rounded-xl">
              <DynamicIcon
                size={18}
                className="text-slate-700 dark:text-slate-200"
                key={label}
                name={icon}
              />
            </div>
            <p className=" ml-2 w-full text-sm rounded-xl p-2 text-nowrap px-3 hover:bg-accent/60">
              {label}
            </p>
          </div>
        ))}

        <SidebarMenu>
          <SidebarMenuItem>
            <ModeToggle />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  </div>
);
}

export default ChatSidebar;
