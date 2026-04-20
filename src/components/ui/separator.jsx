import { cn } from "@/lib/utils";

function Separator({ className, orientation = "horizontal", decorative = true, ...props }) {
    return (
        <div
            role={decorative ? "none" : "separator"}
            aria-orientation={orientation}
            data-orientation={orientation}
            data-slot="separator"
            className={cn(
                "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
                className,
            )}
            {...props}
        />
    );
}

export { Separator };
