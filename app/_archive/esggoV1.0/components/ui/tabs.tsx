"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TabsContextProps {
    value: string;
    onValueChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextProps | undefined>(undefined);

export function Tabs({ value, defaultValue, onValueChange, className, children }: any) {
    const [currentValue, setCurrentValue] = React.useState(value || defaultValue);

    React.useEffect(() => {
        if (value) setCurrentValue(value);
    }, [value]);

    const handleValueChange = (val: string) => {
        setCurrentValue(val);
        onValueChange?.(val);
    };

    return (
        <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
            <div className={cn("w-full", className)}>{children}</div>
        </TabsContext.Provider>
    );
}

export function TabsList({ className, ...props }: any) {
    return (
        <div
            className={cn(
                "inline-flex h-10 items-center justify-center rounded-md bg-stone-100 p-1 text-stone-500",
                className
            )}
            {...props}
        />
    );
}

export function TabsTrigger({ value, className, ...props }: any) {
    const context = React.useContext(TabsContext);
    const isActive = context?.value === value;

    return (
        <button
            type="button"
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
                isActive ? "bg-white text-stone-950 shadow-sm" : "hover:text-stone-900",
                className
            )}
            onClick={() => context?.onValueChange(value)}
            {...props}
        />
    );
}

export function TabsContent({ value, className, ...props }: any) {
    const context = React.useContext(TabsContext);
    if (context?.value !== value) return null;

    return (
        <div
            className={cn(
                "mt-2 ring-offset-white focus-visible:outline-none",
                className
            )}
            {...props}
        />
    );
}
