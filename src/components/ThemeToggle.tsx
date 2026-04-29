"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-8 h-8" />;
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      style={{
        padding: "0.4rem",
        borderRadius: "9999px",
        border: `1px solid var(--border)`,
        background: "var(--bg-surface)",
        color: "var(--text-muted)",
        cursor: "pointer",
        transition: "all 0.2s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun style={{ width: "1rem", height: "1rem" }} />
      ) : (
        <Moon style={{ width: "1rem", height: "1rem" }} />
      )}
    </button>
  );
}
