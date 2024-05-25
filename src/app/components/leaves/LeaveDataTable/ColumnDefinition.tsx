"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Modal } from "@/app/components/Modal";
import { Leave, LeaveForm } from "../LeaveForm";


export const columns: ColumnDef<Leave & { id: string, appliedBy: string, handledBy?: string, isManager: boolean, isApplicant: boolean }>[] = [
    {
        accessorKey: "appliedBy",
        header: "Applied By"
    },
    {
        accessorKey: "reason",
        header: "Reason"
    },
    {
        accessorKey: "from",
        header: "From"
    },
    {
        accessorKey: "to",
        header: "To"
    },
    {
        accessorKey: "rejoinedOn",
        header: "Rejoined On"
    },
    {
        accessorKey: "status",
        header: "Status"
    },
    {
        accessorKey: "handledBy",
        header: "Handled By"
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const leave = row.original;

            if (!leave.isManager || leave.isApplicant) return <div />;

            return (
                <Modal form={<LeaveForm leave={leave} />} title="Edit Leave" contentClasses="md:h-[90%]" >
                    Edit
                </Modal >
            )
        },
    },
]
