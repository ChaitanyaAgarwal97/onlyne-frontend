import IDCard from "@/components/dashboard/IDCard";

import { auth } from "@clerk/nextjs/server";

export default function DashBoardPage() {
    const { userId, redirectToSignIn } = auth();

    if (!userId) {
        return redirectToSignIn();
    }
    return (
        <div className={"grid grid-cols-1 lg:grid-cols-4 lg:grid-rows-3 gap-8 mx-8 my-8"} >
            <div className={"row-span-2 col-span-1"}>
                <IDCard />
            </div>

        </div>
        // <p>Hello from dashboard</p>

    );
}