import { LoaderCircle } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

import qs from "query-string"
import { useRouter } from "next/navigation";

export default function ChatDeleteModal({ apiUrl, query }: {
    apiUrl: string
    query: Record<string, any>
}) {
    const [isPending, setIsPending] = useState<boolean>(false);
    const router = useRouter();

    async function deleteButtonHandler() {
        try {
            setIsPending(true)
            const url = qs.stringifyUrl({
                url: apiUrl,
                query,
            })

            await fetch(url, {
                method: "DELETE",
            })
            router.refresh()
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="my-4">
            <p className="my-4">Are you sure to delete this message?</p>
            <Button onClick={deleteButtonHandler} variant={"destructive"} className="float-right">
                {!isPending && <div>Delete</div>}
                {isPending && <div className="flex space-x-4 items-center"><LoaderCircle size={28} className="animate-spin" /> <p>Loading...</p></div>}
            </Button>
        </div>
    )
}