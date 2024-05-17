import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/dist/server/api-utils";
interface ServerIdPageProps{
    params:{ 
        serverId: string ;
    }
}
const ServerIdPage = async ({params}: ServerIdPageProps)=>{
    const profile = await currentProfile();

    if(!profile){
        return RedirectToSignIn
    }

    const server = await db.server.findUnique({
        where:{
            id: params.serverId,
            members: {
                some: {
                    profileId: profile.id,
                }
            }
        },
        include: {
            channels: {
                where: {
                    name: "general"
                },
                orderBy: {
                    createdAt: "asc"
                }
            }
        }
    })

    const initialchannel = server?.channels[0]

    if(initialchannel?.name!=="general"){
        return null;
    }

    return redirect(`/servers/${params.serverId}/channels/${initialchannel?.id}`)

}
export default ServerIdPage 