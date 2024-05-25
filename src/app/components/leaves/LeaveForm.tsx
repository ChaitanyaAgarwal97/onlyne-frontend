"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"

import { CalendarIcon, CircleX, LoaderCircle } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/app/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/components/ui/select"
import { ScrollArea } from "@/app/components/ui/scroll-area"
import { useToast } from "@/app/components/ui/use-toast"
import { z } from "zod"
import { LeaveSchema } from "@/zodSchema/leaveSchema"
import { Textarea } from "../ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { cn } from "@/lib/utils"
import { formatDate } from "@/lib/formatter"
import { Calendar } from "../ui/calendar"
import { error } from "console"

export type Leave = z.infer<typeof LeaveSchema>;

export function LeaveForm({ leave }: { leave?: Leave & { id: string } }) {
    const params = useParams<{ organizationId: string }>();

    let organizationId = "";
    if (!!params) {
        organizationId = params.organizationId;
    }

    const router = useRouter();

    const [state, setState] = useState<{ message: string, issues: string[], fields?: Leave }>({
        message: "",
        issues: [],
    });

    const [isPending, setIsPending] = useState<boolean>(false);

    const { toast } = useToast();

    const form = useForm<Leave>({
        resolver: zodResolver(LeaveSchema),
        defaultValues: {
            status: leave?.status ?? "APPLIED",
            reason: leave?.reason ?? "",
            from: leave?.from ?? "",
            to: leave?.to ?? "",
            rejoinedOn: leave?.rejoinedOn && leave.rejoinedOn !== "-" ? leave.rejoinedOn : "",
            ...(state?.fields ?? {})
        },
    })

    useEffect(() => {
        if (state?.message === "success") {
            if (!leave) {
                toast({
                    description: "Applied for leave!"
                });
            } else {
                toast({
                    description: "Leave Updated!"
                });
            }
            form.reset();
            setState({
                message: "",
                issues: [],
            })
            router.refresh();
            window.location.reload();
        }
    }, [state?.message, form, toast, router, leave])

    async function submitHandler(data: Leave) {
        try {
            setIsPending(true);

            let method = "POST";
            let url = "/api/leaves";
            if (leave) {
                method = "PATCH";
                url = `/api/leaves/${leave.id}`
            }

            let res = await fetch(url, {
                method: method,
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                }
            });
            res = await res.json()

            setState({
                // @ts-ignore
                message: res.message,
                // @ts-ignore
                issues: res.issues,
                // @ts-ignore
                fields: res.fields
            });
        } catch (error) {
            console.log(error);
        } finally {
            setIsPending(false);
        }
    }

    return (
        <ScrollArea>
            {state?.issues?.length !== 0 &&
                <ul className="text-rose-500 my-2">
                    {state?.issues?.map((issue, index) => <li key={`${issue}-${index}`} className="flex space-x-2 items-center"><CircleX size={17} /> <p>{issue}</p></li>)}
                </ul>
            }
            < Form {...form}>
                <form onSubmit={form.handleSubmit(submitHandler, (error) => console.log(error))} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="reason"
                        render={({ field }) => (
                            <FormItem hidden={!!leave}>
                                <FormLabel>Reason</FormLabel>
                                <FormControl>
                                    <Textarea className="resize-none focus:outline-none" placeholder="Enter Reason for Leave" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="from"
                        render={({ field }) => (
                            <FormItem hidden={!!leave}>
                                <FormLabel className="block">From</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"primary"}
                                                className={cn(
                                                    "w-[240px] pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    formatDate(new Date(field.value))
                                                ) : (
                                                    <span>Pick a from date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={new Date(field.value)}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="to"
                        render={({ field }) => (
                            <FormItem hidden={!!leave}>
                                <FormLabel className="block">To</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"primary"}
                                                className={cn(
                                                    "w-[240px] pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    formatDate(new Date(field.value))
                                                ) : (
                                                    <span>Pick a to date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={new Date(field.value)}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="rejoinedOn"
                        render={({ field }) => (
                            <FormItem hidden={!leave}>
                                <FormLabel className="block">Rejoined On</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"primary"}
                                                className={cn(
                                                    "w-[240px] pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    formatDate(new Date(field.value))
                                                ) : (
                                                    <span>Pick the date of rejoining</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={new Date(field.name)}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date > new Date() || date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem hidden={!leave}>
                                <FormLabel>Application Status</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="dark:bg-[hsl(287,60%,15%)] bg-[hsl(287,60%,75%)]">
                                            <SelectValue placeholder="Select Application Status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="dark:bg-[hsl(287,60%,15%)] bg-[hsl(287,60%,75%)]">
                                        <SelectItem value="APPLIED">Applied</SelectItem>
                                        <SelectItem value="ON_HOLD">On Hold</SelectItem>
                                        <SelectItem value="APPROVED">Approved</SelectItem>
                                        <SelectItem value="REJECTED">Rejected</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" variant={"primary"} aria-disabled={isPending}>
                        {!isPending && <div>Submit</div>}
                        {isPending && <div className="flex space-x-4 items-center"><LoaderCircle size={28} className="animate-spin" /> <p>Loading...</p></div>}
                    </Button>
                </form>
            </Form>
        </ScrollArea >
    )
}
