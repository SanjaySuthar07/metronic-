'use client';
import { useEffect, useState } from "react";

export const useTheme = () => {
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const applyTheme = (mode: string) => {
            document.documentElement.classList.remove("light", "dark");
            document.documentElement.classList.add(mode);
            setTheme(mode);
        };

        let themeMode = localStorage.getItem('kt-theme');

        if (!themeMode) {
            if (document.documentElement.hasAttribute('data-kt-theme-mode')) {
                themeMode = document.documentElement.getAttribute('data-kt-theme-mode') || "light";
            } else {
                themeMode = "system";
            }
        }

        if (themeMode === "system") {
            applyTheme(mediaQuery.matches ? "dark" : "light");

            const handleChange = (e: MediaQueryListEvent) => {
                applyTheme(e.matches ? "dark" : "light");
            };

            mediaQuery.addEventListener("change", handleChange);

            return () => {
                mediaQuery.removeEventListener("change", handleChange);
            };
        } else {
            applyTheme(themeMode);
        }
    }, []);

    const changeTheme = (mode: "light" | "dark" | "system") => {
        localStorage.setItem("kt-theme", mode);

        if (mode === "system") {
            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.classList.remove("light", "dark");
            document.documentElement.classList.add(isDark ? "dark" : "light");
            setTheme(isDark ? "dark" : "light");
        } else {
            document.documentElement.classList.remove("light", "dark");
            document.documentElement.classList.add(mode);
            setTheme(mode);
        }
    };

    return { theme, changeTheme };
};