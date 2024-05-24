"use client"

import { UploadDropzone } from "@/lib/uploadthing";

import "@uploadthing/react/styles.css"
import { FileIcon, X } from "lucide-react";

import Image from "next/image";

export const FileUploader = ({ endpoint, onChange, value }: { endpoint: "idCardImageUploader" | "messageFile" | "applicantFile", onChange: (url?: string) => void, value: string }) => {
    const fileType = value?.split(".").pop();

    if (value && fileType !== "pdf") {
        return (
            <div className="relative h-80 w-72 mx-auto">
                <Image fill src={value} alt="id card image" className="rounded-3xl" />
                <button className="absolute top-0 right-0 bg-rose-500 rounded-full p-1 text-[hsl(287,60%,90%)] shadow-sm" type="button" onClick={() => onChange("")} >
                    <X className="h-4 w-4" />
                </button>
            </div>
        )
    }

    if (value && fileType === "pdf") {
        return (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-[hsl(287,60%,20%)]">
                <FileIcon className="h-16 w-16 fill-[hsl(123,60%,80%)] stroke-[hsl(123,60%,70%)]" />
                <a href={value} target="_blank" rel="noopener noreferrer" className="ml-2 text-lg text-[hsl(123,60%,60%)] dark:text-[hsl(123,60%,70%)] hover:underline">
                    {value}
                </a>
                <button className="absolute -top-2 -right-2 bg-rose-500 rounded-full p-1 text-[hsl(287,60%,90%)] shadow-sm" type="button" onClick={() => onChange("")} >
                    <X className="h-4 w-4" />
                </button>
            </div>
        )
    }

    return (
        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
                onChange(res?.[0].url);
            }}
            onUploadError={(error: Error) => {
                alert(`ERROR! ${error.message}`);
            }}
        />
    );
}