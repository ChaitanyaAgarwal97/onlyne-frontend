"use client"
import * as z from "zod"
import qs from "query-string"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
} from "@/app/components/ui/form"
import { Input } from "@/app/components/ui/input"
import { FileDiff, Paperclip, Plus, Smile, SmileIcon } from "lucide-react"
import { Modal } from "../Modal"
import MessageFileModal from "./MessageFileModal"
import { EmojiPicker } from "../EmojiPicker"
// import { EmojiPicker } from "@/app/components/emoji-picker"

interface ChatInputProps {
    apiUrl: string
    query: Record<string, any>
    name: string
    type: "conversation" | "channel"
}

const formSchema = z.object({
    content: z.string().min(1),
})

export const ChatInput = ({
    apiUrl,
    query,
    name,
    type,
}: ChatInputProps) => {
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: ""
        }
    })
    const isLoading = form.formState.isSubmitting

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: apiUrl,
                query,
            })

            await fetch(url, {
                method: "POST",
                body: JSON.stringify(values),
                headers: {
                    "Content-type": "application/json"
                }
            })
            form.reset()
            router.refresh()
        } catch (error) {
            console.log(error)
        };
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="relative p-4 pb-6">
                                    <Modal title={"Send Attachment"} trigger={<button
                                        type="button"
                                        onClick={() => console.log("clicked")}
                                        className="absolute top-5 left-7 h-10 w-10 bg-[hsl(287,60%,90%)] dark:bg-[hsl(287,60%,9%)] hover:bg-[hsl(287,60%,85%)] dark:hover:bg-[hsl(287,60%,11%)] transition rounded-full p-2 flex items-center justify-center"
                                    >
                                        <Paperclip />
                                    </button>} form={<MessageFileModal apiUrl={apiUrl} query={query} />} />

                                    <Input
                                        disabled={isLoading}
                                        className="px-14 py-6 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 "
                                        placeholder={`Message ${type === "conversation" ? name : "#" + name}`}
                                        {...field}
                                    >
                                    </Input>
                                    <div
                                        className="absolute top-7 right-8"
                                    >
                                        <EmojiPicker
                                            onChange={(emoji: string) => field.onChange(`${field.value} ${emoji}`)}
                                        />
                                    </div>
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    )
}