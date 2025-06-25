"use client";
import { useState, useEffect } from "react";
import "../styles/globals.css";

export default function RootLayout({ children }) 
{
  const [theme, setTheme] = useState("light");

  useEffect(() => 
    {
      const stored = localStorage.getItem("theme") || "light";
      setTheme(stored);
      document.body.classList.add(stored);
    }, []);

  const toggleTheme = () => 
  {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.body.classList.replace(theme, next);
    localStorage.setItem("theme", next);
  };

  return (
    <html>
      <body>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>
        {children}
      </body>
    </html>
  );
}
