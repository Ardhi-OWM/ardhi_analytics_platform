"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeSwitcher = () => {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const ICON_SIZE = 24;
    const ICON_SIZE_SM = 16;

    return (
        <DropdownMenu >
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size={"sm"} className="border-none  hover:bg-transparent ">
                    {(() => {
                        let IconComponent;
                        if (theme === "light") {
                            IconComponent = (
                                <div className="border rounded-full p-2  hover:bg-green-500/[.25]">
                                    <Sun key="light" size={ICON_SIZE} className="text-muted-foreground" />
                                </div>
                            );
                        } else if (theme === "dark") {
                            IconComponent = (
                                <div className="border rounded-full p-2 hover:bg-green-500/[.25]">
                                    <Moon key="dark" size={ICON_SIZE} className="text-muted-foreground" />
                                </div>
                            );
                        } else {
                            IconComponent = (
                                <div className="border rounded-full p-2 hover:bg-green-500/[.25]">
                                    <Laptop key="system" size={ICON_SIZE} className="text-muted-foreground" />
                                </div>
                            );
                        }
                        return IconComponent;
                    })()}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className=" dark:bg-gray-800 bg-white shadow-lg z-[9999] mt-1 mr-2"
                align="start">
                <DropdownMenuRadioGroup
                    value={theme}
                    onValueChange={(e) => setTheme(e)}
                >
                    <DropdownMenuRadioItem className="flex gap-2" value="light">
                        <Sun size={ICON_SIZE_SM} className="text-muted-foreground" />{" "}
                        <span>Light</span>
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem className="flex gap-2" value="dark">
                        <Moon size={ICON_SIZE_SM} className="text-muted-foreground" />{" "}
                        <span>Dark</span>
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem className="flex gap-2" value="system">
                        <Laptop size={ICON_SIZE_SM} className="text-muted-foreground" />{" "}
                        <span>System</span>
                    </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export { ThemeSwitcher };
