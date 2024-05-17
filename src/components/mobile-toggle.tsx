import { Menu } from "lucide-react"

import {
    Sheet, 
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet" 
import { Button } from "@/components/ui/button"
import { NavigationSidebar } from "@/compontents/navigation/navigation-sidebar"
import { ServerSidebar } from "@/components/server/server-sidebar"

export const MobileToggle =()=>{
    return(
       <Sheet>
        <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
                <Menu></Menu>
            </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 flex gap-0">
            <div className="w-[72px]">
                 <NavigationSidebar></NavigationSidebar>
            </div>
            <ServerSidebar> </ServerSidebar>
        </SheetContent>
       </Sheet>
    )
}