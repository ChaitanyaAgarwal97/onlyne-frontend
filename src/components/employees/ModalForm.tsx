"use client"

import { Employee } from "@/types/Employee"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

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

import { cn } from "@/lib/utils"
import { formatDate } from "@/lib/formatter"
import { CalendarIcon, CircleX, LoaderCircle } from "lucide-react"
import { useFormState } from "react-dom"
import { addEmployeeAction } from "@/actions/addEmployeeAction"
import { useRef } from "react"
import { randomUUID } from "crypto"
import { EmployeeSchema } from "@/zodSchema/employeeSchema"

export function ModalForm({ employee, }: {
    employee?: Employee
}) {
    const [state, formAction, isPending] = useFormState(addEmployeeAction, {
        issues: [],
    })

    const form = useForm<Employee>({
        resolver: zodResolver(EmployeeSchema),
        defaultValues: {
            idCardImageUrl: employee?.idCardImageUrl ?? "",
            employeeId: employee?.employeeId ?? "",
            designation: employee?.designation ?? "",
            status: employee?.status ?? "ACTIVE",
            office: employee?.office ?? "",
            doj: employee?.doj ?? "",
            ...(state?.fields ?? {})
        },
    })

    const formRef = useRef<HTMLFormElement>(null);

    return (
        <ScrollArea>
            {state?.issues?.length !== 0 &&
                <ul className="text-rose-500">
                    {state?.issues?.map(issue => <li key={randomUUID()}><CircleX size={30} /> {issue}</li>)}
                </ul>
            }
            <Form {...form}>
                <form ref={formRef} action={formAction} onSubmit={form.handleSubmit(() => formRef.current?.submit(), (error) => console.log(error))} className="space-y-8">
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
                                    <Input placeholder="Enter Email Address" type="email" {...field} disabled={employee !== undefined} />
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
                                <FormLabel className="block">DOJ</FormLabel>
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
                    <Button type="submit" variant={"primary"}>
                        {!isPending && <div>Submit</div>}
                        {isPending && <div><LoaderCircle size={28} className="animate-spin" /> Loading...</div>}
                    </Button>
                </form>
            </Form>
        </ScrollArea>
    )
}
