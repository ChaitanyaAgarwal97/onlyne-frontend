"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Modal } from "@/app/components/Modal";
import { Applicant, ApplicantForm } from "../ApplicantForm";


export const columns: ColumnDef<Applicant & { id: string }>[] = [
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
        accessorKey: "status",
        header: "Status"
    },
    {
        accessorKey: "office",
        header: "Office"
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const applicant = row.original;

            return (
                <Modal form={<ApplicantForm applicant={applicant} />} title="Edit Applicant" contentClasses="md:h-[90%]">
                    Edit
                </Modal>
            )
        },
    },
]
