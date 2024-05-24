"use client"

import { useUser } from "@clerk/nextjs";
import {
    LiveKitRoom,
    VideoConference,
    GridLayout,
    ParticipantTile,
    RoomAudioRenderer,
    ControlBar,
    useTracks
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import "@livekit/components-styles"
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface MediaRoomProps {
    chatId: string;
    video: boolean;
    audio: boolean;
}

export default function MediaRoom({ chatId, video, audio }: MediaRoomProps) {
    const { user } = useUser();

    const [token, setToken] = useState<string>("");
    const [isRendered, setIsRendered] = useState<boolean>(false);

    useEffect(() => {
        setIsRendered(true);
    }, [])

    useEffect(() => {
        if (!user?.firstName || !user?.lastName || !user?.primaryEmailAddress) return;

        const name = `${user.firstName} ${user.lastName} ${user.primaryEmailAddress}`;

        (async () => {
            try {
                const resp = await fetch(
                    `/api/livekit?room=${chatId}&username=${name}`
                );
                const data = await resp.json();
                setToken(data.token);
            } catch (e) {
                console.error(e);
            }
        })();
    }, [user?.firstName, user?.lastName, user?.primaryEmailAddress, chatId])

    if (token === "") {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Loading...
                </p>
            </div>
        )
    }

    return (
        <LiveKitRoom
            video={video}
            audio={audio}
            token={token}
            serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
            data-lk-theme="default"
            connect={true}
            className="dark:bg-[hsl(287,60%,11%)] bg-[hsl(287,60%,90%)]"
        >
            {isRendered &&
                <VideoConference />
            }
        </LiveKitRoom>
    );
}

function MyVideoConference() {
    const tracks = useTracks(
        [
            { source: Track.Source.Camera, withPlaceholder: true },
            { source: Track.Source.ScreenShare, withPlaceholder: false },
        ],
        { onlySubscribed: false },
    );
    return (
        <GridLayout tracks={tracks} className="h-[calc(100vh - var(--lk-control-bar-height))]">
            <ParticipantTile />
        </GridLayout>
    );
}