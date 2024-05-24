import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/app/components/ui/tooltip"


export default function ToolTip({ children, toolTipContent }: { children: React.ReactNode, toolTipContent: String }) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent side="top">
                    {toolTipContent}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );

}