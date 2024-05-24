import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/app/components/ui/form"

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import qs from "query-string";
import { FileUploader } from "../FileUploader";
import { Button } from "../ui/button";
import { LoaderCircle } from "lucide-react";

const formSchema = z.object({
    fileUrl: z.string().min(1, {
        message: "File is required"
    })
})

export default function MessageFileModal({
    apiUrl,
    query, }: {
        apiUrl: string
        query: Record<string, any>
    }) {
    const [isPending, setIsPending] = useState<boolean>(false);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fileUrl: "",
        },
    })

    async function submitHandler(data: z.infer<typeof formSchema>) {
        try {
            setIsPending(true);

            const url = qs.stringifyUrl({
                url: apiUrl || "",
                query
            })

            let res = await fetch(url, {
                method: "POST",
                body: JSON.stringify({
                    ...data,
                    content: data.fileUrl
                }),
                headers: {
                    "Content-Type": "application/json",
                }
            });

            form.reset();
            router.refresh();
            window.location.reload();
        } catch (error) {
            console.log(error);
        } finally {
            setIsPending(false);
        }
    }

    return (

        <Form {...form}>
            <form onSubmit={form.handleSubmit(submitHandler)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="fileUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FileUploader value={field.value} onChange={field.onChange} endpoint="messageFile" />
                        </FormItem>
                    )}
                />
                <Button type="submit" variant={"primary"} aria-disabled={isPending}>
                    {!isPending && <div>Submit</div>}
                    {isPending && <div className="flex space-x-4 items-center"><LoaderCircle size={28} className="animate-spin" /> <p>Loading...</p></div>}
                </Button>
            </form>
        </Form>
    )
}