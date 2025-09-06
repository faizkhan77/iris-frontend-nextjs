import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  const handleClick = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="p-[0.6rem] relative  w-fit border rounded-full"
      >
        <Sun
          size={15}
          className="h-[1.2rem] text-slate-700 dark:text-slate-200 w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
        />
        <Moon
          size={15}
          className="absolute text-slate-700 dark:text-slate-200 top-[10px] h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
        />
        <span className="sr-only">Toggle theme</span>
      </button>
    </>
  );
}
