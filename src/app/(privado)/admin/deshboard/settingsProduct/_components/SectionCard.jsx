import { cn } from "@/lib/utils";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export const productFormCardClassName = "gap-0 border-border/60 shadow-sm";

export default function SectionCard({
    title,
    description,
    children,
    className,
    contentClassName = "space-y-4",
}) {
    return (
        <Card className={cn(productFormCardClassName, className)}>
            <CardHeader className="space-y-1.5 pb-5">
                <CardTitle className="text-lg">{title}</CardTitle>
                {description ? (
                    <CardDescription>{description}</CardDescription>
                ) : null}
            </CardHeader>

            <CardContent className={cn("pb-6", contentClassName)}>
                {children}
            </CardContent>
        </Card>
    );
}
