'use client';

import { useRouter } from 'next/navigation';
import { Button } from 'antd';

export default function JoinRoomButton({
    roomName,
    userName,
    patientId,
    recordId,
    appointmentId,
    openInNewTab = false,
    buttonText = 'Join Room',
    type = 'primary',
}) {
    const router = useRouter();

    const handleJoin = async () => {
        if (!roomName || !userName) {
            console.error('❌ Thiếu roomName hoặc userName!');
            return;
        }

        const params = new URLSearchParams();
        params.set('room', roomName);
        params.set('name', userName);
        if (patientId !== undefined) params.set('patientId', String(patientId));
        if (recordId !== undefined) params.set('recordId', String(recordId));
        if (appointmentId !== undefined) params.set('appointmentId', String(appointmentId));

        try {
            const res = await fetch(`/api/join-token?${params.toString()}`);
            const data = await res.json();

            if (!res.ok || !data.token) {
                throw new Error(data.error || 'Không tạo được token');
            }

            const url = `/room?data=${encodeURIComponent(data.token)}`;
            if (openInNewTab) {
                window.open(url, '_blank', 'width=1000,height=800');
            } else {
                router.push(url);
            }
        } catch (err) {
            console.error('❌ Lỗi khi join room:', err);
        }
    };

    return (
        <Button
            type={type}
            onClick={handleJoin}
            size="large"
            className="rounded-md"
        >
            {buttonText}
        </Button>
    );
}
