import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="bg-[hsl(287,60%,20%)] space-y-4 h-full w-full flex flex-col justify-center items-center">
            <Loader2 className="h-20 w-20 animate-spin stroke-[hsl(287,60%,10%)]" />
            <p className="text-[hsl(287,60%,10%)] text-xl">Loading.....</p>

        </div>
    )
}