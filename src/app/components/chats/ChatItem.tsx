"use client"

import * as z from "zod"
import qs from "query-string"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Employee, Profile, Role } from '@prisma/client';
import { Edit, FileIcon, ReceiptPoundSterling, ShieldAlert, ShieldCheck, Trash } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from "next/navigation"
import UserAvatar from "@/app/components/UserAvatar"
import ToolTip from "@/app/components/ToolTip"
import { Label } from '@/app/components/ui/label';
import { cn } from '@/lib/utils';
import { Input } from "@/app/components/ui/input"
import { Button } from "@/app/components/ui/button"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
} from "@/app/components/ui/form"
import { Modal } from "../Modal"
import ChatDeleteModal from "./ChatDeleteModal"

interface ChatItemProps {
    id: string
    content: string
    employee: Employee & {
        profile: Profile
    }
    timestamp: string
    fileUrl: string | null
    deleted: boolean
    currentEmployee: Employee
    isUpdated: boolean
    socketUrl: string
    socketQuery: Record<string, string>
}

export const ChatItem = ({
    id,
    content,
    employee,
    timestamp,
    fileUrl,
    deleted,
    currentEmployee,
    isUpdated,
    socketUrl,
    socketQuery
}: ChatItemProps) => {
    const params = useParams()
    const router = useRouter()

    const fileType = fileUrl?.split(".").pop()

    const isOwner = currentEmployee.role === Role.OWNER
    const isManager = currentEmployee.role === Role.MANAGER
    const isSender = currentEmployee.id === employee.id
    const canDeleteMessages = !deleted && (isOwner || isManager || isSender)
    const isPDF = fileType === "pdf" && fileUrl
    const isImage = !isPDF && fileUrl

    return (
        <div className='relative group flex itemx-center hover:bg-black/5 p-4 transition w-full:'>
            <div className='group flex gap-x-2 items-start w-full'>
                <div className='cursor-pointer hover:drop-shadow-md transition'>
                    <UserAvatar src={employee.profile.profileImage} />
                </div>
                <div className='flex flex-col w-full'>
                    <div className='flex items-center gap-x-2'>
                        <div className='flex items-center'>
                            <p className='font-semibold text-sm cursor-pointer'>
                                {employee.profile.name}
                            </p>
                        </div>
                        <span className='text-xs text-zinc-500 dark:text-zinc-400'>
                            {timestamp}
                        </span>
                    </div>
                    {isImage && (
                        <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className='relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48'
                        >
                            <Image
                                src={fileUrl}
                                alt={content}
                                fill
                                className='object-cover'
                            />
                        </a>
                    )}
                    {
                        isPDF && (
                            <div className=' relative flex items-center p-2 mt-2 rounded-md bg-background/10'>
                                <FileIcon className='h-10 w-10 fill-indigo-200 stroke-indigo-400' />
                                <a
                                    href={fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className='ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline'>
                                    PDF File
                                </a>
                            </div>
                        )}
                    {!fileUrl && (
                        <p className={cn(
                            "text-sm text-zinc-600 dark:text-zinc-300", deleted && "italic text-zinc-500 dark:text-zinc-400 text-xs-mt-1"
                        )}>
                            {content}
                        </p>
                    )}
                </div>
            </div>
            {canDeleteMessages && (
                <div className='hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm'>
                    <Modal trigger={
                        <span>
                            <ToolTip toolTipContent="Delete">
                                <Trash
                                    onClick={() => { }}
                                    className='cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition' />
                            </ToolTip></span>} title="Delete Message" form={<ChatDeleteModal apiUrl={`${socketUrl}/${id}`} query={socketQuery} />} />
                </div>
            )}
        </div>
    )
}