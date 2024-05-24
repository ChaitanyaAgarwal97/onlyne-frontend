"use client"

import { ColumnDef } from "@tanstack/react-table"

// import { Checkbox } from "@/components/ui/checkbox"

import { Employee } from "@/types/Employee"
import { ModalForm } from "@/app/components/employees/ModalForm";
import { Modal } from "@/app/components/Modal";

export type EmployeeDataTable = Employee & { name: string };

export const columns: ColumnDef<EmployeeDataTable>[] = [
    // {
    //     id: "select",
    //     header: ({ table }) => (
    //         <Checkbox
    //             checked={
    //                 table.getIsAllPageRowsSelected() ||
    //                 (table.getIsSomePageRowsSelected() && "indeterminate")
    //             }
    //             onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //             aria-label="Select all"
    //         />
    //     ),
    //     cell: ({ row }) => (
    //         <Checkbox
    //             checked={row.getIsSelected()}
    //             onCheckedChange={(value) => row.toggleSelected(!!value)}
    //             aria-label="Select row"
    //         />
    //     ),
    // },
    {
        accessorKey: "employeeId",
        header: "Employee ID"
    },
    {
        accessorKey: "name",
        header: "Name"
    },
    {
        accessorKey: "email",
        header: "Email"
    },
    {
        accessorKey: "designation",
        header: "Designation"
    },
    {
        accessorKey: "role",
        header: "Role"
    },
    {
        accessorKey: "status",
        header: "Status"
    },
    // {
    //     accessorKey: "manager",
    //     header: "Manager"
    // },
    // {
    //     accessorKey: "team",
    //     header: "Team"
    // },
    {
        accessorKey: "office",
        header: "Office"
    },
    {
        accessorKey: "doj",
        header: "DOJ"
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const employee = row.original;

            return (
                <Modal form={<ModalForm employee={employee} />} title="Edit Employee" contentClasses="md:h-[90%]">
                    Edit
                </Modal>
            )
        },
    },
]
