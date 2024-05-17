"use client"

import { Employee } from "@/types/Employee"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { cn } from "@/lib/utils"
import { formatDate } from "@/lib/formatter"
import { EmployeeSchema } from "@/zodSchema/employeeSchema"
import { useState } from "react"
import { useParams } from "next/navigation"



import { CalendarIcon, CircleX, LoaderCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileUploader } from "@/components/FileUploader"
import { useToast } from "@/components/ui/use-toast"

export function ModalForm({ employee }: {
    employee?: Employee,
}) {
    const { organizationId } = useParams<{ organizationId: string }>();

    const [state, setState] = useState<{ message: string, issues: string[], fields?: Employee }>({
        message: "",
        issues: [],
    });

    const [isPending, setIsPending] = useState<boolean>(false);

    const { toast } = useToast();

    const form = useForm<Employee>({
        resolver: zodResolver(EmployeeSchema),
        defaultValues: {
            idCardImageUrl: employee?.idCardImageUrl ?? "",
            employeeId: employee?.employeeId ?? "",
            designation: employee?.designation ?? "",
            status: employee?.status ?? "ACTIVE",
            office: employee?.office ?? "",
            doj: employee?.doj ?? "",
            email: employee?.email ?? "",
            organizationId: organizationId,
            ...(state?.fields ?? {})
        },
    })

    if (state?.message === "success") {
        if (!employee) {
            toast({
                description: "Employee added to organization!"
            });
        } else {
            toast({
                description: "Employee's data updated!"
            });
        }
        form.reset();
        setState({
            message: "",
            issues: [],
        })
    }

    async function submitHandler(data: Employee) {
        try {
            setIsPending(true);

            let method = "POST";
            if (employee) {
                method = "PATCH"
            }

            let res = await fetch("/api/employees", {
                method: method,
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                }
            });
            res = await res.json()

            setState({
                message: res.message,
                issues: res.issues,
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
                        name="organizationId"
                        render={({ field }) => (
                            <FormItem hidden={true}>
                                <FormLabel>Organization ID</FormLabel>
                                <FormControl>
                                    <Input {...field} disabled={true} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="idCardImageUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>ID Card Image</FormLabel>
                                <FileUploader value={field.value} onChange={field.onChange} endpoint="idCardImageUploader" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="employeeId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Employee ID</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter Employee ID" {...field} disabled={employee !== undefined} />
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
                                    <Input placeholder="Enter Email Address" {...field} disabled={employee !== undefined} />
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
                                    <Input placeholder="Enter Designation" {...field} />
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
                                <FormLabel>Status</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="dark:bg-[hsl(287,60%,15%)] bg-[hsl(287,60%,75%)]">
                                            <SelectValue placeholder="Select Status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="dark:bg-[hsl(287,60%,15%)] bg-[hsl(287,60%,75%)]">
                                        <SelectItem value="ACTIVE">Active</SelectItem>
                                        <SelectItem value="PROBATION">Probation</SelectItem>
                                        <SelectItem value="ONLEAVE">On Leave</SelectItem>
                                        <SelectItem value="EXEMPLOYEE">Ex Employee</SelectItem>
                                        <SelectItem value="PARTTIME">Part Time</SelectItem>
                                        <SelectItem value="INTERN">Intern</SelectItem>
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
                    <FormField
                        control={form.control}
                        name="doj"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="block">Date of Joining</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                disabled={employee !== undefined}
                                                variant={"primary"}
                                                className={cn(
                                                    "w-[240px] pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    formatDate(new Date(field.value))
                                                ) : (
                                                    <span>Pick a date</span>
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
                    <Button type="submit" variant={"primary"} aria-disabled={isPending}>
                        {!isPending && <div>Submit</div>}
                        {isPending && <div className="flex space-x-4 items-center"><LoaderCircle size={28} className="animate-spin" /> <p>Loading...</p></div>}
                    </Button>
                </form>
            </Form>
        </ScrollArea>
    )
}
