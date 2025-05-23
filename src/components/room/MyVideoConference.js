'use client';

import {
    ParticipantTile,
    useTracks,
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import { useEffect, useState } from 'react';

export default function MyVideoConference() {
    const cameraTracks = useTracks(
        [{ source: Track.Source.Camera, withPlaceholder: true }],
        { onlySubscribed: false }
    ).filter((t) => t.source === Track.Source.Camera);

    const localTrack = cameraTracks.find((t) => t.participant.isLocal);
    const remoteTracks = cameraTracks.filter((t) => !t.participant.isLocal);

    const screenTracks = useTracks(
        [{ source: Track.Source.ScreenShare, withPlaceholder: false }],
        { onlySubscribed: true }
    );
    const screenShareTrack = screenTracks[0];

    const [pinnedId, setPinnedId] = useState(null);

    useEffect(() => {
        if (!pinnedId && (remoteTracks.length > 0 || localTrack)) {
            setPinnedId((remoteTracks[0] ?? localTrack)?.participant.identity);
        }
    }, [remoteTracks, localTrack, pinnedId]);

    const pinnedTrack = cameraTracks.find(
        (t) => t.participant.identity === pinnedId
    );
    const otherTracks = [...remoteTracks];
    if (localTrack) otherTracks.push(localTrack);

    return (
        <div className="relative w-full h-[calc(100vh-var(--lk-control-bar-height))] bg-black">
            {screenShareTrack ? (
                <ParticipantTile
                    trackRef={screenShareTrack}
                    participant={screenShareTrack.participant}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
            ) : (
                pinnedTrack && (
                    <ParticipantTile
                        trackRef={pinnedTrack}
                        participant={pinnedTrack.participant}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                )
            )}

            {otherTracks.length > 0 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                    {otherTracks
                        .filter((t) => t.participant.identity !== pinnedId)
                        .map((track) => (
                            <div
                                key={track.participant.identity}
                                onClick={() => setPinnedId(track.participant.identity)}
                                className="relative w-28 h-20 md:w-32 md:h-24 border border-white rounded overflow-hidden cursor-pointer shadow-md"
                            >
                                <ParticipantTile
                                    trackRef={track}
                                    participant={track.participant}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
}