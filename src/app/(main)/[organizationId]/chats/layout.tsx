import { ReactNode } from "react";

import ChatSideNavBar from "@/app/components/chats/ChatSideNavBar";

export default function ChatLayout({ children, params }: { children: ReactNode, params: { organizationId: string } }) {
    return (
        <div className="h-full md:flex">
            <div className="w-fit h-full hidden md:block">
                <ChatSideNavBar organizationId={params.organizationId} />
            </div>
            {children}
        </div>
    );
}