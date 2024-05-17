"use clietnt"

import { 
    QueryClient,
    QueryClientProvider
} from "@tanstack/react-query"

import { useState } from "react"

export const QueryProvider = ({
    children
}: {
    children: React.ReactNode
})=>{
    const [quertClient] = useState(()=> new QueryClient())

    return (
        <QueryClientProvider client = {quertClient}>
            {children}
        </QueryClientProvider>
    )
}