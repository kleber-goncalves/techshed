"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const Switch = React.forwardRef(function Switch(
    {
        className,
        checked = false,
        onCheckedChange,
        disabled = false,
        id,
        name,
        value,
        ...props
    },
    ref,
) {
    function handleToggle() {
        if (disabled) return;
        onCheckedChange?.(!checked);
    }

    return (
        <button
            type="button"
            role="switch"
            id={id}
            name={name}
            value={value}
            ref={ref}
            disabled={disabled}
            aria-checked={checked}
            data-state={checked ? "checked" : "unchecked"}
            onClick={handleToggle}
            className={cn(
                "focus-visible:border-ring focus-visible:ring-ring/50 inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-transparent bg-input shadow-xs transition-colors outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
                className,
            )}
            {...props}
        >
            <span
                data-state={checked ? "checked" : "unchecked"}
                className="pointer-events-none block size-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
            />
        </button>
    );
});

export { Switch };
