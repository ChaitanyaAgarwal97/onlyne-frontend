"use client"

import { UploadDropzone } from "@/lib/uploadthing";

import "@uploadthing/react/styles.css"
import { X } from "lucide-react";

import Image from "next/image";

export const FileUploader = ({ endpoint, onChange, value }: { endpoint: "idCardImageUploader", onChange: (url?: string) => void, value: string }) => {
    const fileType = value?.split(".").pop();

    if (value && fileType !== "pdf") {
        console.log("present")
        return (
            <div className="relative h-80 w-72 mx-auto">
                <Image fill src={value} alt="id card image" className="rounded-3xl" />
                <button className="absolute top-0 right-0 bg-rose-500 rounded-full p-1 text-[hsl(287,60%,90%)] shadow-sm" type="button" onClick={() => onChange("")} >
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