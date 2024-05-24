"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"

import { CircleX, LoaderCircle } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/app/components/ui/form"
import { Input } from "@/app/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/components/ui/select"
import { ScrollArea } from "@/app/components/ui/scroll-area"
import { FileUploader } from "@/app/components/FileUploader"
import { useToast } from "@/app/components/ui/use-toast"
import { z } from "zod"
import { ApplicantSchema } from "@/zodSchema/applicantSchema"
import qs from "query-string"

export type Applicant = z.infer<typeof ApplicantSchema>;

export function ApplicantForm({ applicant }: { applicant?: Applicant & { id: string } }) {
    const { organizationId } = useParams<{ organizationId: string }>();

    const router = useRouter();

    const [state, setState] = useState<{ message: string, issues: string[], fields?: Applicant }>({
        message: "",
        issues: [],
    });

    const [isPending, setIsPending] = useState<boolean>(false);

    const { toast } = useToast();

    const form = useForm<Applicant>({
        resolver: zodResolver(ApplicantSchema),
        defaultValues: {
            resumeUrl: applicant?.resumeUrl ?? "",
            name: applicant?.name ?? "",
            designation: applicant?.designation ?? "",
            status: applicant?.status ?? "RECEIVED",
            office: applicant?.office ?? "",
            email: applicant?.email ?? "",
            ...(state?.fields ?? {})
        },
    })

    useEffect(() => {
        if (state?.message === "success") {
            if (!applicant) {
                toast({
                    description: "Applicant Added!"
                });
            } else {
                toast({
                    description: "Applicant Updated!"
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
    }, [state?.message, form, toast, router, applicant])

    async function submitHandler(data: Applicant) {
        try {
            setIsPending(true);

            let method = "POST";
            let url = "/api/applicants";
            if (applicant) {
                method = "PATCH";
                url = `/api/applicants/${applicant.id}`
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
            <Form {...form}>
                <form onSubmit={form.handleSubmit(submitHandler)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="resumeUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Resume</FormLabel>
                                <FileUploader value={field.value} onChange={field.onChange} endpoint="applicantFile" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter Applicant's Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter Applicant's Email Address" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="designation"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Designation</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter Applicant's Applied Designation" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Application Status</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="dark:bg-[hsl(287,60%,15%)] bg-[hsl(287,60%,75%)]">
                                            <SelectValue placeholder="Select Application Status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="dark:bg-[hsl(287,60%,15%)] bg-[hsl(287,60%,75%)]">
                                        <SelectItem value="RECEIVED">Application Received</SelectItem>
                                        <SelectItem value="SCHEDULED">Interview Scheduled</SelectItem>
                                        <SelectItem value="OFFEREXTENDED">Offer Extended</SelectItem>
                                        <SelectItem value="HIRED">Hired</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="office"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Office</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter Office" {...field} />
                                </FormControl>
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
        </ScrollArea>
    )
}
