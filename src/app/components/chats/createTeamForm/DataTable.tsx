"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    ColumnFiltersState,
    getFilteredRowModel,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/app/components/ui/table"
import { Input } from "@/app/components/ui/input"

import { useEffect, useState } from "react"
import { Button } from "@/app/components/ui/button"
import { CircleX, LoaderCircle } from "lucide-react"
import { useToast } from "@/app/components/ui/use-toast"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[],
    teamId: String,
}

export function DataTable<TData, TValue>({ columns, data, teamId }: DataTableProps<TData, TValue>) {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )

    const [rowSelection, setRowSelection] = useState({})

    const [state, setState] = useState<{ message: string, issues: string[] }>();

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            columnFilters,
            rowSelection
        },
    })

    const [isPending, setIsPending] = useState<boolean>(false);

    const { toast } = useToast();

    useEffect(() => {
        if (state?.message === "success") {
            toast({
                description: "Employees successfully added to team!"
            })
            setState({
                message: "",
                issues: [],
            })
        }
    }, [state?.message])

    const selectedRows = table.getFilteredSelectedRowModel().rows;

    async function submitButtonHandler() {
        try {
            if (selectedRows.length) {
                setIsPending(true);

                let selectedEmployeesId: string[] = [];
                selectedEmployeesId = selectedRows.map(row => row.original?.id);

                const data = {
                    selectedEmployeesId: selectedEmployeesId,
                    teamId: teamId,
                }

                let method = "POST";

                let res = await fetch("/api/teams/members", {
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
                });
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsPending(false);
        }

    }

    return (
        <div>
            {state?.issues?.length !== 0 &&
                <ul className="text-rose-500 my-2">
                    {state?.issues?.map((issue, index) => <li key={`${issue}-${index}`} className="flex space-x-2 items-center"><CircleX size={17} /> <p>{issue}</p></li>)}
                </ul>}
            <div className="lg:my-2">
                <div className="flex items-center py-4 justify-between">
                    <Input
                        placeholder="Filter by Employee ID..."
                        value={(table.getColumn("employeeId")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("employeeId")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                </div>
                <div className="rounded-md border">
                    <Table className="dark:bg-[hsl(287,60%,10%)] bg-[hsl(287,60%,80%)]">
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id} className="dark:hover:bg-[hsl(287,60%,15%)] hover:bg-[hsl(287,60%,75%)]">
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        className="dark:hover:bg-[hsl(287,60%,15%)]  hover:bg-[hsl(287,60%,75%)]"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow className="dark:hover:bg-[hsl(287,60%,15%)] hover:bg-[hsl(287,60%,75%)]">
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <Button type="button" variant={"primary"} aria-disabled={isPending} onClick={submitButtonHandler}>
                {!isPending && <div>Submit</div>}
                {isPending && <div className="flex space-x-4 items-center"><LoaderCircle size={28} className="animate-spin" /> <p>Loading...</p></div>}
            </Button>
        </div>
    )
}
