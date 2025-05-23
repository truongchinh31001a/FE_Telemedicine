import { AccessToken } from 'livekit-server-sdk';
import { checkUserInRoom } from '@/models/appointmentModel';

export async function generateLiveKitToken({ room, name, user }) {
    const { userId, staffId, patientId } = user;

    const isAllowed = await checkUserInRoom(room, staffId, patientId);
    if (!isAllowed) throw new Error('Access denied for this room');

    const at = new AccessToken(
        process.env.LIVEKIT_API_KEY,
        process.env.LIVEKIT_API_SECRET,
        {
            identity: `${userId}`,
            name
        }
    );

    at.addGrant({
        room,
        roomJoin: true,
        canPublish: true,
        canSubscribe: true
    });

    return await at.toJwt();
}
