"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Checkbox } from "@/app/components/ui/checkbox"

export type EmployeeDataTable = {
    id: string,
    employeeId: string,
    name: string,
    designation: string,
    role: string;
};

export const columns: ColumnDef<EmployeeDataTable>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
    },
    {
        accessorKey: "employeeId",
        header: "Employee ID"
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "role",
        header: "Role",
        size: 100
    },
    {
        accessorKey: "designation",
        header: "Designation"
    }
]
