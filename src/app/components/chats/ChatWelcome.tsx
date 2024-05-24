import { Hash } from "lucide-react"

interface ChatWelcomeProps {
    name: string
    type: "channel" | "conversation"
}

export default function ChatWelcome({
    name,
    type
}: ChatWelcomeProps) {
    return (
        <div className="space-y-e px-4 mb-4">
            {type === "channel" && (
                <div className="h-[75px] w-[75px] my-4 rounded-full bg-[hsl(287,60%,70%)] dark:bg-[hsl(287,60%,20%)] flex items-center justify-center">
                    <Hash className="h-12 w-12 text-white" />
                </div>
            )}
            <p className="text-xl md:text-3xl font-bold">
                {type === "channel" ? "Welcome to #" : ""}{name}
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                {type === "channel"
                    ? `This is the start of the #${name} channel.`
                    : `This is the start of your conversarion with ${name}`
                }
            </p>

        </div>
    )
}