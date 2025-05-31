import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useEffect } from "react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  // Apply/remove the 'dark' class on the <html> element for global dark mode
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="relative px-3 py-1.5 flex items-center justify-between gap-2 rounded-full border-2 transition-colors duration-300 ease-in-out"
    >
      {theme === 'light' ? (
        <>
          <Moon className="h-4 w-4 transition-all" />
          <span className="text-xs font-medium">Dark</span>
        </>
      ) : (
        <>
          <Sun className="h-4 w-4 text-amber-300 transition-all" />
          <span className="text-xs font-medium">Light</span>
        </>
      )}
    </Button>
  );
}
