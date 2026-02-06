import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { ShoppingCart } from "lucide-react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md w-fit text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-primary-foreground hover:bg-primary/90",
                destructive:
                    "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
                outline:
                    "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
                link: "text-primary underline-offset-4 hover:underline",
                meu: "bg-violet-600 text-white hover:bg-violet-700",
                meu2: "bg-white text-black",
                addCart:
                    "rounded-full cursor-pointer bg-violet-600 text-white  shadow-[0_1px_0_0_rgba(0,0,0,0.12)] hover:bg-violet-700 active:translate-y-[1px]",
                buy: "rounded-full cursor-pointer bg-black dark:bg-white text-white dark:text-black shadow-[0_1px_0_0_rgba(0,0,0,0.12)] dark:hover:bg-black dark:hover:text-white transition-all ease-in-out duration-300",
            },
            size: {
                default: "h-9 px-4 py-2 has-[>svg]:px-3",
                sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
                lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
                xl: "h-12 rounded-3xl px-10 has-[>svg]:px-12 text-lg ",
                xxl: "h-12 w-[313px] rounded-3xl px-12 has-[>svg]:px-12 text-lg ",
                icon: "size-9",
                "icon-sm": "size-8",
                "icon-lg": "size-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
);

function Button({
    className,
    variant = "default",
    size = "default",
    asChild = false,
    children,
    ...props
}) {
    const Comp = asChild ? Slot : "button";
    const showCartIcon = variant === "addCart" && !asChild;

    return (
        <Comp
            data-slot="button"
            data-variant={variant}
            data-size={size}
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        >
            {showCartIcon ? <ShoppingCart /> : null}
            {children}
        </Comp>
    );
}

export { Button, buttonVariants };
