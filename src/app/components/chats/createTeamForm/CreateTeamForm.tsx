"use client"

import { Employee, Profile } from "@prisma/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { TeamSchema } from "@/zodSchema/teamSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Form, FormControl, FormField, FormLabel, FormMessage, FormItem, FormDescription } from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { CircleX, LoaderCircle } from "lucide-react";
import { DataTable } from "./DataTable";
import { columns } from "./ColumnDefinitions";

export type EmployeeData = {
    id: string;
    employeeId: string;
    name: string;
    designation: string;
    role: string;
}

export type Team = z.infer<typeof TeamSchema>

export default function CreateTeamForm({ data, userId }: { data?: (Employee & { profile: Profile })[], userId: string, }) {
    // Data to populate add team member table
    let employeeData: EmployeeData[] = []
    if (data) {
        employeeData = data.map(ele => {
            return {
                id: ele.id,
                employeeId: ele.employeeId,
                name: ele.profile.name,
                designation: ele.designation,
                role: ele.role,
            }
        })
    }

    const params = useParams<{ organizationId: string }>();

    let organizationId = "";
    if (params) organizationId = params.organizationId;

    const [state, setState] = useState<{ message: string, issues: string[], fields?: Team }>({
        message: "",
        issues: [],
    });
    const [isPending, setIsPending] = useState<boolean>(false);
    const [teamId, setTeamId] = useState<string>("");
    const form = useForm<Team>({
        resolver: zodResolver(TeamSchema),
        defaultValues: {
            name: "",
            createdById: userId,
            organizationId: organizationId,
            ...(state?.fields ?? [])
        }
    })

    const [nextPage, setNextPage] = useState<boolean>(false);

    const router = useRouter();

    useEffect(() => {
        if (state?.message === "success") {
            form.reset();
            setState({
                message: "",
                issues: [],
            })
            setNextPage(true);
            router.refresh();
        }
    }, [state?.message, form, router])

    async function submitHandler(data: Team) {
        try {
            setIsPending(true);

            let method = "POST";

            let res = await fetch("/api/teams", {
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
                fields: res.fields,
            });

            // @ts-ignore
            if (res.teamId && res.teamId !== "") setTeamId(res.teamId);
            else setTeamId("");
        } catch (error) {
            console.log(error);
        } finally {
            setIsPending(false);
        }
    }


    return (
        <ScrollArea>
            {!nextPage &&
                <div>
                    {state?.issues?.length !== 0 &&
                        <ul className="text-rose-500 my-2">
                            {state?.issues?.map((issue, index) => <li key={`${issue}-${index}`} className="flex space-x-2 items-center"><CircleX size={17} /> <p>{issue}</p></li>)}
                        </ul>}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(submitHandler, (error) => console.log(error))} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="organizationId"
                                render={({ field }) => (
                                    <FormItem hidden={true} aria-hidden={true}>
                                        <FormLabel>Organization ID</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="createdById"
                                render={({ field }) => (
                                    <FormItem hidden={true} aria-hidden={true}>
                                        <FormLabel>CreatedBy ID</FormLabel>
                                        <FormControl>
                                            <Input {...field} hidden={true} />
                                        </FormControl>
                                        <FormMessage />
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
                                            <Input placeholder="Enter Team Name" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            This will your public display team name.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" variant={"primary"} aria-disabled={isPending}>
                                {!isPending && <div>Next</div>}
                                {isPending && <div className="flex space-x-4 items-center"><LoaderCircle size={28} className="animate-spin" /> <p>Loading...</p></div>}
                            </Button>
                        </form>
                    </Form>
                </div>}
            {nextPage && <DataTable data={employeeData} columns={columns} teamId={teamId} />}
        </ScrollArea>
    );
}