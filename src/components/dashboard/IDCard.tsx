import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Image from "next/image";

import { formatDate } from "@/lib/formatter";

export default function IDCard() {
    return (
        <Card className={"p-0 h-[38rem] w-[27rem] hover:shadow-2xl hover:shadow-[hsl(287,60%,40%)] hover:scale-105 transition-transform"}>
            <CardContent className={"p-0 first:relative h-full"}>
                <Image src={"/id card photo.jpg"} fill className={"rounded-lg"} alt="Id card photo" />
                <IDCardDataCard />
            </CardContent>
        </Card>
    );
}

function IDCardDataCard() {
    return (
        <div className={"flex justify-center"}>
            <Card className={"w-[95%] py-5 rounded-3xl absolute bottom-3 bg-[hsl(287,60%,90%)] dark:bg-[hsl(287,60%,5%)]"}>
                <CardContent className="grid grid-cols-2 grid-rows-3 gap-x-3 gap-y-2 mx-auto">
                    <IDCardFields label="Employee ID" value="12138912" className={"col-span-2"} />
                    <IDCardFields label="Name" value="Chaitanya Agarwal" />
                    <IDCardFields label="Date of Joining" value={formatDate(new Date())} />
                    <IDCardFields label="Department" value="Technical" />
                    <IDCardFields label="Position" value="Web developer" />

                </CardContent>

            </Card>
        </div>
    );
}

function IDCardFields({ label, value, className }: { label: string, value: string, className?: string }) {
    return (
        <div className={className}>
            <p className={"text-black dark:text-white text-sm"}>{label}</p>
            <p className={"text-xl text-[hsl(287,60%,40%)] dark:text-[hsl(287,60%,50%)]"}>{value}</p>
        </div>
    );
}