"use client"

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

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
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { useFormState } from "react-dom";
import { CircleX, LoaderCircle } from "lucide-react";
import { createOrganizationAction } from "@/actions/createOrganizationAction";
import { OrganizationSchema } from "@/zodSchema/organizationSchema";
import { redirect } from "next/navigation";

export default function CreateForm() {
    const [state, formAction, isPending] = useFormState(createOrganizationAction, {
        issues: [],
    })

    const form = useForm<z.infer<typeof OrganizationSchema>>({
        resolver: zodResolver(OrganizationSchema),
        defaultValues: {
            name: "",
            ...(state?.fields ?? {})
        }
    })

    if (state?.message === "success") {
        return redirect(`/${state?.organizationId}/dashboard`)
    }

    return (
        <ScrollArea>
            {state?.issues?.length !== 0 &&
                <ul className="text-rose-500">
                    {state?.issues?.map((issue, index) => <li key={`${issue}-${index}`} className="flex space-x-2"><CircleX size={24} /> <span>{issue}</span></li>)}
                </ul>
            }
            <Form {...form}>
                <form action={formAction} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter Name of Organization" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" variant={"primary"}>
                        {!isPending && <div>Submit</div>}
                        {isPending && <div><LoaderCircle size={28} className="animate-spin" /> Loading...</div>}
                    </Button>
                </form>
            </Form>
        </ScrollArea>
    )
}