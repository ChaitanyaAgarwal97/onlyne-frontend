import {
    Card,
    CardContent,
} from "@/app/components/ui/card"
import Image from "next/image";

import { formatDate } from "@/lib/formatter";

export default function IDCard() {
    return (
        <Card className={"p-0 h-full w-[20rem] hover:shadow-lg hover:shadow-[hsl(287,60%,40%)] hover:scale-105 transition-transform"}>
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
            <Card className={"w-[95%] py-1 absolute rounded-3xl px-2 bottom-3 bg-[hsl(287,60%,90%)] dark:bg-gradient-to-b dark:from-[hsl(287,60%,20%)] dark:to-[hsl(287,60%,5%)]"}>
                <CardContent className="mx-auto p-2">
                    <p className="text-xl block w-fit mx-auto mb-6">ID: 313092-31321</p>
                    <div>
                        <p className="text-lg">Chaitanya Agarwal</p>
                        <p className="text-sm dark:text-gray-400 text-gray-600">Web Developer, Dallas</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// function IDCardFields({ label, value, className }: { label: string, value: string, className?: string }) {
//     return (
//         <div className={className}>
//             <p className={"text-black dark:text-[hsl(287,60%,50%)] text-xs"}>{label}</p>
//             <p className={"text-sm text-[hsl(287,60%,40%)] dark:text-white"}>{value}</p>
//         </div>
//     );
// }